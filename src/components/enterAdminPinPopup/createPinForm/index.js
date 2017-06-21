import React, { Component } from 'react';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import lockIcon from './lockIcon.png'
import sha1 from 'sha1';
import { createShortGuid } from 'helpers'
import './styles.css';

export default class EnterPinTwice extends Component {
	constructor(props){
		super(props)

		this.state = {
			pin1: 't', // dirtyHack -> gets removed by componentDidMount: to prevent autocomplete Box (firefox)
			pin2: 't', // dirtyHack -> gets removed by componentDidMount: to prevent autocomplete Box (firefox)
			infoMessage: ''
		}
	}

	componentDidMount = () => { // dirty hack, to prevent autocomplete Box (firefox)
		this.setState({pin1: '', pin2: ''})
	}

	onInputChanged = (inp, pinField) => {
		if(inp.length > 4) return
		this.setState({[pinField]: inp})
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
					<InputMinimal
						onInputChange={(inp) => this.onInputChanged(inp, 'pin1')}
						imgUrl={lockIcon}
						defaultText='PIN'
						value={this.state.pin1}
						name={createShortGuid()}
						password
						autoFocus
					/>
					<InputMinimal
						onInputChange={(inp) => this.onInputChanged(inp, 'pin2')}
						imgUrl={lockIcon}
						defaultText='PIN wiederholen'
						value={this.state.pin2}
						onEnter={this.pinButtonClicked}
						name={createShortGuid()}
						password
					/>
					<fb className='pinEnteredButtonWrapper'>
						<SButton
							color={'#2ECC71'}
							label='PIN speichern'
							onClick={this.pinButtonClicked}
							sStyle={{height: '38px', width: '100%'}}
						/>
					</fb>
				</fb>
			</fb>
		)
	}
}
