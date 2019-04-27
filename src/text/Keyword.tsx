import * as React from "react";
import useTyping from "../util/useTyping";
import { Finishable } from "./Text";
import "./Keyword.css";

interface KeywordProps extends Finishable {
  readonly text: string;
}

const Keyword: React.FC<KeywordProps> = props => {
  const [renderText] = useTyping(props.text, props.onFinish);

  return <span className={"Keyword"}>{renderText}</span>;
};

export default Keyword;
