import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
//import SButton from 'components/sButton'
import _ from 'lodash'
import 'styles/modals.css';
import './styles.css';

export default class DefineContentStep extends Component {

	componentWillMount = () => {
		this.props.setStepTitle('Aufgabenbeschreibung')
		this.props.setStepCompleteChecker((qm) => !!qm.subject )
	}

	addChosenFiles = (e, f, c) => {
		e.persist()
		this.props.editWizMemory({
			filesToUpload: [
				...(this.props.wizMemory.filesToUpload || []),
				...e.target.files
			]
		})
	}

	removeFile = (f) => {
		const { filesToUpload, filesToBeDeleted } = this.props.wizMemory
		if (_.includes(filesToUpload, f)) {
			/// if removing a element that is not yet uploaded ( when creating new QM )
			this.props.editWizMemory({ filesToUpload: [...filesToUpload].remove(f) })
		} else {
			/// if removing a element that is already uploaded ( when editing existing QM )
			this.props.editWizMemory({ filesToBeDeleted: [...filesToBeDeleted, f] })
		}
	}

	render() {
		console.log(this.props)
		const { OTask, editOTask } = this.props
		const { filesToBeDeleted, filesToUpload} = this.props.wizMemory
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
					{OTask.files && OTask.files.filter(f => !(filesToBeDeleted && filesToBeDeleted.filter(d => d.guid===f.guid)).length ).map(f => (
						<fb key={f.name + f.lastModified} className="qm-file">
							<fb className="name">{f.name}</fb>
							<FlatButton
								primary={true}
								className="iconButton"
								onClick={() => this.removeFile(f)}
								icon={<FontIcon className="icon icon-close" />}
							/>
							</fb>
					))}
						{filesToUpload && filesToUpload.map(f => (
							<fb key={f.name + f.lastModified} className="file notUploadedYet">
								<fb className="name">{f.name}</fb>
								<FlatButton
									primary={true}
									className="iconButton"
									onClick={() => this.removeFile(f)}
									icon={<FontIcon className="icon icon-close" />}
								/>
								</fb>
						))}
					</fb>
			</fb>
		)
	}
}
