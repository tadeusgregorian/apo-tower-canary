import React from 'react'
import SButton from 'components/sButton';
import './styles.css';


export default function WizardFooter(props) {
	const {totalSteps, currentStep, stepForwardDisabled, stepForward, stepBackward, onStepsComplete} = props

	const isFinalStep = totalSteps === (currentStep + 1)
	const isFirstStep = currentStep === 0

	const stepForwardClicked = isFinalStep ? onStepsComplete : stepForward
	const stepBackwardClicked = stepBackward

	return(
		<fb className='wizardFooter'>
			{!!currentStep && <SButton label='Zurück' disabled={isFirstStep} onClick={stepBackwardClicked}/>}
			<fb className='nextButton'>
				<SButton
					color={'#2ECC71'}
					label={isFinalStep ? 'Fertig' : 'Weiter'}
					disabled={stepForwardDisabled}
					onClick={stepForwardClicked}/>
			</fb>
		</fb>
	)
}
