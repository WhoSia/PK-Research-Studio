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
  const approved = item.publication_approved_at;
  const current = new Date(now);
  // Reject rollover dates (e.g. February 30), ambiguous local timestamps, and
  // non-string approvals. A publication approval is an authority-bearing event.
  if (typeof approved !== 'string' || Number.isNaN(current.valueOf())) return {allowed:false,reason:'INVALID_APPROVAL_DATE'};
  const dayOnly = /^\\d{4}-\\d{2}-\\d{2}$/.test(approved);
  const instant = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,3})?(?:Z|[+-]\\d{2}:\\d{2})$/.test(approved);
  if (!dayOnly && !instant) return {allowed:false,reason:'INVALID_APPROVAL_DATE'};
  const calendarDay = approved.slice(0,10);
  const calendarTime = Date.parse(calendarDay + 'T00:00:00Z');
  if (!Number.isFinite(calendarTime) || new Date(calendarTime).toISOString().slice(0,10) !== calendarDay) return {allowed:false,reason:'INVALID_APPROVAL_DATE'};
  const parsed = Date.parse(approved);
  if (!Number.isFinite(parsed)) return {allowed:false,reason:'INVALID_APPROVAL_DATE'};
  // Date-only approvals refer to the research team's calendar day (Asia/Seoul).
  // Timestamp approvals instead require their exact instant not to be in the future.
  if (dayOnly) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(current).map(x=>[x.type,x.value]));
    const today = parts.year+'-'+parts.month+'-'+parts.day;
    if (approved > today) return {allowed:false,reason:'INVALID_APPROVAL_DATE'};
  } else if (Date.parse(approved) > current.valueOf()) return {allowed:false,reason:'INVALID_APPROVAL_DATE'};
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
