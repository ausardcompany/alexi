/**
 * Tests for MCP OAuth issuer-rotation detection — ports upstream
 * kilocode `84b26c697`.
 */

import { describe, it, expect } from 'vitest';
import {
  hasIssuerChanged,
  requireReregistration,
  type StoredOAuthClient,
  type DiscoveredOAuthMetadata,
} from '../oauth-issuer.js';

const DISCOVERED: DiscoveredOAuthMetadata = {
  issuer: 'https://new-tenant.example/auth',
  authorization_endpoint: 'https://new-tenant.example/auth/authorize',
  token_endpoint: 'https://new-tenant.example/auth/token',
};

describe('hasIssuerChanged', () => {
  it('returns false when there is no stored issuer yet (fresh install)', () => {
    expect(hasIssuerChanged(undefined, DISCOVERED)).toBe(false);
    expect(hasIssuerChanged({}, DISCOVERED)).toBe(false);
  });

  it('returns false when stored and discovered match exactly', () => {
    const stored: StoredOAuthClient = {
      issuer: DISCOVERED.issuer,
      authorization_endpoint: DISCOVERED.authorization_endpoint,
      client_id: 'abc',
    };
    expect(hasIssuerChanged(stored, DISCOVERED)).toBe(false);
  });

  it('returns true when the stored issuer differs', () => {
    const stored: StoredOAuthClient = {
      issuer: 'https://old-tenant.example/auth',
      authorization_endpoint: DISCOVERED.authorization_endpoint,
    };
    expect(hasIssuerChanged(stored, DISCOVERED)).toBe(true);
  });

  it('returns true when the authorization_endpoint differs', () => {
    const stored: StoredOAuthClient = {
      issuer: DISCOVERED.issuer,
      authorization_endpoint: 'https://old-tenant.example/auth/authorize',
    };
    expect(hasIssuerChanged(stored, DISCOVERED)).toBe(true);
  });

  it('returns true when authorization_endpoint is missing from stored (legacy record)', () => {
    const stored: StoredOAuthClient = {
      issuer: DISCOVERED.issuer,
    };
    expect(hasIssuerChanged(stored, DISCOVERED)).toBe(true);
  });
});

describe('requireReregistration', () => {
  it('returns "none" for an empty stored record', () => {
    expect(requireReregistration(undefined, DISCOVERED)).toBe('none');
  });

  it('returns "none" when the stored record is current', () => {
    const stored: StoredOAuthClient = {
      issuer: DISCOVERED.issuer,
      authorization_endpoint: DISCOVERED.authorization_endpoint,
    };
    expect(requireReregistration(stored, DISCOVERED)).toBe('none');
  });

  it('returns "issuer_rotated" when the AS has moved', () => {
    const stored: StoredOAuthClient = {
      issuer: 'https://old-tenant.example/auth',
      authorization_endpoint: 'https://old-tenant.example/auth/authorize',
      client_id: 'cached-client',
    };
    expect(requireReregistration(stored, DISCOVERED)).toBe('issuer_rotated');
  });
});
