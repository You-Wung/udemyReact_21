import { Fragment } from 'react';
import { useRef, useState } from 'react';
import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './QuoteForm.module.css';

import { useContext, useEffect, useCallback } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
function useBlocker( blocker, when = true ) {
    const { navigator } = useContext( NavigationContext );

    useEffect( () => {
        if ( ! when ) return;

        const unblock = navigator.block( ( tx ) => {
            const autoUnblockingTx = {
                ...tx,
                retry() {
                    unblock();
                    tx.retry();
                },
            };

            blocker( autoUnblockingTx );
        } );

        return unblock;
    }, [ navigator, blocker, when ] );
}
function usePrompt( message, when = true ) {
    const blocker = useCallback(
        ( tx ) => {
            // eslint-disable-next-line no-alert
            if ( window.confirm( message ) ) tx.retry();
        },
        [ message ]
    );

    useBlocker( blocker, when );
}

const QuoteForm = (props) => {
  const [isEntered, setIsEntered] = useState(false);
  const authorInputRef = useRef();
  const textInputRef = useRef();

  function submitFormHandler(event) {
    event.preventDefault();

    const enteredAuthor = authorInputRef.current.value;
    const enteredText = textInputRef.current.value;

    // optional: Could validate here
    
    props.onAddQuote({ author: enteredAuthor, text: enteredText });
  }
  
  const focusHanlder = () => {
    setIsEntered(true);
  };
  
  const finishHandler = () => {
    setIsEntered(false);
  };

  usePrompt('u sure?', isEntered);
  return (
		<Fragment>
			<Card>
				<form
					onFocus={focusHanlder}
					className={classes.form}
					onSubmit={submitFormHandler}
				>
					{props.isLoading && (
						<div className={classes.loading}>
							<LoadingSpinner />
						</div>
					)}

					<div className={classes.control}>
						<label htmlFor="author">Author</label>
						<input type="text" id="author" ref={authorInputRef} />
					</div>
					<div className={classes.control}>
						<label htmlFor="text">Text</label>
						<textarea id="text" rows="5" ref={textInputRef}></textarea>
					</div>
					<div className={classes.actions}>
						<button className="btn" onClick={finishHandler}>Add Quote</button>
					</div>
				</form>
			</Card>
		</Fragment>
	);
};

export default QuoteForm;
