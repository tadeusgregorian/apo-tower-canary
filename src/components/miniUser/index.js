import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'
import './styles.css'

export default class MiniUser extends PureComponent {
	constructor(props){
		super(props)

		this.grayedOutStyle = {
			borderColor: '#b6b6b6',
			backgroundColor: '#b6b6b6',
			color: '#efefef',
			paddingTop: '2px'
		}
		this.colorfulStyle = {
			border: '1px solid',
			borderColor: this.props.user.color,
			backgroundColor: this.props.user.color,
			color: 'white'
		}
		this.liteColorfulStyle = {
			border: "1px solid",
			borderColor: this.props.user.color,
			color: this.props.user.color
		}
		this.blackAndWhiteStyle = {
			border: "1px solid",
			borderColor: '#c1c1c1',
			color: '#c1c1c1',
			textShadow: 'none'
		}
	}



	render() {

		let style = this.liteColorfulStyle // default is liteStyle
		if ( this.props.colorStyle === 'colorful' ) 			style = this.colorfulStyle
		if ( this.props.colorStyle === 'blackAndWhite' ) style = this.blackAndWhiteStyle
		// if is grayed out , this overrides the style
		if (this.props.grayedOut) style = this.grayedOutStyle

		return(
		<fb
			key={this.props.user.ID}
			className='miniUserMain'
			style={ style }
			data-for='fullUserName'
			ref='foo'
			data-tip={this.props.user.name}
			onMouseOver={() => ReactTooltip.show(findDOMNode(this.refs.foo))}
			onMouseOut={() => ReactTooltip.hide()}
		>
			{this.props.user.nameInitials}
		</fb>
	)}
}
