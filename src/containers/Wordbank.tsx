import React from "react";
import "./Wordbank.css";
import Keyword, { KeywordDragProps } from "../text/Keyword";

import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";
import { MailboxContext, Receiver } from "../Mailbox";

// state

type State = typeof initialState;
const initialState = {
  words: ["set", "close"] as string[],
  page: 0
};

type Action =
  | { type: "addWord"; word: string }
  | { type: "removeWord"; word: string }
  | { type: "prevPage" }
  | { type: "nextPage" }

const perPage = 14;
const pageCount = (state: State) => Math.floor(state.words.length / perPage) + 1;

function reducer(state: State, action: Action) {
  const pc = pageCount(state);

  switch (action.type) {
    case "addWord":
      const newWords = [...state.words];
      newWords.splice(state.page * perPage + perPage - 1, 0, action.word);
      return {
        ...state,
        // always put it at the bottom of the current page
        words: newWords
      };
    case "removeWord":
      return {
        ...state,
        // technically bug if you have two of the same word
        words: state.words.filter(word => word !== action.word)
      };
    case "prevPage":
      return {
        ...state,
        page: Math.max(0, state.page - 1)
      }
    case "nextPage":
      return {
        ...state,
        page: Math.min(pc - 1, state.page + 1)
      };
    default:
      return state;
  }
}

// component
interface WordbankProps { 
  readonly currentChapter: string;
}

const Wordbank: React.FC<WordbankProps> = React.memo(({ currentChapter }) => {
  const uselessOnFinish = React.useCallback(() => void 0, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [collectionProps, dropRef] = dnd.useDrop<
    KeywordDragProps,
    { target: "wordbank" },
    { hovering: boolean, canDrop: boolean }
  >({
    accept: "keyword",
    canDrop: item => {
      return item.source !== "wordbank";
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      hovering: monitor.isOver()
    }),
    drop: item => {
      // TODO don't allow if keyword has been consumed
      dispatch({ type: "addWord", word: item.id });
      return { target: "wordbank" };
    }
  });

  const onConsumed = React.useCallback(
    (word: string) => dispatch({ type: "removeWord", word }),
    [dispatch]
  );

  const currentPageCount = pageCount(state);

  const prevPage = React.useCallback(() => dispatch({ type: "prevPage" }), [dispatch]);
  const nextPage = React.useCallback(() => dispatch({ type: "nextPage" }), [dispatch]);

  const { sendMessage, register, unregister } = React.useContext(MailboxContext);

  const onAddToWordbox: Receiver = React.useCallback(message => dispatch({ type: "addWord", word: message.payload }), [dispatch]);
  React.useEffect(() => {
    register("addToWordbox", "wordbox", onAddToWordbox);
    return () => unregister("addToWordbox", "wordbox");
  }, []);

  const onSendToPrompt = React.useCallback((word: string) => {
    dispatch({ type: "removeWord", word });
    sendMessage({ type: "addToPrompt", payload: { word, currentChapter } });
  }, [dispatch, currentChapter, sendMessage]);

  return (
    <div
      className={"Wordbank" + (collectionProps.hovering && collectionProps.canDrop ? " hovering" : "")}
      ref={dropRef}
    >
      {state.words.slice(perPage * state.page, perPage * state.page + perPage).map(word => (
        <Keyword
          key={word}
          text={word}
          location={"wordbank"}
          onFinish={uselessOnFinish}
          onConsumed={onConsumed}
          onDoubleClick={onSendToPrompt}
        />
      ))}
      <div className={"Pagination" + (currentPageCount > 1 ? " activated" : "")}>
        <span 
          className={"Previous" + (state.page > 0 ? " activated" : "")}
          onClick={prevPage}
        >{"<"}</span>
        <span 
          className={"Next" + (state.page < currentPageCount - 1 ? " activated" : "")}
          onClick={nextPage}
        >{">"}</span>
      </div>
    </div>
  );
});

export default Wordbank;
