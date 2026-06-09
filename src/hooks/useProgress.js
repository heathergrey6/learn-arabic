import { useState, useCallback } from 'react';

const STORAGE_KEY = 'arabic_flashcard_progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// progress shape: { [cardId]: { correct: number, incorrect: number, lastSeen: iso string } }
export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const recordResult = useCallback((cardId, correct) => {
    setProgress(prev => {
      const entry = prev[cardId] ?? { correct: 0, incorrect: 0, lastSeen: null };
      const updated = {
        ...prev,
        [cardId]: {
          correct: entry.correct + (correct ? 1 : 0),
          incorrect: entry.incorrect + (correct ? 0 : 1),
          lastSeen: new Date().toISOString(),
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const undoResult = useCallback((cardId, wasCorrect) => {
    setProgress(prev => {
      const entry = prev[cardId];
      if (!entry) return prev;
      const newCorrect = Math.max(0, entry.correct - (wasCorrect ? 1 : 0));
      const newIncorrect = Math.max(0, entry.incorrect - (wasCorrect ? 0 : 1));
      const updated = { ...prev };
      if (newCorrect === 0 && newIncorrect === 0) {
        delete updated[cardId];
      } else {
        updated[cardId] = { ...entry, correct: newCorrect, incorrect: newIncorrect };
      }
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback((cardIds) => {
    setProgress(prev => {
      const updated = { ...prev };
      cardIds.forEach(id => delete updated[id]);
      saveProgress(updated);
      return updated;
    });
  }, []);

  return { progress, recordResult, undoResult, resetProgress };
}
