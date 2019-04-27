import * as React from "react";
import { Finishable } from "./Text";

interface ParagraphProps extends Finishable {
  readonly texts: Array<React.ComponentType<Finishable>>;

  onFinish(): void;
}

const Paragraph: React.FC<ParagraphProps> = props => {
  const [textIndex, setTextIndex] = React.useState(0);
  const [finished, setFinished] = React.useState(false);

  const progress = React.useCallback(
    () => !finished && setTextIndex(textIndex + 1),
    [finished, textIndex, setTextIndex]
  );

  React.useEffect(() => {
    if (textIndex >= props.texts.length && !finished) {
      props.onFinish();
      setFinished(true);
    }
  });

  return (
    <>
      {props.texts.slice(0, textIndex + 1).map(Comp => (
        <Comp onFinish={progress} />
      ))}
    </>
  );
};

export default Paragraph;
