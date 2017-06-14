import React, {PureComponent} from 'react'
import cn from 'classnames'
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

		this.vacIconStyle = {
			color: props.grayedOut ? '#efefef' : 'white'
		}
	}



	render() {

		let style = this.liteColorfulStyle // default is liteStyle
		if ( this.props.colorStyle === 'colorful' ) 			style = this.colorfulStyle
		if ( this.props.colorStyle === 'blackAndWhite' ) style = this.blackAndWhiteStyle
		// if is grayed out , this overrides the style
		if (this.props.grayedOut) style = this.grayedOutStyle

		const {isReplacer, user, tooltipRight} = this.props

		return (
			<fb key={user.ID} className={cn({miniUserMain: true, isReplacer })} style={ style } data-balloon={user.name} data-balloon-pos={tooltipRight ? 'right' : 'left'}>
				<fb className="initials">{user.nameInitials}</fb>
				{isReplacer && <fb className="vacationV icon icon-autorenew" style={this.vacIconStyle} ></fb>}
			</fb>
		)
	}
}
