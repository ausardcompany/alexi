/**
 * Tests for Internationalization
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getLocale, setLocale, getTranslations, t, en } from './index.js';

describe('i18n', () => {
  beforeEach(() => {
    // Reset to default locale
    setLocale('en');
  });

  describe('getLocale', () => {
    it('should return default locale', () => {
      expect(getLocale()).toBe('en');
    });
  });

  describe('setLocale', () => {
    it('should set locale to en', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');
    });

    it('should fall back to en for unsupported locale', () => {
      // @ts-expect-error - Testing invalid locale
      setLocale('invalid');
      expect(getLocale()).toBe('en');
    });
  });

  describe('getTranslations', () => {
    it('should return translations for current locale', () => {
      const translations = getTranslations();
      expect(translations).toBe(en);
    });

    it('should include permission translations', () => {
      const translations = getTranslations();
      expect(translations.permission).toBeDefined();
      expect(translations.permission.approve).toBe('Approve');
      expect(translations.permission.deny).toBe('Deny');
      expect(translations.permission.requestingPermission).toBe('Requesting Permission');
    });
  });

  describe('t (translation function)', () => {
    it('should translate permission.approve', () => {
      expect(t('permission.approve')).toBe('Approve');
    });

    it('should translate permission.deny', () => {
      expect(t('permission.deny')).toBe('Deny');
    });

    it('should translate permission.requestingPermission', () => {
      expect(t('permission.requestingPermission')).toBe('Requesting Permission');
    });

    it('should translate nested keys', () => {
      expect(t('permission.readAccess')).toBe('Read Access');
      expect(t('permission.writeAccess')).toBe('Write Access');
      expect(t('permission.executeCommand')).toBe('Execute Command');
    });

    it('should return key path for missing translations', () => {
      expect(t('missing.key')).toBe('missing.key');
    });

    it('should handle deeply nested keys', () => {
      expect(t('common.tool')).toBe('Tool');
      expect(t('common.resource')).toBe('Resource');
    });
  });

  describe('Permission translations', () => {
    it('should have all required permission strings', () => {
      const permissionKeys = [
        'approve',
        'deny',
        'alwaysAllow',
        'neverAllow',
        'requestingPermission',
        'readAccess',
        'writeAccess',
        'executeCommand',
        'networkAccess',
        'adminAccess',
        'granted',
        'denied',
        'remembered',
      ];

      for (const key of permissionKeys) {
        expect(en.permission).toHaveProperty(key);
        expect(typeof en.permission[key as keyof typeof en.permission]).toBe('string');
      }
    });
  });
});
