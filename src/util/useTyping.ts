import * as React from "react";
import useInterval from "../util/useInterval";

export const DefaultDelay = 30;

export default function useTyping(
  text: string,
  onFinish: () => void
): [string] {
  const [renderText, setRenderText] = React.useState("");
  const [delay, setDelay] = React.useState(DefaultDelay);
  const [finished, setFinished] = React.useState(false);

  useInterval(stop => {
    if (renderText === text && !finished) {
      stop();
      onFinish();
      setFinished(true);
    }

    // if we made it longer for effect, set it right back next time
    if (delay > DefaultDelay) {
      setDelay(DefaultDelay);
    }

    const nextText = text.slice(0, renderText.length + 1);
    if (nextText[nextText.length - 1] === ".") {
      setDelay(DefaultDelay * 10);
    }

    setRenderText(text.slice(0, renderText.length + 1));
  }, Math.round(delay - 25 + 50 * Math.random()));

  return [renderText];
}
