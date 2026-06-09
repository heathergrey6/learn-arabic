import './GlobalVocab.css';

export function GlobalVocab({ sets, progress, onBack }) {
  const allCards = sets.flatMap(set =>
    set.cards.map(c => ({ ...c, setName: set.name }))
  );

  return (
    <div className="global-vocab">
      <div className="global-vocab__header">
        <button className="global-vocab__back-btn" onClick={onBack}>← Back</button>
        <h2 className="global-vocab__title">Global Vocabulary</h2>
        <span className="global-vocab__summary">{allCards.length} words</span>
      </div>

      <div className="global-vocab__table-wrap">
        <table className="vocab-table">
          <thead>
            <tr>
              <th>English</th>
              <th>Arabic</th>
              <th>Romanized</th>
              <th>Set</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {allCards.map(c => (
              <tr key={c.id}>
                <td>{c.english}</td>
                <td className="vocab-table__arabic">{c.arabic}</td>
                <td className="vocab-table__roman">{c.romanized}</td>
                <td className="vocab-table__set">{c.setName}</td>
                <td>
                  {c.pos && (
                    <span className={`vocab-table__badge vocab-table__badge--${c.pos}`}>
                      {c.pos}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
