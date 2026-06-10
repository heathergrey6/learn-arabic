import { useState, useMemo } from 'react';
import { FlashCard } from './FlashCard';
import './Quiz.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ cards, setName, onFinish, recordResult, undoResult, showRomanized }) {
  const [queue, setQueue] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState({ correct: [], incorrect: [] });
  const [history, setHistory] = useState([]);
  const [done, setDone] = useState(false);

  const current = queue[index];
  const total = queue.length;

  function handleAnswer(correct) {
    recordResult(current.id, correct);
    setHistory(h => [...h, { cardId: current.id, wasCorrect: correct }]);
    setResults(prev => ({
      correct: correct ? [...prev.correct, current] : prev.correct,
      incorrect: !correct ? [...prev.incorrect, current] : prev.incorrect,
    }));

    setTimeout(() => {
      if (index + 1 < total) {
        setIndex(i => i + 1);
      } else {
        setDone(true);
      }
    }, 200);
  }

  function handleUndo() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    undoResult(last.cardId, last.wasCorrect);
    setResults(prev => ({
      correct: last.wasCorrect ? prev.correct.slice(0, -1) : prev.correct,
      incorrect: !last.wasCorrect ? prev.incorrect.slice(0, -1) : prev.incorrect,
    }));
    if (done) {
      setDone(false);
    } else {
      setIndex(i => i - 1);
    }
  }

  function retryIncorrect() {
    const newQueue = shuffle(results.incorrect);
    setQueue(newQueue);
    setIndex(0);
    setResults({ correct: [], incorrect: [] });
    setHistory([]);
    setDone(false);
  }

  function retryAll() {
    const newQueue = shuffle(cards);
    setQueue(newQueue);
    setIndex(0);
    setResults({ correct: [], incorrect: [] });
    setHistory([]);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((results.correct.length / total) * 100);
    return (
      <div className="quiz-results">
        <h2 className="quiz-results__title">Round complete!</h2>
        <div className="quiz-results__score">
          <span className="quiz-results__pct">{pct}%</span>
          <span className="quiz-results__sub">
            {results.correct.length} / {total} correct
          </span>
        </div>

        {results.incorrect.length > 0 && (
          <div className="quiz-results__missed">
            <h3>Still learning ({results.incorrect.length})</h3>
            <ul className="quiz-results__list">
              {results.incorrect.map(c => (
                <li key={c.id}>
                  <span className="quiz-results__en">{c.english.replace(/\s*\(root:[^)]+\)/i, '')}</span>
                  <span className="quiz-results__arrow">→</span>
                  <span className="quiz-results__ar">{c.arabic}</span>
                  {showRomanized && (
                    <span className="quiz-results__rom">({c.romanized})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="quiz-results__actions">
          {results.incorrect.length > 0 && (
            <button className="btn btn--retry-wrong" onClick={retryIncorrect}>
              Retry missed words ({results.incorrect.length})
            </button>
          )}
          <button className="btn btn--retry-all" onClick={retryAll}>
            Redo full set
          </button>
          <button className="btn btn--back" onClick={onFinish}>
            Back to sets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz__header">
        <button className="quiz__back-btn" onClick={onFinish}>← Sets</button>
        <div className="quiz__title">{setName}</div>
        <div className="quiz__counter">{index + 1} / {total}</div>
      </div>

      <div className="quiz__progress-bar">
        <div
          className="quiz__progress-fill"
          style={{ width: `${((index) / total) * 100}%` }}
        />
      </div>

      <div className="quiz__tally">
        <span className="quiz__tally-correct">✓ {results.correct.length}</span>
        <span className="quiz__tally-incorrect">✗ {results.incorrect.length}</span>
      </div>

      <div className="quiz__card-area">
        <FlashCard
          key={current.id}
          card={current}
          showRomanized={showRomanized}
          onCorrect={() => handleAnswer(true)}
          onIncorrect={() => handleAnswer(false)}
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />
      </div>
    </div>
  );
}
