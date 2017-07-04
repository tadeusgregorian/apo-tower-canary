import React, { Component } from 'react';
import SButton from 'components/sButton'
import sha1 from 'sha1';
import PinInputField from 'components/pinInputField'
import './styles.css';

export default class EnterPinTwice extends Component {
	constructor(props){
		super(props)

		this.state = {
			pin1: '',
			pin2: '',
			infoMessage: ''
		}
	}

	pinButtonClicked = () => {
		let infoMessage = ''
		const { pin1, pin2 } = this.state
		if(pin1 !== pin2) infoMessage = 'PINs sind nicht identisch'
		if(pin1.length < 4 || pin2.length < 4) infoMessage = 'Eingabe nicht vollständig'
		infoMessage ? this.setState({infoMessage}) : this.props.writePinToDB(sha1(pin1))
	}

	render() {
		return (
			<fb className='noPinSetWrapper'>
				<fb className="explenationText">
					<b>Dieser Bereich muss mit einem PIN geschützt werden.</b>
					Bitte wählen Sie einen vierstelligen Admin-PIN.
				</fb>
				<fb className="formWrapper">
					{ this.state.infoMessage &&
						<fb className="infoMessage">
							<icon className="icon-warning"/>
							{this.state.infoMessage}
						</fb>
					}
					<fb className="pinInpWrapper">
						<PinInputField
							pin={this.state.pin1}
							onChange={(pin) => this.setState({ pin1: pin })}
							tabInd='1'
							autoFocus
						/>
						<fb className="icon lockIcon icon-lock3"></fb>
					</fb>
					<fb className="pinInpWrapper">
						<PinInputField
							pin={this.state.pin2}
							onEnter={this.pinButtonClicked}
							onChange={(pin) => this.setState({ pin2: pin })}
							tabInd='2'
						/>
						<fb className="icon lockIcon icon-lock3"></fb>
					</fb>
					<fb className='pinEnteredButtonWrapper'>
						<SButton
							color={'#2ECC71'}
							label='PIN speichern'
							onClick={this.pinButtonClicked}
							sStyle={{height: '38px', width: '100%'}}
							tabInd='3'
						/>
					</fb>
				</fb>
			</fb>
		)
	}
}
