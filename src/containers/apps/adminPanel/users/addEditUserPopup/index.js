import cN  from 'classnames'
import React, { Component } from 'react'
import { userColors } from 'helpers/colors';
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css';

export default class AddEditUserPopup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: this.props.editing ? this.props.user.name : '',
			nameInitials: this.props.editing ? this.props.user.nameInitials : '',
			color: this.props.editing ? this.props.user.color : '',
			userinputMissingText: '',
		};
	}

	onButtonClicked = () => {
		if(this.state.name === '') {
			this.setState({userinputMissingText: 'Bitte geben Sie einen Benutzernamen ein.'})
			return;
		}
		if(this.state.nameInitials.length < 4) {
			this.setState({userinputMissingText: 'Bitte geben Sie einen 4 stelligen Namenskürzel ein.'})
			return;
		}
		if(this.state.color === '') {
			this.setState({userinputMissingText: 'Bitte wählen Sie eine Farbe aus.'})
			return;
		}

		let userObj = { ...this.props.user }
		userObj.name = this.state.name
		userObj.nameInitials = this.state.nameInitials
		userObj.color = this.state.color

		if(this.props.editing) {
			if(!this.props.user.ID) { return }  // in editing user.ID has to be existent!
			userObj.ID = this.props.user.ID; // add ID to the userObj if you want to use the editUser-Action
			this.props.editUser(userObj)

		} else {
			this.props.addNewUser({ ...userObj, ID:  'u' + (this.props.usersCount + 1) })
		}
		this.props.close()
	}

	onNameInputChanged(input) {
		this.setState({name: input.target.value})
	}
	onInitialsInputChanged(input) {
		this.setState({nameInitials: input.target.value})
	}
	onColorTouchTaped(color) {
		this.setState({color})
	}

	render() {
		return (
				<SModal.Main title='Neuer Benutzer' onClose={this.props.close}>
					<SModal.Body>
				<fb className="addEditUserPopup">
					{ this.state.userinputMissingText ? <fb className="userinputMissingText">{this.state.userinputMissingText}</fb> : null}
					<fb className="inputItemWrapper">
						<fb className="inputDescription" >Benutzername:</fb>
						<input className="nameInputField" type="text" value={this.state.name} onChange={this.onNameInputChanged.bind(this)}/>
					</fb>
					<fb className="inputItemWrapper">
						<fb className="inputDescription">Namenskürzel:</fb>
						<input className="initialsInputField" type="text" placeholder="4 Stellig" value={this.state.nameInitials} onChange={this.onInitialsInputChanged.bind(this)} maxLength="4" />
					</fb>
					<fb className="inputItemWrapper">
						<fb className="inputDescription">Farbe wählen:</fb>
						<fb className="colorsWrapper">
						{ userColors.map((colorString) => { return (
								<fb className={cN({'userColor': true, 'selected': false})}
										style={{backgroundColor: colorString}}
										key={colorString}
										onClick={ () => this.onColorTouchTaped(colorString)} >
										{ (this.state.color === colorString) ? <icon className="icon icon-checkmark" /> : null}
								</fb>)})}
						</fb>
					</fb>
				</fb>
			</SModal.Body>
			<SModal.Footer>
				<SButton
					position='right'
					label={this.props.editing ? 'speichern' : 'Nurtzer Erstellen'}
					onClick={this.onButtonClicked}
					disabled={false}
					color={'#2ECC71'}
				/>
				</SModal.Footer>
			</SModal.Main>
		)
	}
}
