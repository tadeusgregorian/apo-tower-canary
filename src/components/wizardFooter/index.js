import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import 'styles/modals.css';


export default function WizardFooter(props) {
	const {finalStep, disableForward, disableBackward, stepForward, stepBackward} = props

	return(
		<footer>
			<RaisedButton className="left" label='Zurück' primary={true} disabled={disableBackward} onClick={stepBackward}/>
			<RaisedButton className="right" label={finalStep ? 'Fertig' : 'Weiter'} disabled={disableForward} primary={true} onClick={stepForward}/>
		</footer>
	)
}
