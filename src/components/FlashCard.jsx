import { useState } from 'react';
import './FlashCard.css';

export function FlashCard({ card, showRomanized, onCorrect, onIncorrect, onUndo, canUndo }) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  function handleFlip() {
    if (!answered) setFlipped(f => !f);
  }

  function handleAnswer(correct) {
    setAnswered(true);
    if (correct) onCorrect();
    else onIncorrect();
  }

  const displayEnglish = card.english.replace(/\s*\(root:[^)]+\)/i, '');
  const rootMatch = card.english.match(/\(root:\s*([^)]+)\)/i);
  const root = rootMatch ? rootMatch[1].trim() : null;

  return (
    <div className="flashcard-scene">
      <div className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard__face flashcard__face--front">
          <span className="flashcard__label">English</span>
          <p className="flashcard__text">{displayEnglish}</p>
          {!flipped && <p className="flashcard__hint">tap to reveal Arabic</p>}
        </div>
        <div className="flashcard__face flashcard__face--back">
          <span className="flashcard__label">Arabic</span>
          <p className="flashcard__text flashcard__text--arabic">{card.arabic}</p>
          {showRomanized && (
            <p className="flashcard__romanized">{card.romanized}</p>
          )}
          {root && <p className="flashcard__root">root: {root}</p>}
        </div>
      </div>

      <div className="flashcard__actions">
        <div className="flashcard__actions-left">
          {canUndo && (
            <button className="btn btn--undo" onClick={onUndo}>↩</button>
          )}
        </div>
        <div className="flashcard__actions-right">
          {flipped && !answered && (
            <>
              <button className="btn btn--incorrect" onClick={() => handleAnswer(false)}>✗</button>
              <button className="btn btn--correct" onClick={() => handleAnswer(true)}>✓</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
