import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './styles.scss'


export default class QmApp extends PureComponent {

	render() {
		return (
			<fb className="vertical qm">
				{React.cloneElement(this.props.children, {user: this.props.user})}
			</fb>
		)
	}
}
