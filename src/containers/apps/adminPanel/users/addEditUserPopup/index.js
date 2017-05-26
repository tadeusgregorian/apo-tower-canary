import cN  from 'classnames'
import React, { Component } from 'react'
import { userColors } from 'helpers/colors';
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import ChipBar from 'components/chipBar'
import _ from 'lodash'
import './styles.css';

export default class AddEditUserPopup extends Component {
	constructor(props) {
		super(props);

		const editing = this.props.editing
		const user = this.props.user

		this.state = {
			name: 					editing ? user.name : '',
			nameInitials: 	editing ? user.nameInitials : '',
			color: 					editing ? user.color : '',
			branches: 			editing ? _.keys(user.branches) : this.getDefaultBranch(),
			assignedGroups: editing ? _.keys(user.assignedGroups) : ['101'], // we need this dummy '1' here, so user.groups doesnt get get deleted on firebase
			userinputMissingText: '',
		};
	}

	getDefaultBranch = () => {
		// if only one branch exists, return that one, else empty
		return this.props.branches.length === 1 ? [this.props.branches[0].ID] : ['101']
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
		//attention: props.branches - are all existing branches obj: {name: xyz, ID: 2929} AND state.branches are user branches arr: [id01, id02]
		if(!this.props.branches.find(b =>  _.includes(this.state.branches, b.ID))){
			this.setState({userinputMissingText: 'Bitte wählen Sie mindestens eine Filiale aus.'})
			return;
		}

		let userObj 						= { ...this.props.user }
		userObj.name 						= this.state.name
		userObj.nameInitials 		= this.state.nameInitials
		userObj.color 					= this.state.color
		userObj.assignedGroups  = this.state.assignedGroups.reduce((acc, val) => ({ ...acc, [val]: 1}), {})
		userObj.branches 				= this.state.branches.reduce((acc, val) => ({ ...acc, [val]: 1}), {})

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

	chipClicked = (bID, target) => {
		const currentBs = this.state[target]
		const newBs = _.includes(currentBs, bID) ? _.without(currentBs, bID) : [ ...currentBs, bID ]
		this.setState({[target]: newBs})
	}

	render() {
		console.log(this.state)
		return (
				<SModal.Main title='Neuer Benutzer' onClose={this.props.close}>
					<SModal.Body>
				<fb className="addEditUserPopup">
					{ this.state.userinputMissingText ? <fb className="userinputMissingText">{this.state.userinputMissingText}</fb> : null}
					<fb className="inputItemWrapper">
						<fb className="inputDescription" >Benutzername:</fb>
						<input className="nameInputField" type="text" value={this.state.name} autoFocus onChange={this.onNameInputChanged.bind(this)}/>
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
					{	this.props.branches.length > 1 &&
						<fb className="inputItemWrapper">
							<fb className="inputDescription">arbeitet in:</fb>
							<fb className="branchesWrapper">
								<ChipBar
									chips={this.props.branches}
									selectedChips={this.state.branches}
									chipClicked={(bID) => this.chipClicked(bID, 'branches')}/>
							</fb>
						</fb>
					}
					<fb className="inputItemWrapper">
						<fb className="inputDescription">arbeitet als:</fb>
						<fb className="branchesWrapper">
							<ChipBar
								chips={this.props.groups}
								selectedChips={this.state.assignedGroups}
								chipClicked={(gID) => this.chipClicked(gID, 'assignedGroups')}/>
						</fb>
					</fb>
				</fb>
			</SModal.Body>
			<SModal.Footer>
				<SButton
					right
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
