import React from 'react';
import AssignedUsers from 'components/assignedUsers';
import TaskTypeInfo from '../components/taskTypeInfo'
import CreatedInfo from '../components/createdInfo'
import SButton from 'components/sButton'
import SModal from 'components/sModal'
import WithTooltip from 'components/withTooltip'
import _ from 'lodash'
import './styles.css';


export default ({users, task, editable, editTask, deleteTask, onClose, withoutFooter, deletable}) =>  {

		const assignedUsers = _.keys(task.assignedUsers)
		const createdBy = users.find(u => u.ID === task.creatorID).name

		const delteBtnClicked = () => {
			deleteTask(task)
			onClose()
		}

		const editBtnClicked = () => {
			editTask(task)
			onClose()
		}

		return (
			<SModal.Main title={task.subject} onClose={onClose}>
				<SModal.Body>
					<fb className='cucModalAssignedUsers'>
						<AssignedUsers {...{assignedUsers, users}} colorStyle='colorful' tooltipRight/>
					</fb>
					<fb className="checkUncheckModalBodyContent">
						<TaskTypeInfo task={task} />
						<CreatedInfo createdBy={createdBy} creationDate={task.creationDate} />
						{ task.text && <fb className='modalTaskText'>{task.text}</fb> }
					</fb>
				</SModal.Body>
				{!withoutFooter &&
					<SModal.Footer>
						<WithTooltip text={'Nur der Ersteller kann die Aufgabe bearbeiten.'} noTooltip={editable}>
							<SButton
								label='BEARBEITEN'
								onClick={editBtnClicked}
								disabled={!editable}
							/>
						</WithTooltip>
						<WithTooltip text={'Nur der Ersteller kann die Aufgabe löschen.'} noTooltip={editable}>
						<SButton
							color={'#e74c3c'}
							label={deletable ? 'LÖSCHEN' : 'BEENDEN'}
							onClick={delteBtnClicked}
							disabled={!editable}
						/>
					</WithTooltip>
					</SModal.Footer>
				}
			</SModal.Main>
		)
	}
