/**
 * Tests for the SSE probe helpers.
 *
 * The classifier is the single source of truth for "what kind of MCP
 * endpoint did we probe?" — mistakes here directly cause probes to
 * either retry indefinitely (missed SSE header) or reject valid
 * endpoints (case-sensitive matching), so the case matrix is worth
 * exercising explicitly.
 */

import { describe, expect, it } from 'vitest';
import {
  classifyProbeContentType,
  isSseContentType,
  ScopedProbeFetch,
} from '../../src/mcp/sse-probe.js';

describe('sse-probe / classifyProbeContentType', () => {
  it('classifies canonical text/event-stream as sse', () => {
    expect(classifyProbeContentType('text/event-stream')).toBe('sse');
  });

  it('classifies case-varying text/event-stream as sse', () => {
    expect(classifyProbeContentType('Text/Event-Stream')).toBe('sse');
    expect(classifyProbeContentType('TEXT/EVENT-STREAM')).toBe('sse');
  });

  it('strips charset / parameters before matching sse', () => {
    expect(classifyProbeContentType('text/event-stream; charset=utf-8')).toBe('sse');
    expect(classifyProbeContentType('Text/Event-Stream ; charset=utf-8')).toBe('sse');
  });

  it('classifies application/json as json (streamable HTTP)', () => {
    expect(classifyProbeContentType('application/json')).toBe('json');
    expect(classifyProbeContentType('Application/JSON; charset=utf-8')).toBe('json');
  });

  it('classifies unrelated types as other', () => {
    expect(classifyProbeContentType('text/html')).toBe('other');
    expect(classifyProbeContentType('application/xml')).toBe('other');
  });

  it('treats missing / non-string content-type as other', () => {
    expect(classifyProbeContentType(null)).toBe('other');
    expect(classifyProbeContentType(undefined)).toBe('other');
    expect(classifyProbeContentType('')).toBe('other');
  });
});

describe('sse-probe / isSseContentType', () => {
  it('is true for any casing of text/event-stream', () => {
    expect(isSseContentType('text/event-stream')).toBe(true);
    expect(isSseContentType('Text/Event-Stream; charset=utf-8')).toBe(true);
  });

  it('is false for json and other types', () => {
    expect(isSseContentType('application/json')).toBe(false);
    expect(isSseContentType('text/html')).toBe(false);
    expect(isSseContentType(null)).toBe(false);
  });
});

describe('sse-probe / ScopedProbeFetch', () => {
  it('owns the initial probe URL', () => {
    const scope = new ScopedProbeFetch('https://mcp.example.com/sse');
    expect(scope.owns('https://mcp.example.com/sse')).toBe(true);
  });

  it('does NOT own unrelated URLs (fix for leaked fetch interception)', () => {
    const scope = new ScopedProbeFetch('https://mcp.example.com/sse');
    expect(scope.owns('https://sap-aicore.example.com/v2/inference')).toBe(false);
    expect(scope.owns('https://other-mcp.example.com/sse')).toBe(false);
  });

  it('tracks redirect hops so a redirected probe stays scoped', () => {
    const scope = new ScopedProbeFetch('https://mcp.example.com/sse');
    scope.recordRedirect('https://mcp.example.com/sse/v2');
    expect(scope.owns('https://mcp.example.com/sse/v2')).toBe(true);
    // Still does not leak to unrelated endpoints.
    expect(scope.owns('https://unrelated.example.com')).toBe(false);
  });

  it('normalises fragments and scheme casing', () => {
    const scope = new ScopedProbeFetch('HTTPS://mcp.example.com/sse#foo');
    expect(scope.owns('https://mcp.example.com/sse')).toBe(true);
    expect(scope.owns('https://mcp.example.com/sse#bar')).toBe(true);
  });

  it('accepts URL instances', () => {
    const scope = new ScopedProbeFetch('https://mcp.example.com/sse');
    expect(scope.owns(new URL('https://mcp.example.com/sse'))).toBe(true);
  });

  it('exposes a snapshot for debugging / tests', () => {
    const scope = new ScopedProbeFetch('https://mcp.example.com/sse');
    scope.recordRedirect('https://mcp.example.com/sse/v2');
    const snap = scope.snapshot();
    expect(snap).toHaveLength(2);
    expect(snap).toContain('https://mcp.example.com/sse');
    expect(snap).toContain('https://mcp.example.com/sse/v2');
  });
});
