import React from 'react';
import classNames from 'classnames';
import './styles.css'
import cN from 'classnames'

//@param
// selectedOne = 'left' or 'right' ( left is default)
// onRightOneClicked
// onLeftOneClicked
// selectedStyleLeft
// selectedStyleRight
// labelLeft
// labelRight

const LiteSwitch = (props) => {
	const selectedOne = props.selectedOne || 'left'


	return (
		<fb className="templateModeSwitch">
			<tadeButton
				style={selectedOne === 'left' ? props.selectedStyleLeft : {}}
				onClick={props.onLeftOneClicked}
				className={cN({"weekShiftButton": true, "selected": selectedOne === 'left'})}>{props.labelLeft}
			</tadeButton>
			<tadeButton
				style={selectedOne === 'right' ? props.selectedStyleRight : {}}
				onClick={props.onRightOneClicked}
				className={cN({"templateButton": true, "selected": selectedOne === 'right'})}>{props.labelRight}
			</tadeButton>
		</fb>
	)
}

export default LiteSwitch;
