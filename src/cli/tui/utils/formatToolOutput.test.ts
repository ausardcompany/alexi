/**
 * Tests for `guessLanguageFromPath` — regression coverage for the
 * C++20 module-interface extensions added in opencode `b2a3926`
 * ("add c++ module interface files to filetype map").
 */

import { describe, expect, it } from 'vitest';

import { guessLanguageFromPath } from './formatToolOutput.js';

describe('guessLanguageFromPath', () => {
  it('resolves TypeScript / JavaScript families', () => {
    expect(guessLanguageFromPath('foo.ts')).toBe('typescript');
    expect(guessLanguageFromPath('foo.tsx')).toBe('typescript');
    expect(guessLanguageFromPath('foo.mjs')).toBe('javascript');
  });

  it('resolves C/C++ sources', () => {
    expect(guessLanguageFromPath('main.c')).toBe('c');
    expect(guessLanguageFromPath('header.h')).toBe('c');
    expect(guessLanguageFromPath('main.cpp')).toBe('cpp');
    expect(guessLanguageFromPath('main.cc')).toBe('cpp');
    expect(guessLanguageFromPath('types.hpp')).toBe('cpp');
  });

  it('resolves C++20 module interface units (opencode b2a3926)', () => {
    // MSVC convention.
    expect(guessLanguageFromPath('math.ixx')).toBe('cpp');
    // Clang / standard convention.
    expect(guessLanguageFromPath('math.cppm')).toBe('cpp');
    // Vendor variants.
    expect(guessLanguageFromPath('math.ccm')).toBe('cpp');
    expect(guessLanguageFromPath('math.cxxm')).toBe('cpp');
    expect(guessLanguageFromPath('math.c++m')).toBe('cpp');
  });

  it('returns undefined for unknown or extension-less paths', () => {
    expect(guessLanguageFromPath('Makefile')).toBeUndefined();
    expect(guessLanguageFromPath('README')).toBeUndefined();
    expect(guessLanguageFromPath('mystery.xyz')).toBeUndefined();
  });
});
