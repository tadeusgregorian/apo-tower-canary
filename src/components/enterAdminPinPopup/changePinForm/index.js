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
      pin3: '',
			infoMessage: ''
		}
	}

  oldPinIsCorrect = () => sha1(this.state.pin1) === this.props.adminHash

	pinButtonClicked = () => {
    console.log(this.props.adminHash)
    console.log(sha1(this.state.pin1))

		let infoMessage = ''
		const { pin1, pin2, pin3 } = this.state
    if(!this.oldPinIsCorrect())                               infoMessage = 'Aktueller PIN inkorrekt'
		if(pin2 !== pin3)                                         infoMessage = 'PINs sind nicht identisch'
		if(pin1.length < 4 || pin2.length < 4 || pin3.length < 4) infoMessage = 'Eingabe nicht vollständig'

		infoMessage ? this.setState({infoMessage, pin1: '', pin2: '', pin3: ''}) : this.props.writePinToDB(sha1(pin3))
	}

	render() {
		return (
			<fb className='chnagePinWrapper'>
				<fb className="formWrapper">
					{ this.state.infoMessage && <fb className="infoMessage"><icon className="icon-warning"/>{this.state.infoMessage}</fb> }
          <fb className="explenationText">Aktueller PIN</fb>
          <fb className="pinInpWrapper">
            <PinInputField
              pin={this.state.pin1}
              onChange={(pin) => this.setState({ pin1: pin })}
              tabInd='1'
              autoFocus
            />
            <fb className="icon lockIcon icon-lock3"></fb>
          </fb>
          <fb className="explenationText">Neuer PIN</fb>
					<fb className="pinInpWrapper">
						<PinInputField
							pin={this.state.pin2}
							onChange={(pin) => this.setState({ pin2: pin })}
							tabInd='2'
						/>
						<fb className="icon lockIcon icon-lock3"></fb>
					</fb>
					<fb className="pinInpWrapper">
						<PinInputField
							pin={this.state.pin3}
							onEnter={this.pinButtonClicked}
							onChange={(pin) => this.setState({ pin3: pin })}
							tabInd='3'
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
