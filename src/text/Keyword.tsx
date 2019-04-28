import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";
import * as React from "react";
import useTyping from "../util/useTyping";
import { Finishable } from "./Text";
import "./Keyword.css";

interface KeywordProps extends Finishable {
  readonly text: string;
  readonly location: "story" | "puzzle" | "wordbank";
  readonly fast?: boolean;

  readonly onConsumed?: (consumedText: string) => void;
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

  return (
    <KeywordDraggable
      {...props}
      // react-dnd-hooks don't really work yet
      // this makes them update according to props...
      key={props.text + consumed}
      consumed={consumed}
      setConsumed={setConsumed}
      renderText={renderText}
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

  return (
    <span
      className={"Keyword" + (props.consumed ? " consumed" : "")}
      ref={dragRef}
    >
      {props.renderText}
    </span>
  );
});

export default Keyword;
