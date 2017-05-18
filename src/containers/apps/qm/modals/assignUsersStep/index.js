import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment'
import {filterUsersByBranch, createGuid, filterUsersByGroup} from 'helpers'
import ChipBar from 'components/chipBar'
import SelectUsersBox from 'components/selectUsersBox'
import _ from 'lodash';
import { Toast } from 'helpers';
import {Storage} from '../../../../../firebaseInstance';
import { uploadQmFile } from 'actions'
import './styles.css';


class AssignUsersStep extends Component {
	constructor(props) {
		super(props)

		this.state = { selectedGroups: [], selectedBranches: [] }
	}

	componentWillMount = () =>  {
		this.props.setStepTitle('Mitarbeiter auswählen')
		this.props.setStepCompleteChecker((qm) => !!_.keys(qm.assignedUsers).length)
		this.props.setStepsCompleteListener(this.onFinish)
	}

	onFinish = () => {
		const { filesToBeDeleted, filesToUpload } = this.props.wizMemory
		const qmData = this.props.OTask

		/// come back here tade - take the file prop manipulation into first step !
		/// espeacially the deletion. 
		if (filesToBeDeleted && filesToBeDeleted.length) {
			filesToBeDeleted.forEach((f) => {
				const freshFiles = [...qmData.files].remove(file => file.guid === f.guid)
				this.props.setOTask({files: freshFiles})
				Storage.ref().child(`${window.accountID}/qm/${f.guid}/${f.name}`).delete()
			})
		}

		if (filesToUpload && filesToUpload.length) {
			let processedFilesToUpload = filesToUpload.map(f => (
				{name: f.name, guid: createGuid(), uploadTime: moment().toISOString(), size: f.size}
			))

			// adding the files that need to be uploaded already to the qmData object
			const filesFresh = [...processedFilesToUpload, ...(qmData.files || [])]
			this.props.editOTask({ files: filesFresh })

			let readAndUploadPromises = []
			filesToUpload.forEach((f, i) => {
				let fileReader = new FileReader();
				let readAndUploadPromise = new Promise((resolve, reject) => {
					fileReader.onloadend = () => {
						const fileReaderResult = fileReader.result.split(',')[1]
						uploadQmFile(fileReaderResult, processedFilesToUpload[i].guid, f.name)
							.then(snapshot => {
								console.log('didITT!')
								console.log(snapshot)
								resolve(snapshot)
							}).catch(c => reject(c))
					}
					fileReader.readAsDataURL(f)
				})
				readAndUploadPromises.push(readAndUploadPromise);
			})

			Promise.all(readAndUploadPromises).then((snapshot) => {
				// finished upload succesfully
			}).catch(e => {
				// maybe delte the 'files' property of the qm if shit failed ?
				Toast.error(`Fehler beim hochladen der Anhänge:` + e)
			})
		}
	}

	selectUsersByGroup = (gID) => {
		const selecteds = this.state.selectedGroups
		const deselecting = _.includes(selecteds, gID)
		const newGroups =  deselecting ? _.without(selecteds, gID) : _.concat(selecteds, gID)

		this.setState({selectedGroups: newGroups})

		let selectedUsersIds = {}
		for (let i of newGroups) {
			let usersArray = filterUsersByGroup(this.props.users, i).filter(u => u.ID !== this.props.user.ID)
			let usersArrayFiltered = []
			let selectedBranches =  (this.state.selectedBranches.length > 0) ? this.state.selectedBranches : this.props.branches.map(b => b.ID)  // if non branch selected, there should be no branch filter.
			for (let b of selectedBranches) {
				usersArrayFiltered.push(...filterUsersByBranch(usersArray, b))
			}
			for (let f of usersArrayFiltered) {
				selectedUsersIds[f.ID] = 1;
			}
		}
		this.props.editOTask({assignedUsers: selectedUsersIds})
	}

	selectDeselectUser = (uID) => {
		const oldAU = this.props.OTask.assignedUsers
		const newAU = oldAU && oldAU[uID] ? _.omit(oldAU, uID) : { ...oldAU, [uID]: 1 }
		this.props.editOTask({assignedUsers: newAU})
	}

	selectUsersByBranch = (bID) => {
		const selecteds = this.state.selectedBranches
		const deselecting = _.includes(selecteds, bID)
		const newBras =  deselecting ? _.without(selecteds, bID) : _.concat(selecteds, bID)

		this.setState({selectedBranches: newBras})

		let selectedUsersIds = {}
		for (let i of newBras) {
			let usersArray = filterUsersByBranch(this.props.users, i).filter(u => u.ID !== this.props.user.ID)
			for (let f of usersArray) {
				selectedUsersIds[f.ID] = 1
			}
		}
		this.props.editOTask({assignedUsers: selectedUsersIds});
	}

	render() {
		return (
			<fb className="qmAssignUsersStep">
					<fb className="chipBarBranches">
						<ChipBar
							chips={this.props.branches}
							selectedChips={this.state.selectedBranches}
							chipClicked={this.selectUsersByBranch}
						/>
					</fb>
					<fb className="chipBarGroups">
						<ChipBar
							chips={this.props.groups}
							selectedChips={this.state.selectedGroups}
							chipClicked={this.selectUsersByGroup}
						/>
					</fb>
					<fb className="selectUsersBox">
						<SelectUsersBox
							users={this.props.users}
							selectedUsers={this.props.OTask.assignedUsers}
							userClicked={this.selectDeselectUser}
						/>
					</fb>
			</fb>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.core.selectedUser,
		users: state.data.users,
		groups: state.data.groups,
		branches: state.data.branches
	}
}

export default connect(mapStateToProps)(AssignUsersStep);
