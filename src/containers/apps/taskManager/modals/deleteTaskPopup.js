import React, {PureComponent} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import 'styles/modals.css';

//@param task obj
//@param close function
//@param deleteTask function

export default class DeleteTaskPopup extends PureComponent {

	deleteTask = () => {
		this.props.deleteTask(this.props.task)
		this.props.close()
	}

	render() {
		const task = this.props.task;
		const isOnetimer = !!task.onetimerDate;
		let header = "";
		let infoText = "";
		let buttonLabel = "";

		if (isOnetimer) {
	    header = "Möchten sie diese Aufgabe Entfernen?";
	    infoText = "";
	    buttonLabel = "Aufgabe entfernen"
		}

		if (!isOnetimer) {
	    header = "Möchten sie diese Aufgabe ab Heute beenden?";
	    infoText = "Vergangene Einheiten dieser Aufgabe bleiben dabei unverändert.";
	    buttonLabel = "Aufgabe beenden"
		}

		return (
		  <fb className='modal'>
		      <header>
		          <h4>{header}</h4>
		      </header>
		      <content>
		          <p>{infoText}</p>
		      </content>
		      <footer>
		          <fb className="left">
		              <RaisedButton label={'abbrechen'} onClick={this.props.close} primary={true}/>
		          </fb>
		          <div className="content-right">
		              <RaisedButton primary={true} label={buttonLabel} onClick={this.deleteTask}/>
		          </div>
		      </footer>
		  </fb>
		)
	}
}
