/**
 * Validation utilities for CLI commands
 */
/**
 * List of valid conversation stages
 */
export const VALID_STAGES = [
    'architecture',
    'planning',
    'implementation',
    'documentation',
    'devops',
    'security'
];
/**
 * Check if a string is a valid conversation stage
 * @param stage - Stage string to validate
 * @returns True if the stage is valid
 */
export function isValidStage(stage) {
    return VALID_STAGES.includes(stage);
}
/**
 * Validate stage and exit with error if invalid
 * @param stage - Stage string to validate
 * @returns The validated stage (typed as ConversationStage)
 * @throws Exits process with code 1 if invalid
 */
export function validateStageOrExit(stage) {
    if (!isValidStage(stage)) {
        console.error(`Invalid stage: ${stage}`);
        console.error(`Valid stages: ${VALID_STAGES.join(', ')}`);
        process.exit(1);
    }
    return stage;
}
