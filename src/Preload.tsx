import * as React from "react";
import App from "./App";
import "./Preload.css";

const Preload: React.FC = () => {
    const [showGame, setShowGame] = React.useState(false);

    const sg = React.useCallback(() => setShowGame(true), [setShowGame]);

    if (showGame) {
        return <App />;
    } {
        return <div className="Preload" onClick={sg}>
            <span className="Message">
                Click anywhere to begin.
            </span>
        </div>
    }
};

export default Preload;