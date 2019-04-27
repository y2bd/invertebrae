import * as React from "react";
import { Finishable } from "./Text";
import "./Paragraph.css";

interface ParagraphProps extends Finishable {
  readonly texts: Array<React.ComponentType<Finishable>>;

  onFinish(): void;
}

const Paragraph: React.FC<ParagraphProps> = React.memo(
  ({ texts, onFinish }) => {
    const [textIndex, setTextIndex] = React.useState(0);
    const [finished, setFinished] = React.useState(false);

    const progress = React.useCallback(
      () => !finished && setTextIndex(textIndex + 1),
      [finished, textIndex, setTextIndex]
    );

    const textsLength = texts.length;
    React.useEffect(() => {
      if (textIndex >= textsLength && !finished) {
        onFinish();
        setFinished(true);
      }
    }, [textIndex, finished, setFinished, textsLength, onFinish]);

    return (
      <div className="Paragraph">
        {texts.slice(0, textIndex + 1).map((Comp, i) => (
          <Comp key={i} onFinish={progress} />
        ))}
      </div>
    );
  }
);

export default Paragraph;
