import React, {PureComponent} from 'react';
import SModal from 'components/sModal'
import WizardFooter from 'components/wizardFooter'

export default function composeWizard(stepComponents, defaultState) {
	return class Wizard extends PureComponent {
		constructor(props){
			super(props)

			this.defaultStepState = {
				noFooter: false,
				stepCompleteChecker: null
			}

			this.state = {
				stepTitle: '-',
				currentStep: 0,
				wiz: defaultState || {},
				wizMemory: {}, // this is used to keep track of state, that is not part of the wiz-Object ( Task / Qm ) for ex.: isUploading
				...this.defaultStepState
			}
		}

		stepIsComplete = () => (
			!this.state.stepCompleteChecker || this.state.stepCompleteChecker(this.state.wiz, this.state.wizMemory)
		)

		// this can be used to disable the stepForward Button by a func that returns true if
		//step input is sufficinet.
		setStepCompleteChecker = (func) => this.setState({stepCompleteChecker: func })

		editWizState 	= (edit) => { this.setState({ wiz: { ...this.state.wiz, ...edit} })}
		editWizMemory = (edit) => { this.setState({ wizMemory: { ...this.state.wizMemory, ...edit} })}
		setWizState  	= (wizS) => { this.setState({ wiz: wizS })}

		setStepTitle = (title) => this.setState({stepTitle: title})
		removeFooter = () 		 => this.setState({noFooter: true})

		stepForward  = () => { this.setState({ currentStep: this.state.currentStep  + 1, ...this.defaultStepState })}
		stepBackward = () => { this.setState({ currentStep: this.state.currentStep  - 1, ...this.defaultStepState })}

		forceWizardUpdate = () => this.forceUpdate()
		onStepsComplete = () => {
			if(this.state.stepsCompleteListener) this.state.stepsCompleteListener()
			this.props.onStepsComplete(this.state.wiz)
		}

		render() {
			const Comp = stepComponents[this.state.currentStep || 0]
			const compProps = {
				setStepTitle: this.setStepTitle,
				stepForward: 	this.stepForward,
				removeFooter: this.removeFooter,
				editOTask: this.editWizState,
				setOTask: this.setWizState,
				OTask: this.state.wiz,
				wizMemory: this.state.wizMemory,
				editWizMemory: this.editWizMemory,
				setStepCompleteChecker: this.setStepCompleteChecker,
				forceWizardUpdate: this.forceWizardUpdate,
			}

			return(
				<SModal.Main title={this.state.stepTitle} onClose={this.props.onClose}>
					<SModal.Body>
						<Comp {...compProps} />
					</SModal.Body>
						{ !this.state.noFooter &&
							<SModal.Footer>
								<WizardFooter
									stepForward={this.stepForward}
									stepBackward={this.stepBackward}
									currentStep={this.state.currentStep}
									totalSteps={stepComponents.length}
									onStepsComplete={this.onStepsComplete}
									stepForwardDisabled={!this.stepIsComplete()}
								/>
							</SModal.Footer>
						}
				</SModal.Main>
			)
		}
	}
}
