import React from 'react';
import Home from './home'
import Topbar from './topbar'
import Benefits from './benefits'

import './styles.css'

export default() => (
	<fb style={{width: '100%'}}>
		<Topbar />
		<fb id='websiteContent'>
			<Home />
			<Benefits />
		</fb>
	</fb>
)
