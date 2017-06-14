import React from 'react';
import apotowerLogo from './newLogoTade.jpg'
import { withRouter } from 'react-router-dom'
import './styles.css'


//const inDevelopement = process.env.NODE_ENV === 'development'
const topbar = (props) => (
		<fb id='topbar'>
			<fb id='topbarCenter'>
				<fb id='topbarLogo'>
					<fb id='topbarLogoImageWrapper'><img src={apotowerLogo} alt='apotowerLogo' width='34' height='34'/></fb>
					<fb id='topbarLogoText'>APOTOWER</fb>
				</fb>
				<fb id='topbarNavi'>
					<fb className='naviElement'>home</fb>
					<fb className='naviElement'>faq</fb>
					<fb className='naviElement'>kontakt</fb>
					<fb className='naviElement' id='loginNaviElement' onClick={() => props.history.push('/login') }>login</fb>
				</fb>
			</fb>
		</fb>
	)

	export default withRouter(topbar)
