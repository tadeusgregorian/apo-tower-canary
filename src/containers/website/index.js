import React from 'react';
import { Route, withRouter } from 'react-router-dom'
import Home from './home'
import Topbar from './topbar'
import Benefits from './benefits'
import Features from './features'
import Footer from './footer'
import Kontakt from './kontakt'
import Datenschutz from './datenschutz'
import Impressum from './impressum'

import './styles.css'

export default withRouter((props) => {
	return(
		<fb style={{width: '100%'}}>
			<Topbar />
			<fb id='websiteContent'>
				<Route path='/Home' exact render={() =>
					<fb className="homeWrapper">
						<Home />
						<Benefits />
						<Features />
						<Footer />
					</fb>
				} />
				<Route path='/Home/Kontakt' 		component={Kontakt} />
				<Route path='/Home/Datenschutz' component={Datenschutz} />
				<Route path='/Home/Impressum' 	component={Impressum} />
			</fb>
		</fb>
	)
})
