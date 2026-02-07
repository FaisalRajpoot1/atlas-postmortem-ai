const HISTORY_KEY = 'atlas-analysis-history';
const MAX_ITEMS = 10;

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(incidentTitle, severity, postMortem) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    title: incidentTitle || 'Untitled Incident',
    severity: postMortem.impact?.severity || severity || 'P2',
    generatedAt: new Date().toISOString(),
    postMortem,
  };

  // Add to front, keep max items
  const updated = [entry, ...history].slice(0, MAX_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
