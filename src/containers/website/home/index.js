import React from 'react'
import homeImage from './homeImage2.jpg';
import Registration from './registration';
import './styles.css'


//const inDevelopement = process.env.NODE_ENV === 'development'
export default() => (
	<fb id='homeMain'>
		<fb id='homeLeft'>
			<fb id='homeImageTitle'>Apotower <br/>bringt <br/>Ordnung <br/>in <br/>das <br/>Chaos</fb>
			<fb id='homeImageWrapper'><img src={homeImage} alt='homeImage' width='244' height='208'/></fb>
		</fb>
		<fb id='homeRight'>
			<Registration />
		</fb>
	</fb>
)
