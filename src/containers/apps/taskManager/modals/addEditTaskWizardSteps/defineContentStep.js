import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox'
import WizardFooter from 'components/wizardFooter'
import 'styles/modals.css';

export default class DefineContentStep extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			subject: this.props.OTask.subject || '',
			text: this.props.OTask.text || ''
		}
	}

	saveInputAndContinueWith = (continueFunction) => {
		this.props.editOTask({subject: this.state.subject, text: this.state.text})
		continueFunction()
	}

	render() {
		return (
			<div>
				<header><h3>Inhalt definieren</h3></header>
				<content>
					<fb className="no-shrink">
						<TextField
							autoFocus
							value={this.state.subject}
							onChange={(e) => this.setState({subject: e.target.value})}
							floatingLabelText="Betreff"
							fullWidth={true}
						/>
					</fb>
					<fb className="no-shrink">
						<TextField
					      floatingLabelText="Details"
						  	value={this.state.text}
						  	onChange={(e) => this.setState({text: e.target.value})}
					      multiLine={true}
						  	fullWidth={true}
						  	rowsMax={4}
					      rows={3}
						  	inputStyle={{maxHeight: "70px"}}
					    />
					</fb>
					<fb className="vertical j-center a-center margin-top no-shrink">
						<Checkbox
							onClick={() => this.props.editOTask({prio: this.props.OTask.prio ? null : true})}
							checked={!!this.props.OTask.prio}
							label="Hohe Priorität"
						/>
					</fb>
				</content>
				<WizardFooter
					stepForward={()=>this.saveInputAndContinueWith(this.props.stepForward)}
					stepBackward={()=>this.saveInputAndContinueWith(this.props.stepBackward)}
					disableForward={!this.state.subject}/>
			</div>
		);
	}
}
