import React from 'react';
import apotowerLogo from './logo5.png'
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
					<fb className='naviElement' id='loginNaviElement' onClick={() => props.history.push('/login') }>LOGIN</fb>
				</fb>
			</fb>
		</fb>
	)

	export default withRouter(topbar)
