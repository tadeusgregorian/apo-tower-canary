import React, { Component } from 'react'
import composePopup  from 'composers/popup';
import 'styles/popup.css';

//props:
//noDenyOption : boolean

class ConfirmPopup extends Component {
	onFinish() {
		this.props.close(this);
	}

	onConfirmButtonClicked() {
		if(this.props.onDecisionMade)  this.props.onDecisionMade(true, this.props.whatToConfirm);
		this.onFinish();
	}

	onDenyButtonClicked() {
		if(this.props.onDecisionMade) this.props.onDecisionMade(false);
		this.onFinish();
	}

	render() {
		return (
			<div className="confirm-popup">
				<header>
					<h3>{this.props.headerText}</h3>
				</header>
				<content>
					<fb className="popup-content">
						{this.props.mainText}
					</fb>
				</content>
				<footer>
					{ this.props.noDenyOption ? null :
						<button onClick={this.onDenyButtonClicked.bind(this)}>
							Abbrechen
						</button>
					}
					<right>
						<button onClick={this.onConfirmButtonClicked.bind(this)}>
							{ this.props.noDenyOption ? 'OK' : 'Bestätigen' }
						</button>
					</right>
				</footer>
			</div>
		);
	}
}

export default composePopup(ConfirmPopup);
