import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox'
import './styles.css';

export default class DefineContentStep extends PureComponent {

	componentWillMount = () => {
		this.props.setStepTitle('Aufgabenbeschreibung')
		this.props.setStepCompleteChecker((task) => !!task.subject )
	}

	render(){
		const {editOTask, OTask} = this.props
		return(
			<fb className='defineContentMain'>
					<fb className="no-shrink">
						<TextField
							autoFocus
							value={OTask.subject || ''}
							onChange={(e) => e.target.value.length < 72 && editOTask({subject: e.target.value})}
							floatingLabelText="Betreff"
							fullWidth={true}
						/>
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
						  	inputStyle={{maxHeight: "70px"}}
					    />
					</fb>
					<fb className="urgentCheckboxWrapper">
						<Checkbox
							onClick={() => editOTask({prio: OTask.prio ? null : true})}
							checked={!!OTask.prio}
							label="Hohe Priorität"
						/>
					</fb>
			</fb>
		)
	}
}
