import React, { Component } from 'react';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import lockIcon from './lockIcon.png'
import { Toast } from 'helpers'
import sha1 from 'sha1'
import './styles.css';

export default class EnterPinForm extends Component {
	constructor(props) {
		super(props)
		this.state = { pin: '' }
	}

	checkPin = () => {
		const encryptedPin = sha1(this.state.pin)
		encryptedPin === this.props.adminHash ? this.props.letUserEnter() : this.letUserTryAgain()
	}

	onInpChange = (inp) => {
		if(inp.length === 4 && sha1(inp) === this.props.adminHash) this.props.letUserEnter()
		this.setState({pin: inp})
	}

	letUserTryAgain = () => {
		this.setState({pin: ''})
		Toast.error("Admin Pin falsch. Bitte erneut eingeben")
	}

	render() {
		return (
			<fb className='enterPinWrapper'>
				<InputMinimal
					onInputChange={this.onInpChange}
					imgUrl={lockIcon}
					defaultText='pin'
					value={this.state.pin}
					onEnter={this.checkPin}
					password
					autoFocus
				/>
				<fb className='pinEnteredButtonWrapper'>
					<SButton
						color={'#2ECC71'}
						label='Eintreten'
						onClick={this.checkPin}
						sStyle={{height: '38px', width: '100%'}}
					/>
				</fb>
			</fb>
		)
	}
}
