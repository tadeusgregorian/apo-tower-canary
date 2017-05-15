import React, {PureComponent} from 'react'
import './styles.css'


export default class InputMinimal extends PureComponent {
	componentDidMount(){
		if(this.props.autoFocus) this.nameInput.focus()
	}

	getStyle = () => ({
		...this.props.iStyle,
		backgroundImage: 'url('+this.props.imgUrl+')'
	})

	render(){
		const {name, defaultText, password, onInputChange, onEnter, value} = this.props
		return(
			<div className='inputMinimalMain'>
				<input
					value={value}
          ref={(input) => { this.nameInput = input }}
					type={password ? "password" : "text"}
					name={name}
					style={this.getStyle()}
					placeholder={defaultText}
					onChange={(e)=> onInputChange(e.target.value)}
					onKeyDown={(e)=> { if(e.key === 'Enter') onEnter && onEnter() }}
				/>
			</div>
		)
	}
}
