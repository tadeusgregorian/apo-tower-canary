import React from 'react'
import './styles.css'

export default ({label, disabled, onClick, color, sStyle}) => {
	const colorStyle = {
		color: 'white',
		backgroundColor: color,
		border: 'none'
	}

	const disabledStyle = {
		color: '#bdbfc1',
    backgroundColor: 'rgb(231, 234, 236)',
    border: 'none',
	}

	const getStyle = () => {
		if(disabled) return { ...sStyle, ...disabledStyle }
		if(color) return { ...sStyle, ...colorStyle }
		return sStyle ? { ...sStyle } : null
	}

	return(
		<fb
			className='sButton'
			style={getStyle()}
			onClick={!disabled && onClick}
		>{label}</fb>
	)
}
