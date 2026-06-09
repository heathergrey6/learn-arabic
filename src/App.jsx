import { useState, useEffect } from 'react';
import vocabularyData from './data/vocabulary.json';
import { useProgress } from './hooks/useProgress';
import { useNightMode } from './hooks/useNightMode';
import { SetSelector } from './components/SetSelector';
import { Quiz } from './components/Quiz';
import { GlobalVocab } from './components/GlobalVocab';
import { getDailySet } from './utils/dailySet';
import './App.css';

export default function App() {
  const { progress, recordResult, undoResult } = useProgress();
  const { isNight, toggle: toggleNight } = useNightMode();
  const [view, setView] = useState('home');
  const [activeSet, setActiveSet] = useState(null);
  const dailySet = getDailySet(vocabularyData.sets);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isNight ? 'night' : '');
  }, [isNight]);
  const [showRomanized, setShowRomanized] = useState(true);
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  const effectiveShowRomanized = isMobile ? true : showRomanized;

  function startQuiz(set) {
    setActiveSet(set);
    setView('quiz');
  }

  return (
    <div className="app">
      <div className="app__content">
        {view === 'home' && (
          <SetSelector
            sets={vocabularyData.sets}
            dailySet={dailySet}
            progress={progress}
            onSelectSet={startQuiz}
            onViewGlobal={() => setView('global')}
          />
        )}

        {view === 'quiz' && activeSet && (
          <Quiz
            cards={activeSet.cards}
            setName={activeSet.name}
            onFinish={() => setView('home')}
            recordResult={recordResult}
            undoResult={undoResult}
            showRomanized={effectiveShowRomanized}
          />
        )}

        {view === 'global' && (
          <GlobalVocab
            sets={vocabularyData.sets}
            progress={progress}
            onBack={() => setView('home')}
          />
        )}
      </div>

      <div className="app__settings">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showRomanized}
            onChange={e => setShowRomanized(e.target.checked)}
          />
          Show romanization
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isNight}
            onChange={toggleNight}
          />
          Night mode
        </label>
      </div>
    </div>
  );
}
