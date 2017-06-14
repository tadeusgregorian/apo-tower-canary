import React from 'react';
import Home from './home'
import Topbar from './topbar'

import './styles.css'

export default() => (
	<fb style={{width: '100%'}}>
		<Topbar />
		<fb id='websiteContent'>
			<Home />
		</fb>
	</fb>
)
