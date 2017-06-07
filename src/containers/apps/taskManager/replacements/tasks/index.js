import React, {PureComponent} from 'react';
import _ from 'lodash';
import LazyLoad, {forceCheck} from 'react-lazyload'
import Task from './task'
import './styles.css'


export default class Tasks extends PureComponent{

  componentDidUpdate = () => forceCheck()

  render(){
    return(
      <div className="taskListReplacements">
      {this.props.tasks.map(t => (
        <LazyLoad height={44} overflow offset={100} once key={t.ID} >
          <Task
            task={t}
            users={this.props.users}
            selectedUser={this.props.selectedUser}
            removeReplacement={this.props.removeReplacement}
            openTaskDetailsPopup={this.props.openTaskDetailsPopup}
            openReplacementPopup={this.props.openReplacementPopup} />
        </LazyLoad>
      ))}
    </div>
    )
  }
}
