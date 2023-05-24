import { AiOutlineCloseCircle } from 'react-icons/ai';

function Keyboard({ onKeyClick, wordsStats }) {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ''],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  ];

  const getBgClass = (key) => {
    return wordsStats.correct.includes(key)
      ? 'correct'
      : wordsStats.present.includes(key)
      ? 'present'
      : wordsStats.wrong.includes(key)
      ? 'wrong'
      : '';
  };

  return (
    <>
      {rows.map((row, index) => (
        <div className="keyboard-row" key={index}>
          {row.map((key, index) => (
            <button
              key={index}
              className={`keyboard-key ${getBgClass(key)} ${
                key === 'Enter' || key === 'Backspace' ? 'one-and-a-half' : ''
              } ${key === '' ? 'space' : ''}`}
              onClick={onKeyClick.bind(null, key)}
              {...(key === '' && { tabIndex: '-1' })}
            >
              {key === 'Backspace' ? <AiOutlineCloseCircle size={28} /> : key}
            </button>
          ))}
        </div>
      ))}
    </>
  );
}

export default Keyboard;
