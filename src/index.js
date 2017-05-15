import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './configureStore'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';

const rootEl = document.getElementById("root");
const store = configureStore()

let render = () => {
    const Main = require("./main").default;

    ReactDOM.render(
			<MuiThemeProvider>
        <Provider store={store}>
					<Router>
            <Main />
					</Router>
        </Provider>
			</MuiThemeProvider>,
        rootEl
    );
};

if(module.hot) {
    const renderApp = render;
    const renderError = (error) => {
        const RedBox = require("redbox-react").default;
        ReactDOM.render( <RedBox error={error} />, rootEl)
    }

    render = () => {
        try {
            renderApp();
        }
        catch(error) {
            console.error(error);
            renderError(error);
        }
    };

    module.hot.accept("./main", () => { setTimeout(render) })
}

render();

injectTapEventPlugin()
window.DateTimeFormat = global.Intl.DateTimeFormat;
