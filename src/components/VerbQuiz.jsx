import { useState } from 'react';
import { PRONOUNS, TENSES, IMPERATIVE_ONLY_PRONOUNS, gradeConjugation } from '../utils/gemini';
import './VerbQuiz.css';

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const IMPERATIVE_TENSES = ['imperative', 'negative imperative'];

function nextPrompt(cards) {
  const tense = pick(TENSES);
  const pool = IMPERATIVE_TENSES.includes(tense)
    ? PRONOUNS.filter(p => IMPERATIVE_ONLY_PRONOUNS.includes(p.english))
    : PRONOUNS;
  return { card: pick(cards), pronoun: pick(pool), tense };
}

export function VerbQuiz({ cards, onBack }) {
  const [prompt, setPrompt] = useState(() => nextPrompt(cards));
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  async function handleCheck() {
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await gradeConjugation(prompt.card, prompt.pronoun, prompt.tense, answer.trim());
      setResult(res);
      setScore(s => ({
        correct: s.correct + (res.correct ? 1 : 0),
        incorrect: s.incorrect + (res.correct ? 0 : 1),
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    setPrompt(nextPrompt(cards));
    setAnswer('');
    setResult(null);
    setError(null);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !result) handleCheck();
    if (e.key === 'Enter' && result) handleNext();
  }

  const { card, pronoun, tense } = prompt;

  return (
    <div className="verb-quiz">
      <div className="verb-quiz__header">
        <button className="verb-quiz__back-btn" onClick={onBack}>← Sets</button>
        <div className="verb-quiz__title">Verb Quiz</div>
        <div className="verb-quiz__score">
          <span className="verb-quiz__score-correct">✓ {score.correct}</span>
          <span className="verb-quiz__score-incorrect">✗ {score.incorrect}</span>
        </div>
      </div>

      <div className="verb-quiz__card">
        <div className="verb-quiz__meta">
          <span className="verb-quiz__tense">{tense} tense</span>
          <span className="verb-quiz__dot">·</span>
          <span className="verb-quiz__pronoun">
            {pronoun.arabic} <span className="verb-quiz__pronoun-en">({pronoun.english})</span>
          </span>
        </div>

        <div className="verb-quiz__verb">
          <div className="verb-quiz__verb-en">{card.english}</div>
          <div className="verb-quiz__verb-ar">{card.arabic}</div>
          <div className="verb-quiz__verb-rom">{card.romanized}</div>
        </div>

        {!result ? (
          <div className="verb-quiz__input-area">
            <input
              className="verb-quiz__input"
              type="text"
              placeholder="Type in Arabic or romanized…"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={loading}
              dir="auto"
            />
            <button
              className="verb-quiz__check-btn"
              onClick={handleCheck}
              disabled={loading || !answer.trim()}
            >
              {loading ? 'Checking…' : 'Check →'}
            </button>
            {error && <div className="verb-quiz__error">{error}</div>}
          </div>
        ) : (
          <div className={`verb-quiz__result ${result.correct ? 'verb-quiz__result--correct' : 'verb-quiz__result--incorrect'}`}>
            <div className="verb-quiz__result-verdict">
              {result.correct ? '✓ Correct!' : '✗ Not quite'}
            </div>
            <div className="verb-quiz__result-answer">
              <span className="verb-quiz__result-ar">{result.correct_arabic}</span>
              <span className="verb-quiz__result-rom">{result.correct_romanized}</span>
            </div>
            <div className="verb-quiz__result-feedback">{result.feedback}</div>
            <button className="verb-quiz__next-btn" onClick={handleNext}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
