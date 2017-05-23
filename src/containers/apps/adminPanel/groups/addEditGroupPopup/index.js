import React, { PureComponent } from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css';

export default class AddEditGroupPopup extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			groupName: this.props.editing ? this.props.group.name : ''
		}
	}

	onButtonClicked = () => {
		this.props.editing ?
			this.props.editGroup({ ...this.props.group, name: this.state.groupName}) :
			this.props.addNewGroup(this.state.groupName)

		this.props.onClose()
	}

	onInputChanged = (input) => {
		this.setState({groupName: input.target.value})
	}

	render() {
		const title = this.props.editing ? 'Gruppe bearbeiten' : 'Neue Gruppe erstellen'
		return (
			<SModal.Main onClose={this.props.onClose} title={title}>
				<SModal.Body>
					<fb className="addEditGroupMain">
						<input
							type="text"
							value={this.state.groupName}
							className="groupNameInput"
							placeholder="Gruppenname"
							onChange={this.onInputChanged}
							autoFocus />
						<SButton
							label='BESTÄTIGEN'
							disabled={!this.state.groupName}
							onClick={this.onButtonClicked}
							color={'#2ecc71'}
						/>
					</fb>
				</SModal.Body>
			</SModal.Main>

		);
	}
}
