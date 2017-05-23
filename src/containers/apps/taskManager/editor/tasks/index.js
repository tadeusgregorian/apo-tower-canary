import React, {PureComponent} from 'react';
import _ from 'lodash';
import moment from 'moment'
import { stringIncludes } from 'helpers'
import LazyLoad, {forceCheck} from 'react-lazyload'

import Task from './task'


export default class Tasks extends PureComponent{

  componentDidUpdate = () => forceCheck()

  taskIsInPast = (t) => (
    (t.endDate && t.endDate < this.props.today) ||
    (t.onetimerDate && t.onetimerDate < this.props.today)
  )

  filteredSortedTasks() {
    const {filterCreator, filterAssignedUser, taskSearchString, hidePastTask} = this.props
    let filtTs = this.props.tasks.filter(t => !t.isDuplicate && !t.originalShiftedTask)

    if (hidePastTask)																					filtTs = filtTs.filter(t => !this.taskIsInPast(t))
    if (filterCreator && filterCreator !== "none") 						filtTs = filtTs.filter(t => t.creatorID===filterCreator)
    if (filterAssignedUser && filterAssignedUser !== "none") 	filtTs = filtTs.filter(t => t.assignedUsers && t.assignedUsers[filterAssignedUser])
    if (this.props.taskSearchString) 													filtTs = filtTs.filter(t => stringIncludes(t.subject+' '+t.text, taskSearchString))

    return _.sortBy(filtTs, (t) => moment(t.creationDate).format('YYYYMMDD')).reverse()
  }

  render(){
    console.log('heave calculation render !---------- ...')

    if (this.props.selectedCategory==='single' && this.props.allSingleTasksDataStatus !== 'LOADED') return (<fb>loading...</fb>)
    return(
      <fb className="taskList">
      {this.filteredSortedTasks().map(t => (
          <LazyLoad height={44} overflow={true} offset={30} once={true} debounce={80} key={t.ID} placeholder={(<fb style={{height:'44px', borderTop:'1px solid #d3d3d3', paddingTop:'14px', paddingLeft:'14px', color:'#d3d3d3'}}>loading...</fb>)} >
            <Task
              today={this.props.today}
              users={this.props.users}
              user={this.props.selectedUser}
              task={t}
              isInPast={this.taskIsInPast(t)}
              openTaskDetailsPopup={this.props.openTaskDetailsPopup} />
          </LazyLoad>
      ))}
  		</fb>
    )
  }
}
