import React, {PureComponent} from 'react';
import SModal from 'components/sModal'
import WizardFooter from 'components/wizardFooter'

export default function composeWizard(stepComponents, defaultState) {
	return class Wizard extends PureComponent {
		constructor(props){
			super(props)

			this.footerDefaultState = {
				noFooter: false,
				stepForwardDisabled: false,
				stepCompleteChecker: null
			}

			this.state = {
				stepTitle: '-e-',
				currentStep: 0,
				wiz: defaultState,
				...this.footerDefaultState
			}
		}

		stepIsComplete = () => {
			return(
				!this.state.stepCompleteChecker || this.state.stepCompleteChecker(this.state.wiz)
			)
		}


		setStepCompleteChecker = (func) => this.setState({stepCompleteChecker: func })

		editWizState = (edit) => { this.setState({ wiz: { ...this.state.wiz, ...edit} })}
		setWizState  = (wizS) => { this.setState({ wiz: wizS })}

		setStepTitle = 			 	(title) => this.setState({stepTitle: title})
		removeFooter = 			 	() 			=> this.setState({noFooter: true})
		enableStepForward =  	() 			=> this.setState({stepForwardDisabled: false})
		disableStepForward = 	() 			=> this.setState({stepForwardDisabled: true})

		stepForward  = () => { this.setState({ currentStep: this.state.currentStep  + 1, ...this.footerDefaultState })}
		stepBackward = () => { this.setState({ currentStep: this.state.currentStep  - 1, ...this.footerDefaultState })}

		onStepsComplete = () => { this.props.onStepsComplete(this.state.wiz) }

		render() {
			const Comp = stepComponents[this.state.currentStep || 0]
			const compProps = {
				setStepTitle: this.setStepTitle,
				stepForward: 	this.stepForward,
				removeFooter: this.removeFooter,
				enableStepForward: this.enableStepForward,
				editOTask: this.editWizState,
				setOTask: this.setWizState,
				OTask: this.state.wiz,
				setStepCompleteChecker: this.setStepCompleteChecker
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
