import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from "react-dnd-html5-backend";
import Preload from './Preload';

ReactDOM.render(
    <DragDropContextProvider backend={HTML5Backend}>
        <Preload />
    </DragDropContextProvider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
