/**
 * Question Tool - Ask the user questions during execution
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import {
  dismissQuestion,
  isQuestionDismissed,
  getCustomAnswer,
  clearQuestionState,
} from '../../bus/question-state.js';

const QuestionOptionSchema = z.object({
  label: z.string().describe('Display text (1-5 words)'),
  value: z.string().describe('Value to return when selected'),
  description: z.string().optional().describe('Explanation of choice'),
  i18nKey: z.string().optional().describe('Internationalization key'),
  mode: z
    .string()
    .optional()
    .describe('Optional agent/mode name to pre-select in the UI when this option is picked'),
});

const QuestionSchema = z.object({
  question: z.string().describe('Complete question'),
  header: z.string().max(30).describe('Short label (max 30 chars)'),
  options: z.array(QuestionOptionSchema).describe('Available choices'),
  multiple: z.boolean().optional().describe('Allow selecting multiple'),
});

const QuestionParamsSchema = z.object({
  questions: z.array(QuestionSchema).describe('Questions to ask'),
});

interface QuestionResult {
  answers: Array<{
    question: string;
    selected: string[];
  }>;
}

// Store for pending questions (to be answered by UI)
const pendingQuestions = new Map<
  string,
  {
    questions: z.infer<typeof QuestionParamsSchema>['questions'];
    resolve: (answers: QuestionResult['answers']) => void;
  }
>();

export const questionTool = defineTool<typeof QuestionParamsSchema, QuestionResult>({
  name: 'question',
  description: `Ask the user questions during execution to gather preferences or clarify requirements.

Usage:
- Use to get decisions on implementation choices
- Provide clear options with descriptions
- Header must be 30 chars or less
- Custom answer option is added automatically`,

  parameters: QuestionParamsSchema,

  async execute(params, context): Promise<ToolResult<QuestionResult>> {
    const { nanoid } = await import('nanoid');
    const questionId = nanoid();

    // Check if question was previously dismissed
    if (isQuestionDismissed(questionId)) {
      return {
        success: false,
        error: 'Question was dismissed by user',
      };
    }

    // In a full implementation, this would:
    // 1. Publish an event to the UI
    // 2. Wait for user response
    // 3. Return the selected answers

    // For now, return a placeholder indicating questions were asked
    // The TUI implementation will handle actual user interaction

    return new Promise((resolve) => {
      // Store the pending question for the UI to answer
      pendingQuestions.set(questionId, {
        questions: params.questions,
        resolve: (answers) => {
          pendingQuestions.delete(questionId);
          if (answers.length === 0) {
            // Empty answers indicate dismissal
            resolve({
              success: false,
              error: 'Question dismissed by user',
            });
          } else {
            resolve({
              success: true,
              data: { answers },
            });
          }
        },
      });

      // If no UI responds in 5 minutes, timeout
      setTimeout(
        () => {
          if (pendingQuestions.has(questionId)) {
            pendingQuestions.delete(questionId);
            clearQuestionState(questionId);
            resolve({
              success: false,
              error: 'Question timeout - no response received',
            });
          }
        },
        5 * 60 * 1000
      );

      // Also check for abort signal
      if (context.signal) {
        context.signal.addEventListener('abort', () => {
          if (pendingQuestions.has(questionId)) {
            pendingQuestions.delete(questionId);
            clearQuestionState(questionId);
            resolve({
              success: false,
              error: 'Operation aborted',
            });
          }
        });
      }
    });
  },
});

// Export for UI integration
export function getPendingQuestions(): Map<
  string,
  {
    questions: z.infer<typeof QuestionParamsSchema>['questions'];
    resolve: (answers: QuestionResult['answers']) => void;
  }
> {
  return pendingQuestions;
}

export function answerQuestion(
  questionId: string,
  answers: QuestionResult['answers'],
  dismissed?: boolean
): boolean {
  const pending = pendingQuestions.get(questionId);
  if (pending) {
    if (dismissed) {
      dismissQuestion(questionId);
      clearQuestionState(questionId);
      pending.resolve([]);
    } else {
      // Check for custom answers and prevent duplicates
      const processedAnswers = answers.map((answer) => {
        const customAnswer = getCustomAnswer(questionId);
        if (customAnswer && !answer.selected.includes(customAnswer)) {
          return {
            ...answer,
            selected: [...answer.selected, customAnswer],
          };
        }
        return answer;
      });
      clearQuestionState(questionId);
      pending.resolve(processedAnswers);
    }
    return true;
  }
  return false;
}
