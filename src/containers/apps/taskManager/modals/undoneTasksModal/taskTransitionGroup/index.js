import React  from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import './styles.css';

const TaskTransitionGroup = ({children, blockAnimation}) => {
	return (
		<ReactCSSTransitionGroup
			transitionEnter={false}
			transitionName="taskAnimation"
			transitionLeaveTimeout={130}>
			{children}
		</ReactCSSTransitionGroup>
	)
}

export default TaskTransitionGroup;
