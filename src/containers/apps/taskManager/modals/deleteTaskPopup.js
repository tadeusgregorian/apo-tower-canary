import React, {PureComponent} from 'react';
import cN from 'classnames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import composePopup from 'composers/popup';
import toastr from 'toastr'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {deleteTask, updateTask} from 'actions';
import moment from 'moment'
import 'styles/modals.scss';

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
		              <RaisedButton label={'abbrechen'} onTouchTap={this.props.close} primary={true}/>
		          </fb>
		          <div className="content-right">
		              <RaisedButton primary={true} label={buttonLabel} onTouchTap={this.deleteTask}/>
		          </div>
		      </footer>
		  </fb>
		)
	}
}
