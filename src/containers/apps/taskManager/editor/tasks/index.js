import React, {PureComponent} from 'react';
import _ from 'lodash';
import moment from 'moment'
import { stringIncludes } from 'helpers'
import LazyLoad, {forceCheck} from 'react-lazyload'
import Task from './task'
import './styles.css'


export default class Tasks extends PureComponent{

  componentDidUpdate = () => forceCheck()

  taskIsInPast = (t) => (
    (t.endDate && t.endDate < this.props.today) ||
    (t.onetimerDate && t.onetimerDate < this.props.today)
  )

  filteredSortedTasks() {
    const {filterCreator, filterAssignedUser, taskSearchString, showPastTask} = this.props
    let filtTs = this.props.tasks.filter(t => !t.isDuplicate && !t.originalShiftedTask)

    if (!showPastTask)																				filtTs = filtTs.filter(t => !this.taskIsInPast(t))
    if (filterCreator && filterCreator !== "none") 						filtTs = filtTs.filter(t => t.creatorID===filterCreator)
    if (filterAssignedUser && filterAssignedUser !== "none") 	filtTs = filtTs.filter(t => t.assignedUsers && t.assignedUsers[filterAssignedUser])
    if (this.props.taskSearchString) 													filtTs = filtTs.filter(t => stringIncludes(t.subject+' '+t.text, taskSearchString))

    return _.sortBy(filtTs, (t) => (
      this.props.selectedCategory === 'single' ?
        moment(t.onetimerDate).format('YYYYMMDD') :
        moment(t.creationDate).format('YYYYMMDD')
    )).reverse()
  }

  render(){
    console.log('heave calculation render !---------- ...')

    if (this.props.selectedCategory==='single' && this.props.allSingleTasksDataStatus !== 'LOADED') return (<fb>loading...</fb>)
    return(
      <div className="taskList">
      {this.filteredSortedTasks().map(t => (
          <LazyLoad height={44} overflow offset={100} once key={t.ID} >
            <Task
              today={this.props.today}
              users={this.props.users}
              user={this.props.selectedUser}
              task={t}
              isInPast={this.taskIsInPast(t)}
              openTaskDetailsPopup={this.props.openTaskDetailsPopup} />
          </LazyLoad>
      ))}
    </div>
    )
  }
}
