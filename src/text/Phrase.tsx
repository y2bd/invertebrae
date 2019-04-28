import * as React from "react";
import useTyping from "../util/useTyping";
import "./Phrase.css";
import { Finishable } from "./Text";

interface PhraseProps extends Finishable {
  readonly text: string;
  readonly fast?: boolean;
}

const Phrase: React.FC<PhraseProps> = React.memo(props => {
  const [renderText] = useTyping(props.text, props.onFinish, props.fast);

  return <span className="Phrase">{renderText}</span>;
});

export default Phrase;
