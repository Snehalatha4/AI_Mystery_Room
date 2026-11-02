export function evaluateAccusation(selectedSuspectId, storedCulpritSuspectId) {
  if (typeof selectedSuspectId !== 'string' || typeof storedCulpritSuspectId !== 'string') return false;
  return selectedSuspectId === storedCulpritSuspectId;
}
