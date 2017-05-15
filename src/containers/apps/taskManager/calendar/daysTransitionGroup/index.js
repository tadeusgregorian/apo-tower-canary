import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './styles.css';

const AnimationWrapperElement = ({children}) => (<fb className="animationWrapperElement">{children}</fb>)

const DaysTransitionGroup = ({movingDirection, children}) => (
	<ReactCSSTransitionGroup
		component={AnimationWrapperElement}
		transitionName={`tasksDayAnimation-${movingDirection ? "backward" : "forward"}`}
		transitionEnterTimeout={200}
		transitionLeaveTimeout={140}>
		{children}
	</ReactCSSTransitionGroup>
)

export default DaysTransitionGroup;
