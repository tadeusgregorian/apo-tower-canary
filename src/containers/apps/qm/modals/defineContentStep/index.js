import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
//import SButton from 'components/sButton'
import { uploadQmFile } from 'actions'
import { createGuid } from 'helpers'
import moment from 'moment'
import { Toast } from 'helpers'
import _ from 'lodash'
import { Storage } from '../../../../../firebaseInstance'
import './styles.css'

export default class DefineContentStep extends Component {
	constructor(props){
		super(props)

		this.filesToUpload =  []
	}

	componentWillMount = () => {
		this.props.setStepTitle('Aufgabenbeschreibung')
		this.props.setStepCompleteChecker((qm) => !!qm.subject )
	}

	addChosenFiles = (e, f, c) => {
		e.persist()
		this.filesToUpload = _.uniqBy([ ...this.filesToUpload, ...e.target.files], 'name')
		this.startToUpload()
		this.forceUpdate()
	}

	startToUpload = () => {
		let readAndUploadPromises = []
		this.filesToUpload.forEach((f, i) => {
			const qmFile = {name: f.name, guid: createGuid(), uploadTime: moment().toISOString(), size: f.size}
			let fileReader = new FileReader()
			let readAndUploadPromise = new Promise((resolve, reject) => {
				fileReader.onloadend = () => {
					const fileReaderResult = fileReader.result.split(',')[1]

					uploadQmFile(fileReaderResult, qmFile.guid, qmFile.name)
					.then(snapshot => {
						this.filesToUpload =  this.filesToUpload.filter(file => file.name !== f.name)
						this.props.editOTask({files: (this.props.OTask.files || []).concat(qmFile)})
						// console.log(f)
						// console.log(qmFile)
						// console.log(snapshot)
						resolve(snapshot)
					}).catch(c => {
						reject(c)
					})
				}
				fileReader.readAsDataURL(f)
			})
			readAndUploadPromises.push(readAndUploadPromise);
		})

		Promise.all(readAndUploadPromises).then((snapshot) => {
			// finished upload succesfully
		}).catch(e => {
			Toast.error(`Fehler beim hochladen der Anhänge:` + e)
		})
	}

	removeExistingFile = (f) => {
		Storage.ref().child(`${window.accountID}/qm/${f.guid}/${f.name}`).delete()
		const freshFiles = this.props.OTask.files.filter(file => file.guid !== f.guid)
		this.props.editOTask({files: freshFiles})
	}

	render() {
		const { OTask, editOTask } = this.props
		return (
			<fb className='qmDefineContentMain'>
					<fb className="no-shrink">
						<TextField
							autoFocus
							value={OTask.subject || ''}
							onChange={(e) => editOTask({subject: e.target.value})}
							floatingLabelText="Betreff"
							fullWidth={true}/>
					</fb>
					<fb className="no-shrink">
						<TextField
							floatingLabelText="Details"
							value={OTask.text || ''}
							onChange={(e) => editOTask({text: e.target.value})}
							multiLine={true}
							fullWidth={true}
							rowsMax={4}
							rows={3}
							inputStyle={{ maxHeight: "70px" }}
						/>
					</fb>
					<fb className="horizontal lastMofo">
						<fb className="appendFileButton">
							<RaisedButton
								containerElement='label'
								labelPosition="before"
								style={{position: "relative"}}
								label='Dateien anhängen'
								icon={< FontIcon className="icon icon-upload" />}>
								<input
									multiple
									onChange={(e, f, c) => this.addChosenFiles(e, f, c)}
									className="fileUpload"
									id="fileUpload"
									type="file"/>
							</RaisedButton>
						</fb>
						<fb className="checkBoxWrapper">
							<Checkbox
								label="Dringende Ansage"
								checked={OTask.isUrgent}
								onClick={() => editOTask({ isUrgent: !OTask.isUrgent })}
							/>
						</fb>
					</fb>
					<fb className="no-shrink margin-top vertical">
					{OTask.files && OTask.files.map((f, i) => (
						<fb key={i} className="qm-file">
							<fb className="name">{f.name}</fb>
							<FlatButton
								primary={true}
								className="iconButton"
								onClick={() => this.removeExistingFile(f)}
								icon={<FontIcon className="icon icon-close" />}
							/>
							</fb>
					))}
						{this.filesToUpload.map((f, i) => (
							<fb key={i} className="file notUploadedYet">
								<fb className="name">{f.name}</fb><fb>loading...</fb>
							</fb>
						))}
					</fb>
			</fb>
		)
	}
}
