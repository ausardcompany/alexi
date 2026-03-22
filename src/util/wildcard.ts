/**
 * Wildcard utility re-export
 * This module re-exports wildcard functionality from the permission module
 * to support the @/util/wildcard import path used in drain functionality
 */

export { Wildcard, matchPattern, matchPatterns } from '../permission/wildcard.js';
