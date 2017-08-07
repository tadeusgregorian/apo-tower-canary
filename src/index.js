import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import configureStore from './configureStore'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import moment from 'moment'
import { initIziToast } from './helpers'
import 'react-select/dist/react-select.css'

const rootEl = document.getElementById("root")
const store = configureStore()

moment.locale('de')
injectTapEventPlugin() // needed by material-ui
window.DateTimeFormat = global.Intl.DateTimeFormat // this is for material-ui datePicker
initIziToast() // just setting the default style for iziToast

if(process.env.NODE_ENV === 'production'){
  window.$crisp=[];
  window.CRISP_WEBSITE_ID="1833a04f-c9e7-40a4-917d-07f2f03f9468";
  (function(){let d=document; let s=d.createElement("script");
  s.src="https://client.crisp.im/l.js";s.async=1;
  d.getElementsByTagName("head")[0].appendChild(s);})();
}

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

render()
