import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteQm } from 'actions';
import composePopup from 'composers/popup';
import toastr from 'toastr';
import RaisedButton from 'material-ui/RaisedButton';
import 'styles/modals.scss';
import {Storage} from '../../../../../firebaseInstance';

export default class DeleteQmPopup extends Component {

	deleteQm = () => {
		deleteQm(this.props.qm.ID)
		if (this.props.qm.files) {
			this.props.qm.files.forEach((f) => {
				Storage.ref().child(`qm/${f.guid}/${f.name}`).delete()
			})
		}
		this.props.close()
	}

	render() {
		return(
			<fb className='modal'>
				<header><h4>QM-Brief löschen</h4></header>
				<content>
					<p>Möchten sie diesen QM-Brief wirklich löschen?</p>
				</content>
				<footer>
					<div className="content-left">
						<RaisedButton
							label='abbrechen'
							primary={true}
							onTouchTap={this.props.close} />
					</div>
					<div className="content-right">
						<RaisedButton
							label='löschen'
							primary={true}
							onTouchTap={this.deleteQm} />
					</div>
				</footer>
			</fb>
		)
	}
}
