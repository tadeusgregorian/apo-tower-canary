import React from 'react';
import moment from 'moment'
import AssignedUsers from 'components/assignedUsers'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import TaskTransitionGroup from './taskTransitionGroup'
import { undoneTasksOfSelectedUser } from 'selectors/undoneTasksOfSelectedUser'
import cN from 'classnames'
import {connect} from 'react-redux';
import _ from 'lodash'
import './styles.css';

const UndoneTasksModal = ({undoneTasks, onClose, jumpToDate, openCheckUncheckTaskPopup, users}) =>  {

  const formatDate = (smartDate) => moment(smartDate, 'YYYYMMDD').format('D. MMM')

  const taskClicked = (t) => {
    // to bring the task obj into the regular fresh format again. ID prop is important here!
    openCheckUncheckTaskPopup({ ...t, ID: t.taskID, taskID: null })
  }

  const jumpToDateClicked = (taskDate) => {
    onClose()
    jumpToDate(taskDate)
  }

  return(
    <SModal.Main title='Unerledigte Aufgaben in der Vergangenheit' onClose={onClose}>
			<SModal.Body>
        <fb className="undoneTasksWrapper">
          <TaskTransitionGroup>
            { undoneTasks.map(t =>
              <fb className="undoneTaskRow" key={t.ID}>
                <fb className="jumpBackButton" onClick={() => jumpToDateClicked(t.taskDate)}>
                  <icon className="icon-arrow_back"/>
                </fb>
                <fb className={cN({undoneTask: true, prio: !!t.prio})} onClick={() => taskClicked(t)}>
                  <fb className="taskDate">{formatDate(t.taskDate)}</fb>
                  <fb className="taskSubject">{t.subject}</fb>
                  <AssignedUsers assignedUsers={_.keys(t.assignedUsers)} users={users}/>
                </fb>
              </fb>
            )}
          </TaskTransitionGroup>
        </fb>
			</SModal.Body>
      <SModal.Footer>
        <SButton right label='schließen' onClick={onClose}/>
      </SModal.Footer>
    </SModal.Main>
  )
}

const mapStateToProps = (state) => {
	return {
		undoneTasks: undoneTasksOfSelectedUser(state)
	}
}

export default connect(mapStateToProps)(UndoneTasksModal);
