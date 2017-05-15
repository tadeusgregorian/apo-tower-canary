import React, { Component } from 'react';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import lockIcon from './lockIcon.png'
import './styles.css';

export default class EnterPinForm extends Component {

	render() {
		return (
					<fb className='enterPinWrapper'>
						<InputMinimal
							onInputChange={this.props.onInpChange}
							imgUrl={lockIcon}
							defaultText='pin'
							value={this.props.value}
							onEnter={this.props.onEnter}
							password={true}
							autoFocus={true}
						/>
						<fb className='pinEnteredButtonWrapper'>
							<SButton
								color={'#2ECC71'}
								label='Eintreten'
								onClick={this.props.onEnter}
								sStyle={{height: '38px', width: '100%'}}
							/>
						</fb>
					</fb>
		)
	}
}
