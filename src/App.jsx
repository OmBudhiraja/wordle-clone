import { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { checkDictionary, getRandomWord } from './api';
import './App.css';
import GuessRow from './components/GuessRow';
import Keyboard from './components/Keyboard';
import Loader from './components/Loader';
import RulesModal from './components/RulesModal';
import Toast from './components/Toast';

export const AVAILABLE_GUESESS = 6;
export const WORD_LENGTH = 5;

export function getCurrentRowIndex(guesses) {
  return guesses.findIndex((guess) => guess === null);
}

const INITIAL_GUESSES = Array(AVAILABLE_GUESESS).fill(null);
const INITIAL_WORD_STATS = {
  wrong: [],
  correct: [],
  present: [],
};

function App() {
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState(INITIAL_GUESSES);
  const [currentGuess, setCurrentGuess] = useState('');
  const [wordsStats, setWordsStats] = useState(INITIAL_WORD_STATS);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const currentRowRef = useRef(null);

  const resetGame = () => {
    fetchWord();
    setGuesses(INITIAL_GUESSES);
    setToastMsg(null);
    setGameOver(false);
    setCurrentGuess('');
    setWordsStats(INITIAL_WORD_STATS);
    setShowAnswer(false);
    console.log('game reseted');
  };

  const updateWordsStats = (key, character) => {
    setWordsStats((prev) => ({
      ...prev,
      [key]: prev[key].includes(character) ? prev[key] : [...prev[key], character],
    }));
  };

  const addClassToCurrentRow = (className, removeAfter) => {
    currentRowRef.current.classList.add(className);
    removeAfter &&
      setTimeout(() => {
        currentRowRef.current.classList.remove('shake');
      }, removeAfter);
  };

  const onEnterPressed = useCallback(async () => {
    setToastMsg(null);
    if (currentGuess.length !== WORD_LENGTH) {
      addClassToCurrentRow('shake', 600);
      setToastMsg('Not enough letters');

      return;
    }
    const isCorrect = word.toLowerCase() === currentGuess?.toLowerCase();
    if (isCorrect) {
      setGameOver(true);
      const winRowRef = currentRowRef.current;

      setTimeout(() => {
        winRowRef.childNodes.forEach((child) => {
          child.classList.remove('reveal');
          child.classList.add('win');
        });
      }, 2500);

      setTimeout(() => {
        setToastMsg('Genius! You won!');
      }, 4000);
    }

    const isWordValid = await checkDictionary(currentGuess.toLowerCase());
    if (!isWordValid) {
      setToastMsg('Not in words list');
      addClassToCurrentRow('shake', 600);
      return;
    }

    if (guesses.findIndex((guess) => guess === null) === AVAILABLE_GUESESS - 1) {
      setGameOver(true);
      setShowAnswer(true);
    }

    setGuesses((prevGuesses) =>
      prevGuesses.map((guess, index) =>
        index === getCurrentRowIndex(prevGuesses) ? currentGuess : guess
      )
    );

    currentGuess.split('').forEach((letter, index) => {
      const loweredLetter = letter.toLowerCase();
      if (loweredLetter === word[index]) {
        updateWordsStats('correct', loweredLetter);
      } else if (word.includes(loweredLetter)) {
        updateWordsStats('present', loweredLetter);
      } else updateWordsStats('wrong', loweredLetter);
    });

    setCurrentGuess('');
  }, [currentGuess, guesses, word]);

  const onBackspacePressed = useCallback(() => setCurrentGuess((prev) => prev.slice(0, -1)), []);

  const onKeyClick = useCallback(
    (key) => {
      if (gameOver || !word.length || guesses.findIndex((guess) => guess === null) === -1) {
        return;
      }

      if (key === 'Backspace') {
        onBackspacePressed();
        return;
      }

      if (key === 'Enter') {
        onEnterPressed();
        return;
      }

      if (currentGuess.length === WORD_LENGTH) return;

      setCurrentGuess((prev) => prev + key);
    },
    [currentGuess, gameOver, guesses, onBackspacePressed, onEnterPressed, word]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (showRulesModal) return;

      // default behaviour in Tab key
      if (e.key === 'Tab') return;

      if (document.activeElement.tabIndex === 0) {
        if (e.code === 'Enter') return;
        document.activeElement?.blur?.();
      }

      e.preventDefault();

      if (e.ctrlKey && e.code === 'KeyR') {
        window.location.reload();
      }

      if (e.ctrlKey && e.code === 'KeyQ') {
        setShowRulesModal(true);
      }

      if (e.ctrlKey && e.code === 'Backspace') {
        setCurrentGuess('');
        return;
      }

      if (
        gameOver ||
        e.ctrlKey ||
        e.code === 'Space' ||
        !word.length ||
        guesses.findIndex((guess) => guess === null) === -1
      )
        return;

      if (e.code === 'Backspace') {
        onBackspacePressed();
        return;
      }

      if (e.code === 'Enter') {
        onEnterPressed();
        return;
      }

      if (currentGuess.length === WORD_LENGTH) return;

      const isLetter = e.key.match(/^[a-zA-Z]{1}$/) !== null;
      isLetter && setCurrentGuess((prev) => prev + e.key.toLowerCase());
    },
    [currentGuess, gameOver, guesses, onBackspacePressed, onEnterPressed, word, showRulesModal]
  );

  function fetchWord() {
    setWord('');
    getRandomWord().then((word) => {
      setWord(word.toLowerCase());
    });
  }

  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (word.length === 0) {
    return <Loader />;
  }

  return (
    <div className="app">
      <header className="header">
        <button className="rules-icon" onClick={() => setShowRulesModal(true)}>
          <AiOutlineQuestionCircle aria-hidden="true" size={30} />
          <span className="sr-only">Game Rules</span>
        </button>
        <h1>Worlde</h1>
      </header>
      <main
        className="game"
        style={gameOver ? { pointerEvents: 'none' } : { pointerEvents: 'all' }}
      >
        <section className="board">
          {guesses.map((guess, index) => {
            const isCurrentGuess = index === guesses.findIndex((guess) => guess === null);
            return (
              <GuessRow
                key={index}
                guess={isCurrentGuess ? currentGuess : guess}
                isCurrentActiveRow={isCurrentGuess}
                isGuessed={!isCurrentGuess && guess !== null}
                word={word}
                currentRowRef={isCurrentGuess ? currentRowRef : null}
                wordsStats={wordsStats}
              />
            );
          })}
        </section>
        <section className="keyboard">
          <Keyboard wordsStats={wordsStats} onKeyClick={onKeyClick} />
        </section>
      </main>
      <RulesModal isOpen={showRulesModal} handleClose={() => setShowRulesModal(false)} />
      {toastMsg && <Toast message={toastMsg} setToastMsg={setToastMsg} />}
      {gameOver && (
        <div className="reset-game-container">
          <div className="reset-game-btn" role="button" onClick={resetGame}>
            Play Again!
          </div>
          {showAnswer && (
            <p>
              The word was "<strong>{word.toUpperCase()}"</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
