import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import 'styles/modals.scss';


export default function WizardFooter(props) {
	const {finalStep, disableForward, disableBackward, stepForward, stepBackward} = props

	return(
		<footer>
			<RaisedButton className="left" label='Zurück' primary={true} disabled={disableBackward} onTouchTap={stepBackward}/>
			<RaisedButton className="right" label={finalStep ? 'Fertig' : 'Weiter'} disabled={disableForward} primary={true} onTouchTap={stepForward}/>
		</footer>
	)
}
