import React from "react";
import "./App.css";
import Frame from "./containers/Frame";
import Phrase from "./text/Phrase";
import Keyword from "./text/Keyword";
import Paragraph from "./text/Paragraph";
import { Finishable } from "./text/Text";

const phrase = (text: string) => (props: Finishable) => (
  <Phrase text={text} onFinish={props.onFinish} />
);

const keyword = (text: string) => (props: Finishable) => (
  <Keyword text={text} onFinish={props.onFinish} />
);

const paragraph = (texts: Array<React.ComponentType<Finishable>>) => (
  props: Finishable
) => <Paragraph texts={texts} onFinish={props.onFinish} />;

const App: React.FC = () => {
  return (
    <div className="App">
      <Frame>
        {paragraph([
          phrase(
            "you are walking down a long hallway. at the end stands a tall "
          ),
          keyword("door"),
          phrase(". the path behind you is "),
          keyword("close"),
          phrase("d.")
        ])({ onFinish: () => console.log("Finish") })}
      </Frame>
    </div>
  );
};

export default App;
