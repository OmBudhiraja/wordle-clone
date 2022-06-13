import { useEffect, useState } from 'react';
import { WORD_LENGTH } from '../App';

function GuessRow({
  guess,
  isCurrentActiveRow,
  isGuessed,
  word,
  currentRowRef,
}) {
  const [formattedGuesses, setFormattedGuesses] = useState([]);

  useEffect(() => {
    if (isCurrentActiveRow) {
      const solutionArray = [...word];
      const formattedGuess = [...guess].map((l) => {
        return { key: l, class: 'wrong' };
      });

      formattedGuess.forEach((l, i) => {
        if (word[i] === l.key) {
          formattedGuess[i].class = 'correct';
          solutionArray[i] = null;
        }
      });

      // find any yellow letters
      formattedGuess.forEach((l, i) => {
        if (solutionArray.includes(l.key) && l.class !== 'correct') {
          formattedGuess[i].class = 'present';
          solutionArray[solutionArray.indexOf(l.key)] = null;
        }
      });

      setFormattedGuesses(formattedGuess);
    }
  }, [guess, isCurrentActiveRow, word]);

  return (
    <div className="row" ref={currentRowRef}>
      {Array(WORD_LENGTH)
        .fill('')
        .map((_, index) => {
          const character = guess ? guess[index] : null;
          let classes = 'box ';

          if (isCurrentActiveRow && character?.length) {
            classes += 'active-row-letter pop-in ';
          }

          if (isGuessed) {
            classes += 'reveal ';
            if (
              character === word[index] &&
              formattedGuesses[index].class === 'correct'
            ) {
              classes += 'green';
            } else if (
              word.includes(character) &&
              formattedGuesses[index].class === 'present'
            ) {
              classes += 'yellow';
            } else classes += 'grey';
          }
          return (
            <div className={classes} key={index}>
              {character ?? ''}
            </div>
          );
        })}
    </div>
  );
}

export default GuessRow;
