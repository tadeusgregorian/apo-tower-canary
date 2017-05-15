import React  from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import './styles.css';

const AnimationWrapperElement = ({children}) => (<fb className="tasksTransitionWrapper no-grow vertical no-shrink">{children}</fb>)

const TaskTransitionGroup = ({children}) => {
	return (
		<ReactCSSTransitionGroup
			component={AnimationWrapperElement}
			transitionEnter={false}
			transitionLeave={false}
			transitionName="taskAnimation"
			transitionEnterTimeout={200}
			transitionLeaveTimeout={200}>
			{children}
		</ReactCSSTransitionGroup>
	)
}

export default TaskTransitionGroup;
