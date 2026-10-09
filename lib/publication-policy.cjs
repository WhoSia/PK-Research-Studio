'use strict';

// Publication authorization is separate from feedback submission and review status.
// This module is deliberately pure: the browser must not decide authorization alone.
const PRIVATE_BY_DEFAULT = new Set(['FROZEN SOURCE', 'SUBMITTED FEEDBACK']);
const VALID_CLASSES = new Set(['FROZEN SOURCE', 'ACTIVE DERIVATIVE', 'SUBMITTED FEEDBACK', 'EXPERIMENT', 'HOLD', 'GRAVEYARD', 'BIBLIOGRAPHY']);

function publicationDecision(item, {now = new Date().toISOString()} = {}) {
  if (!item || !VALID_CLASSES.has(item.provenance)) return {allowed:false, reason:'INVALID_PROVENANCE'};
  if (item.visibility !== 'public') return {allowed:false, reason:'NOT_PUBLIC'};
  if (!item.publication_approved_by || !item.publication_approved_at || !item.approved_version || !item.version || item.approved_version !== item.version) {
    return {allowed:false, reason:'APPROVAL_MISSING_OR_STALE'};
  }
  if (Number.isNaN(Date.parse(item.publication_approved_at)) || item.publication_approved_at > now) return {allowed:false, reason:'INVALID_APPROVAL_DATE'};
  if (item.withdrawn_at || item.revoked_at) return {allowed:false, reason:'WITHDRAWN'};
  if (PRIVATE_BY_DEFAULT.has(item.provenance) && !(item.author_publication_consent === true && item.steward_publication_approval === true)) {
    return {allowed:false, reason:'AUTHOR_AND_STEWARD_REQUIRED'};
  }
  if (item.provenance === 'EXPERIMENT' && !(item.execution_receipt && item.execution_receipt.code_sha256 && item.execution_receipt.input_sha256 && item.execution_receipt.verified === true)) {
    return {allowed:false, reason:'UNVERIFIED_EXPERIMENT'};
  }
  if (item.provenance === 'BIBLIOGRAPHY' && item.includes_pdf_bytes === true && item.redistribution_rights_verified !== true) {
    return {allowed:false, reason:'COPYRIGHT_HOLD'};
  }
  return {allowed:true, reason:'APPROVED'};
}
module.exports = {publicationDecision};
