import React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./App.css";
import Frame from "./containers/Frame";
import Prompt from "./containers/Prompt";
import Wordbank from "./containers/Wordbank";
import Keyword from "./text/Keyword";
import Paragraph from "./text/Paragraph";
import Phrase from "./text/Phrase";
import { Finishable } from "./text/Text";

const phrase = (text: string) => (props: Finishable) => (
  <Phrase text={text} onFinish={props.onFinish} />
);

const keyword = (text: string) => (props: Finishable) => (
  <Keyword text={text} location={"story"} onFinish={props.onFinish} />
);

const paragraph = (texts: Array<React.ComponentType<Finishable>>) => (
  props: Finishable
) => <Paragraph texts={texts} onFinish={props.onFinish} />;

const App: React.FC = () => {
  return (
    <div className="App">
      <DragDropContextProvider backend={HTML5Backend}>
        <Frame>
          {paragraph([
            paragraph([
              phrase(
                "you are walking down a long hallway. at the end stands a tall "
              ),
              keyword("door"),
              phrase(". the path behind you is "),
              keyword("close"),
              phrase("d.")
            ]),
            paragraph([
              phrase(
                "you are walking down a long hallway. at the end stands a tall "
              ),
              keyword("door"),
              phrase(". the path behind you is "),
              keyword("close"),
              phrase("d.")
            ])
          ])({ onFinish: () => console.log("Finish") })}
          <Prompt />
        </Frame>
        <Wordbank />
      </DragDropContextProvider>
      ]
    </div>
  );
};

export default App;
