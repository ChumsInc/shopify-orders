import React from 'react';
import {Provider} from 'react-redux';
import App from "./app/App";
import {createRoot} from "react-dom/client";
import store from "./app/configureStore";
import {ErrorBoundary} from 'react-error-boundary'
import Alert from "react-bootstrap/Alert";

window.localStorage.setItem('debug', '*');
const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <ErrorBoundary fallback={<Alert variant="danger">Something went wrong.</Alert> }>
            <Provider store={store}>
                <App/>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
