import { useEffect, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import ReactPortal from './ReactPortal';

const RulesModal = ({ isOpen, handleClose }) => {
  const contentRef = useRef();

  useEffect(() => {
    function stopPropogating(e) {
      console.log('content div');
      e.stopPropagation();
    }
    const element = contentRef.current;
    element?.addEventListener('click', stopPropogating);

    return () => {
      element?.removeEventListener('click', stopPropogating);
    };
  }, []);

  if (!isOpen) return null;
  return (
    <ReactPortal wrapperId="rules-modal" handleClick={handleClose}>
      <div className="rules-modal-content" ref={contentRef}>
        <p>
          Guess the <strong>WORDLE</strong> in six tries.
        </p>
        <p>
          Each guess must be a valid five-letter word. Hit the enter button to
          submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
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
              The letter <strong>W</strong> is in the word and in the correct
              spot.
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
              The letter <strong>W</strong> is in the word and in the correct
              spot.
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
              The letter <strong>W</strong> is in the word and in the correct
              spot.
            </p>
          </div>
        </div>
        <p>
          <strong>A new WORDLE will be given in every new game.</strong>
        </p>
        <div className="close-icon" onClick={handleClose}>
          <AiOutlineClose size={24} />
        </div>
      </div>
    </ReactPortal>
  );
};

export default RulesModal;
