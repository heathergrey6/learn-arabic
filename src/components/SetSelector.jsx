import { formatDailyDate } from '../utils/dailySet';
import './SetSelector.css';

export function SetSelector({ sets, dailySet, progress, onSelectSet, onViewGlobal }) {
  const totalWords = sets.reduce((sum, s) => sum + s.cards.length, 0);
  const seenWords = sets.flatMap(s => s.cards).filter(c => progress[c.id]).length;

  function getSetStats(set) {
    const total = set.cards.length;
    const seen = set.cards.filter(c => progress[c.id]).length;
    const mastered = set.cards.filter(c => {
      const p = progress[c.id];
      return p && p.correct > 0 && p.correct >= p.incorrect * 2;
    }).length;
    return { total, seen, mastered };
  }

  return (
    <div className="set-selector">
      <div className="set-selector__header">
        <h1 className="set-selector__title">
          <span className="set-selector__arabic-title">تعلّم العربية</span>
          <span className="set-selector__subtitle">Learn Arabic</span>
        </h1>
        <button className="set-selector__global-btn" onClick={onViewGlobal}>
          Global Vocab ({totalWords} words)
        </button>
      </div>

      {dailySet && (() => {
        const total = dailySet.cards.length;
        const seen = dailySet.cards.filter(c => progress[c.id]).length;
        const mastered = dailySet.cards.filter(c => {
          const p = progress[c.id];
          return p && p.correct > 0 && p.correct >= p.incorrect * 2;
        }).length;
        return (
          <div className="daily-card" onClick={() => onSelectSet(dailySet)}>
            <div className="daily-card__top">
              <div>
                <div className="daily-card__label">Daily Review</div>
                <div className="daily-card__date">{formatDailyDate()}</div>
              </div>
              <div className="daily-card__count">{total} words</div>
            </div>
            <div className="daily-card__progress">
              <div className="daily-card__bar">
                <div
                  className="daily-card__bar-fill daily-card__bar-fill--seen"
                  style={{ width: `${(seen / total) * 100}%` }}
                />
                <div
                  className="daily-card__bar-fill daily-card__bar-fill--mastered"
                  style={{ width: `${(mastered / total) * 100}%` }}
                />
              </div>
              <div className="daily-card__stats">
                <span>{seen} seen today</span>
                <span className="daily-card__mastered">{mastered} mastered</span>
              </div>
            </div>
            <button className="daily-card__start-btn">Start Today's Review →</button>
          </div>
        );
      })()}

      <h2 className="set-selector__section">Flashcard Sets</h2>

      <div className="set-selector__grid">
        {sets.map(set => {
          const { total, seen, mastered } = getSetStats(set);
          return (
            <div
              key={set.id}
              className="set-card"
              onClick={() => onSelectSet(set)}
            >
              <div className="set-card__name">{set.name}</div>
              <div className="set-card__count">{total} words</div>
              <div className="set-card__progress">
                <div className="set-card__bar">
                  <div
                    className="set-card__bar-fill set-card__bar-fill--seen"
                    style={{ width: `${(seen / total) * 100}%` }}
                  />
                  <div
                    className="set-card__bar-fill set-card__bar-fill--mastered"
                    style={{ width: `${(mastered / total) * 100}%` }}
                  />
                </div>
                <div className="set-card__stats">
                  <span>{seen} seen</span>
                  <span className="set-card__mastered">{mastered} mastered</span>
                </div>
              </div>
              <button className="set-card__start-btn">Start Quiz →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
