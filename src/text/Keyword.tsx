import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";
import * as React from "react";
import useTyping from "../util/useTyping";
import { Finishable } from "./Text";
import "./Keyword.css";
import { MailboxContext } from "../Mailbox";

interface KeywordProps extends Finishable {
  readonly text: string;
  readonly location: "story" | "puzzle" | "wordbank";
  readonly fast?: boolean;

  readonly onConsumed?: (consumedText: string) => void;
  readonly onDoubleClick?: (word: string) => void;
}

interface KeywordDraggableProps extends KeywordProps {
  readonly renderText: string;
  readonly consumed: boolean;
  readonly setConsumed: (arg: boolean) => void;
}

export interface KeywordDragProps {
  readonly type: "keyword";
  readonly id: string;
  readonly source: "story" | "puzzle" | "wordbank";
}

const Keyword: React.FC<KeywordProps> = React.memo(props => {
  const [renderText] = useTyping(props.text, props.onFinish, props.fast);
  const [consumed, setConsumed] = React.useState(false);

  const { sendMessage } = React.useContext(MailboxContext);

  const onSendToWordbox = React.useCallback((word: string) => {
    sendMessage({ type: "addToWordbox", payload: word });
    setConsumed(true);
  }, [sendMessage]);

  return (
    <KeywordDraggable
      {...props}
      // react-dnd-hooks don't really work yet
      // this makes them update according to props...
      key={props.text + consumed}
      consumed={consumed}
      setConsumed={setConsumed}
      renderText={renderText}
      onDoubleClick={props.location === "story" ? onSendToWordbox : props.onDoubleClick}
    />
  );
});

// useDrag won't update canDrag via state, so we need a child component to cause update via props
const KeywordDraggable: React.FC<KeywordDraggableProps> = React.memo(props => {
  const [_, dragRef] = dnd.useDrag({
    item: {
      type: "keyword",
      id: props.text,
      source: props.location
    } as KeywordDragProps,
    canDrag: !props.consumed,
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        props.setConsumed(true);
        if (props.onConsumed) {
          props.onConsumed(props.text);
        }
      }
    }
  });

  const onDoubleClick = React.useCallback(
    () => props.onDoubleClick && props.onDoubleClick(props.text),
    [props.onDoubleClick, props.text]
  );

  return (
    <span
      className={"Keyword" + (props.consumed ? " consumed" : "") + (props.location === "story" ? " story" : "")}
      ref={dragRef}
      onDoubleClick={onDoubleClick}
    >
      {props.renderText}
    </span>
  );
});

export default Keyword;
