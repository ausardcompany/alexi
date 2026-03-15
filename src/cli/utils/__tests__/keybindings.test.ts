import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  KeypressHandler,
  cycleAgent,
  getAgentCycleOrder,
  formatHintsBar,
  type KeypressHandlerOptions,
  type KeypressKey,
  type LeaderAction,
} from '../keybindings.js';
import { colors } from '../colors.js';

describe('keybindings', () => {
  describe('getAgentCycleOrder', () => {
    it('should return all 5 built-in agents', () => {
      const order = getAgentCycleOrder();
      expect(order).toHaveLength(5);
      expect(order).toContain('code');
      expect(order).toContain('debug');
      expect(order).toContain('plan');
      expect(order).toContain('explore');
      expect(order).toContain('orchestrator');
    });

    it('should start with code agent', () => {
      const order = getAgentCycleOrder();
      expect(order[0]).toBe('code');
    });

    it('should return a consistent order', () => {
      const order1 = getAgentCycleOrder();
      const order2 = getAgentCycleOrder();
      expect(order1).toEqual(order2);
    });
  });

  describe('cycleAgent', () => {
    it('should cycle forward through agents', () => {
      expect(cycleAgent('code', false)).toBe('debug');
      expect(cycleAgent('debug', false)).toBe('plan');
      expect(cycleAgent('plan', false)).toBe('explore');
      expect(cycleAgent('explore', false)).toBe('orchestrator');
    });

    it('should wrap around from last to first', () => {
      expect(cycleAgent('orchestrator', false)).toBe('code');
    });

    it('should cycle backward through agents', () => {
      expect(cycleAgent('code', true)).toBe('orchestrator');
      expect(cycleAgent('debug', true)).toBe('code');
      expect(cycleAgent('plan', true)).toBe('debug');
    });

    it('should wrap around from first to last in reverse', () => {
      expect(cycleAgent('code', true)).toBe('orchestrator');
    });

    it('should default to code when currentAgent is undefined', () => {
      // Forward from code → debug
      expect(cycleAgent(undefined, false)).toBe('debug');
    });

    it('should start from beginning for unknown agents', () => {
      expect(cycleAgent('unknown', false)).toBe('code');
      expect(cycleAgent('unknown', true)).toBe('code');
    });
  });

  describe('formatHintsBar', () => {
    it('should show normal hints when not in leader mode', () => {
      const bar = formatHintsBar('code', false);
      expect(bar).toContain('Tab');
      expect(bar).toContain('switch agent');
      expect(bar).toContain('Ctrl+X');
      expect(bar).toContain('leader');
      expect(bar).toContain('/help');
    });

    it('should show leader key hints when in leader mode', () => {
      const bar = formatHintsBar('code', true);
      expect(bar).toContain('Ctrl+X:');
      expect(bar).toContain('[n]');
      expect(bar).toContain('[m]');
      expect(bar).toContain('[a]');
      expect(bar).toContain('[s]');
      expect(bar).toContain('[h]');
      expect(bar).toContain('ew session');
      expect(bar).toContain('odel');
      expect(bar).toContain('gents');
      expect(bar).toContain('tatus');
      expect(bar).toContain('elp');
    });

    it('should include ANSI color codes', () => {
      const bar = formatHintsBar(undefined, false);
      expect(bar).toContain(colors.dim);
      expect(bar).toContain(colors.reset);
    });
  });

  describe('KeypressHandler', () => {
    let handler: KeypressHandler;
    let options: KeypressHandlerOptions;
    let onTabCycleAgent: ReturnType<typeof vi.fn<(reverse: boolean) => void>>;
    let onLeaderAction: ReturnType<typeof vi.fn<(action: LeaderAction) => void>>;
    let onLeaderModeChange: ReturnType<typeof vi.fn<(active: boolean) => void>>;
    let onClearScreen: ReturnType<typeof vi.fn<() => void>>;

    beforeEach(() => {
      vi.useFakeTimers();
      onTabCycleAgent = vi.fn();
      onLeaderAction = vi.fn();
      onLeaderModeChange = vi.fn();
      onClearScreen = vi.fn();

      options = {
        onTabCycleAgent,
        onLeaderAction,
        onLeaderModeChange,
        onClearScreen,
      };

      handler = new KeypressHandler(options);
    });

    afterEach(() => {
      handler.dispose();
      vi.useRealTimers();
    });

    const key = (overrides: Partial<KeypressKey> = {}): KeypressKey => ({
      name: undefined,
      ctrl: false,
      meta: false,
      shift: false,
      sequence: undefined,
      ...overrides,
    });

    describe('Tab cycling', () => {
      it('should NOT call onTabCycleAgent on plain Tab (intercepted by readline completer)', () => {
        handler.setCurrentLineContent('');
        handler.handleKeypress(undefined, key({ name: 'tab' }));
        expect(onTabCycleAgent).not.toHaveBeenCalled();
      });

      it('should call onTabCycleAgent(true) on Shift+Tab when line is empty', () => {
        handler.setCurrentLineContent('');
        handler.handleKeypress(undefined, key({ name: 'tab', shift: true }));
        expect(onTabCycleAgent).toHaveBeenCalledWith(true);
      });

      it('should NOT call onTabCycleAgent when line has content', () => {
        handler.setCurrentLineContent('some text');
        handler.handleKeypress(undefined, key({ name: 'tab' }));
        expect(onTabCycleAgent).not.toHaveBeenCalled();
      });
    });

    describe('Ctrl+L clear screen', () => {
      it('should call onClearScreen on Ctrl+L', () => {
        handler.handleKeypress(undefined, key({ name: 'l', ctrl: true }));
        expect(onClearScreen).toHaveBeenCalled();
      });
    });

    describe('Leader key system', () => {
      it('should enter leader mode on Ctrl+X', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        expect(onLeaderModeChange).toHaveBeenCalledWith(true);
      });

      it('should fire new-session action on Ctrl+X then n', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        handler.handleKeypress(undefined, key({ name: 'n' }));
        expect(onLeaderAction).toHaveBeenCalledWith('new-session');
      });

      it('should fire model-picker action on Ctrl+X then m', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        handler.handleKeypress(undefined, key({ name: 'm' }));
        expect(onLeaderAction).toHaveBeenCalledWith('model-picker');
      });

      it('should fire agent-list action on Ctrl+X then a', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        handler.handleKeypress(undefined, key({ name: 'a' }));
        expect(onLeaderAction).toHaveBeenCalledWith('agent-list');
      });

      it('should fire status action on Ctrl+X then s', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        handler.handleKeypress(undefined, key({ name: 's' }));
        expect(onLeaderAction).toHaveBeenCalledWith('status');
      });

      it('should fire help action on Ctrl+X then h', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        handler.handleKeypress(undefined, key({ name: 'h' }));
        expect(onLeaderAction).toHaveBeenCalledWith('help');
      });

      it('should cancel leader mode on unknown key', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        expect(onLeaderModeChange).toHaveBeenCalledWith(true);

        handler.handleKeypress(undefined, key({ name: 'z' }));
        expect(onLeaderAction).not.toHaveBeenCalled();
        expect(onLeaderModeChange).toHaveBeenCalledWith(false);
      });

      it('should auto-cancel leader mode after timeout', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        expect(onLeaderModeChange).toHaveBeenCalledWith(true);

        vi.advanceTimersByTime(1500);
        expect(onLeaderModeChange).toHaveBeenCalledWith(false);
      });

      it('should exit leader mode after firing an action', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        handler.handleKeypress(undefined, key({ name: 'n' }));

        // Leader mode should be exited
        expect(onLeaderModeChange).toHaveBeenLastCalledWith(false);

        // Subsequent n key should NOT fire leader action
        onLeaderAction.mockClear();
        handler.handleKeypress(undefined, key({ name: 'n' }));
        expect(onLeaderAction).not.toHaveBeenCalled();
      });
    });

    describe('edge cases', () => {
      it('should ignore undefined key', () => {
        handler.handleKeypress(undefined, undefined);
        expect(onTabCycleAgent).not.toHaveBeenCalled();
        expect(onLeaderAction).not.toHaveBeenCalled();
        expect(onClearScreen).not.toHaveBeenCalled();
      });

      it('should clean up on dispose', () => {
        handler.handleKeypress(undefined, key({ name: 'x', ctrl: true }));
        handler.dispose();

        // Timeout should not fire after dispose
        vi.advanceTimersByTime(2000);
        // onLeaderModeChange was called with true (enter) and false (dispose cancel)
        expect(onLeaderModeChange).toHaveBeenCalledTimes(2);
      });

      it('should handle multiple dispose calls safely', () => {
        handler.dispose();
        handler.dispose(); // Should not throw
      });
    });
  });
});
