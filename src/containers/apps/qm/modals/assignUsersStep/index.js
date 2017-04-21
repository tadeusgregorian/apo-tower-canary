import React, {Component} from 'react';
import cN from 'classnames';
import {connect} from 'react-redux';
import moment from 'moment'
import {filterUsersByBranch, createGuid, filterUsersByGroup, playTaskCreatedSound} from 'helpers'
import _ from 'lodash';
import toastr from 'toastr';
import RaisedButton from 'material-ui/RaisedButton';
import {Storage} from '../../../../../firebaseInstance';
import 'styles/modals.scss';
import './styles.scss';


class AssignUsersStep extends Component {
	constructor(props) {
		super(props)

		this.state = {
			assignedUsers: props.subState.assignedUsers || props.initData && props.initData.assignedUsers || {},
			selectedGroups: [],
			selectedBranches: []
		}
	}

	 onFinish = () => {
		if (this.props.isBusy) return
		this.props.busy(true);

		const qmData = {
			...this.props.initData,
			...this.props.subState,
			...this.state,
			creatorID: this.props.creatorID
		}

		delete qmData.filesToUpload;
		delete qmData.selectedGroups;
		delete qmData.selectedBranches;

		playTaskCreatedSound()

		if (this.props.subState.filesToBeDeleted.length) {
			this.props.subState.filesToBeDeleted.forEach((f) => {
				qmData.files = [...qmData.files].remove(file => file.guid == f.guid);
				Storage.ref().child(`qm/${f.guid}/${f.name}`).delete().then(s => {
				})
			})
		}

		const getPdfMedataData = (name) => ({contentType: "application/pdf", contentDisposition : "inline; filename=" + name})
		const getSimpleAttachmentMetaData = (name) => ({contentType: "application/text", contentDisposition : "attachment; filename=" + name})
		// first we upload the files when the files are uploaded we can update the qmData with the right
		// file guids
		if (this.props.subState.filesToUpload.length) {
			let processedFilesToUpload = this.props.subState.filesToUpload.map(f => ({name: f.name, guid: createGuid(), uploadTime: moment().toISOString(), size: f.size}))

			// adding the files that need to be uploaded already to the qmData object
			qmData.files = [...processedFilesToUpload, ...qmData.files];
			let readAndUploadPromises = []
			this.props.subState.filesToUpload.forEach((f, i) => {
				let fileReader = new FileReader();
				let readAndUploadPromise = new Promise((resolve, reject) => {
					fileReader.onloadend = () => {
						const fileRefForStorage = Storage.ref().child(`qm/${processedFilesToUpload[i].guid}/${f.name}`);
						// since there are some unwanted chars at the beginning of the fileReader result we need to remove them
						fileRefForStorage
							.putString(
								fileReader.result.from(fileReader.result.indexOf(',') + 1),
								'base64',
								f.name.last(4) == ".pdf" ? getPdfMedataData(f.name) : getSimpleAttachmentMetaData(f.name)
							).then(snapshot => {
								resolve(snapshot);
							}).catch(c => reject(c))
					}
					fileReader.readAsDataURL(f)
				});
				readAndUploadPromises.push(readAndUploadPromise);
			})

			// when all fileuploads are complete we update the qm object
			Promise.all(readAndUploadPromises).then((snapshot) => {
				this.props.onFinish(qmData)
				this.props.close()
			}).catch(e => {
				toastr.error(`Fehler beim hochladen der Anhänge:` + e);
				this.props.close();
			})

		} else {
			this.props.onFinish(qmData)
			this.props.close()
		}
	}

	safeAndPreviousStep() {
		this.props.setSubState({
			...this.state
		});
		this.props.previousStep();
	}

	selectUsersByGroup(g) {
		let selectedGroups = _.clone(this.state.selectedGroups);
		let index = selectedGroups.indexOf(g.ID);
		if (index < 0) {
			selectedGroups.push(g.ID);
		} else {
			selectedGroups.removeAt(index);
		}

		this.setState({selectedGroups: selectedGroups})

		let selectedUsersIds = {};
		for (let i of selectedGroups) {
			let usersArray = filterUsersByGroup(this.props.users, i);
			let usersArrayFiltered = [];
			let selectedBranches =  (this.state.selectedBranches.length > 0) ? this.state.selectedBranches : this.props.branches.map(b => b.ID)  // if non branch selected, there should be no branch filter.
			for (let b of selectedBranches) {
				usersArrayFiltered.push(...filterUsersByBranch(usersArray, b));

			}
			for (let f of usersArrayFiltered) {
				selectedUsersIds[f.ID] = 1;
			}
		}
		this.setState({assignedUsers: selectedUsersIds});
	}

	selectDeselectUser(u) {
		let clonedAssignedUsers = _.clone(this.state.assignedUsers);
		if (clonedAssignedUsers[u.ID]) {
			delete clonedAssignedUsers[u.ID];
		} else {
			clonedAssignedUsers[u.ID] = 1;
		}
		this.setState({assignedUsers: clonedAssignedUsers})
	}

	selectUsersByBranch(b) {
		let selectedBranches = _.clone(this.state.selectedBranches);
		let index = selectedBranches.indexOf(b.ID);
		if (index < 0) {
			selectedBranches.push(b.ID);
		} else {
			selectedBranches.removeAt(index);
		}

		this.setState({selectedBranches: selectedBranches})

		let selectedUsersIds = {};
		for (let i of selectedBranches) {
			let usersArray = filterUsersByBranch(this.props.users, i).filter(u => u.ID != this.props.user.ID)
			for (let f of usersArray) {
				selectedUsersIds[f.ID] = 1
			}
		}
		this.setState({assignedUsers: selectedUsersIds});
	}

	render() {
		return (
			<div>
				<header>
					<h3>Nutzer zuweisen</h3>
				</header>
				<content>
					<fb className="qm-user-group-wrapper" style={{borderBottom:"1px solid #adadad"}}>
						<fb className="categorie">Fillialen:</fb>
						<fb className="inner-group-wrapper">
							{this.props.branches.map(b => {
								let isSelected = (this.state.selectedBranches.indexOf(b.ID) >= 0);
								return (
									<div
										key={b.ID}
										className={cN({"user-group": true, "selected": isSelected})}
										style={{
											backgroundColor: (isSelected
											? 'blue'
											: "#BBBBBB")
										}}
										onTouchTap={() => this.selectUsersByBranch(b)}>
										{b.name}
									</div>
								);
							})}
						</fb>
					</fb>
					<fb className="qm-user-group-wrapper">
						<fb className="categorie">Gruppen:</fb>
							<fb className="inner-group-wrapper">
								{this.props.groups.map(g => {
									let isSelected = (this.state.selectedGroups.indexOf(g.ID) >= 0);
									return (
										<div
											key={g.ID}
											className={cN({"user-group": true, "selected": isSelected})}
											style={{
												backgroundColor: (isSelected
												? 'blue'
												: "#BBBBBB")
											}}
											onTouchTap={() => this.selectUsersByGroup(g)}>
											{g.name}
										</div>
									);
								})}
						</fb>
					</fb>

					<fb className="qm-modal-user-wrapper padding-top">
						{this.props.users.filter(u => u.ID != this.props.user.ID).map(u => {
							let isSelected = !!(this.state.assignedUsers[u.ID]);
							return (
								<fb
									key={u.ID}
									className={cN({'modal-user': true, 'selected': isSelected})}
									style={{ color: (isSelected ? 'blue' : "#353535"), borderColor: (isSelected ? 'blue': "grey")}}
									onTouchTap={() => this.selectDeselectUser(u)}>
									{u.name}
								</fb>
							)
						})}
					</fb>
				</content>
				<footer>
					<buttonWrapper className={cN({'left': true})}>
						<RaisedButton label='Zurück' primary={true} onTouchTap={this.safeAndPreviousStep.bind(this)}/>
					</buttonWrapper>
					<buttonWrapper className={cN({'right': true})}>
						<RaisedButton
							label='Fertig'
							disabled={_.isEmpty(this.state.assignedUsers)}
							primary={true}
							onTouchTap={this.onFinish}/>
					</buttonWrapper>
				</footer>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {users: state.data.users, groups: state.data.groups, branches: state.data.branches}
}

export default connect(mapStateToProps)(AssignUsersStep);
