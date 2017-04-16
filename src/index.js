import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import sha1 from 'sha1';

window.sha1 = sha1
ReactDOM.render( <Root />, document.getElementById('root') )
