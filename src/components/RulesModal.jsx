import { useCallback, useEffect, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import useOnClickOutside from '../hooks/useOutsideClick';
import ReactPortal from './ReactPortal';

const RulesModal = ({ isOpen, handleClose }) => {
  const contentRef = useRef(null);

  useOnClickOutside(contentRef, () => {
    console.log('outside click');
    contentRef.current?.classList.add('closing');
    contentRef.current?.addEventListener('animationend', handleClose);
  });

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        contentRef.current?.classList.add('closing');
        contentRef.current?.addEventListener('animationend', handleClose);
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  if (!isOpen) return null;
  return (
    <ReactPortal wrapperId="rules-modal">
      <div className="rules-modal-content" ref={contentRef}>
        <p>
          Guess the <strong>WORDLE</strong> in six tries.
        </p>
        <p>Each guess must be a valid five-letter word. Hit the enter button to submit.</p>
        <p>
          After each guess, the color of the tiles will change to show how close your guess was to
          the word.
        </p>

        <div className="examples">
          <p>Examples</p>
          <div className="example">
            <div className="row">
              <div className="box box-sm no-border correct">W</div>
              <div className="box box-sm">E</div>
              <div className="box box-sm">A</div>
              <div className="box box-sm">R</div>
              <div className="box box-sm">Y</div>
            </div>
            <p>
              The letter <strong>W</strong> is in the word and in the correct spot.
            </p>
          </div>
          <div className="example">
            <div className="row">
              <div className="box box-sm">P</div>
              <div className="box box-sm no-border present">I</div>
              <div className="box box-sm">L</div>
              <div className="box box-sm">L</div>
              <div className="box box-sm">S</div>
            </div>
            <p>
              <strong>I</strong> is in the word but in the wrong spot.
            </p>
          </div>
          <div className="example">
            <div className="row">
              <div className="box box-sm">V</div>
              <div className="box box-sm">A</div>
              <div className="box box-sm">G</div>
              <div className="box box-sm no-border wrong">U</div>
              <div className="box box-sm">E</div>
            </div>
            <p>
              <strong>U</strong> is not in the word in any spot.
            </p>
          </div>
        </div>
        <p>
          <strong>A new WORDLE will be given in every new game.</strong>
        </p>

        <div className="attribution">
          Made by{' '}
          <a href="https://github.com/OmBudhiraja" target="_blank" rel="noreferrer">
            Om Budhiraja
          </a>
          |
          <a href="https://github.com/OmBudhiraja/wordle-clone" target="_blank" rel="noreferrer">
            Github Repo
          </a>
        </div>

        <div className="close-icon" onClick={handleClose}>
          <AiOutlineClose size={24} />
        </div>
      </div>
    </ReactPortal>
  );
};

export default RulesModal;
