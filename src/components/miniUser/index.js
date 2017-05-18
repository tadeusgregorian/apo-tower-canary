import React from 'react';
import './styles.css'

export default ({user, grayedOut, colorStyle}) => {

	const grayedOutStyle = {
		borderColor: '#b6b6b6',
		backgroundColor: '#b6b6b6',
		color: '#efefef',
		paddingTop: '2px'
	}
	const colorfulStyle = {
		border: '1px solid',
		borderColor: user.color,
		backgroundColor: user.color,
		color: 'white'
	}
	const liteColorfulStyle = {
		border: "1px solid",
		borderColor: user.color,
		color: user.color
	}
	const blackAndWhiteStyle = {
		border: "1px solid",
		borderColor: '#c1c1c1',
		color: '#c1c1c1',
		textShadow: 'none'
	}

	let style = liteColorfulStyle // default is liteStyle
	if ( colorStyle === 'colorful' ) 			style = colorfulStyle
	if ( colorStyle === 'blackAndWhite' ) style = blackAndWhiteStyle
	// if is grayed out , this overrides the style
	if (grayedOut) style = grayedOutStyle

	return (
		<fb key={user.ID} className='miniUserMain' style={ style }>
			{user.nameInitials}
		</fb>
	)
}
