import React, {PureComponent} from 'react';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import 'styles/modals.scss';


export default function composeWizard(stepComponents) {
	class Wizard extends PureComponent {
		render() {
			const Comp = stepComponents[this.props.currentStep || 0]
			const compProps = {
				stepForward: this.props.stepForward,
				stepBackward: this.props.stepBackward,
				editOTask: this.props.editOperatingTask,
				setOTask: this.props.setOperatingTask,
				saveTaskToDB: this.props.saveTaskToDB,
				OTask: this.props.operatingTask,
				mode: this.props.taskWizard  // its either 'add' or 'edit'
			}
			return(
				<fb className='modal wizardMain'>
					<Comp {...compProps} />
				</fb>
			)
		}
	}

	const mapDispatchToProps = (dispatch) => {
		return bindActionCreators({
			stepForward:  () => ({type: 'NEXT_WIZARD_STEP'}),
			stepBackward: () => ({type: 'PREVIOUS_WIZARD_STEP'}),
			editOperatingTask: (edit) => ({type: 'EDIT_OPERATING_TASK', payload: edit}),
			setOperatingTask: (OTask) => ({type: 'SET_OPERATING_TASK', payload: OTask})
		}, dispatch)
	}

	const mapStateToProps = (state) => {
		return {
			currentStep: state.ui.taskManager.currentWizardStep,
			operatingTask: state.ui.taskManager.operatingTask,
			taskWizard: state.ui.taskManager.taskWizard
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(Wizard)
}
