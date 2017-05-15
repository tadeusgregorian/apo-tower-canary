import React, { Component } from 'react';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import emailIcon from './emailIcon.png'
import './styles.css';

export default class EnterPinForm extends Component {
	constructor(props){
		super(props)

		this.state = {
			email: ''
		}
	}

	render() {
		return (
					<fb className='noPinSetWrapper'>
						<fb className="explenationText">
							<b>Es wird empfohlen diesen mit einem Pin zu schützen.</b>
							Geben sie dazu bitte eine Email-adresse an, auf der nur Sie als
							Admin zugriff haben.
						</fb>
						<InputMinimal
							onInputChange={(inp) => this.setState({email: inp})}
							imgUrl={emailIcon}
							defaultText='email'
							value={this.state.email}
							autoFocus={true}
						/>
						<fb className='emailEnteredButtonWrapper'>
							<SButton
								color={'#2ECC71'}
								label='Email erhalten'
								onClick={() => this.props.sendEmail(this.state.email)}
								sStyle={{height: '38px', width: '100%'}}
							/>
						</fb>
						<fb className='enterWithoutPinButtonWrapper'>
							<SButton
								label='Ohne Pin eintreten'
								onClick={this.props.enterWithoutPin}
								sStyle={{height: '38px', width: '100%'}}
							/>
						</fb>
					</fb>
		)
	}
}
