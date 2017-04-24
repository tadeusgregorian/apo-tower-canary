import { createSelector } from 'reselect';

const getCurrentDay = 		state => state.ui.taskManager.currentDay
const getSelectedUser = 	state => state.core.selectedUser
const getUndoneTasks =   	state => state.taskManager.undoneTasks

const calculateDateForUser = (currentDay, selectedUser, undoneTasks) => {
	if(!undoneTasks.length) return false
	const tasksForUser = selectedUser ? undoneTasks.filter(t => !!t.assignedUsers[selectedUser]) : undoneTasks
	if(!tasksForUser.length) return false
	const taskDates = tasksForUser.map(t => t.taskDate)
	const uniqueDates = [ ...new Set(taskDates) ]
	const sortedDates = uniqueDates.sort()
	const datesBeforeCurrentDay = sortedDates.filter(date => date < currentDay)

	if(!datesBeforeCurrentDay.length) return sortedDates.slice(-1)[0] // jump again to the front of row
	return datesBeforeCurrentDay.slice(-1)[0]
}

export const getLastDateWithUndoneTask = createSelector([ getCurrentDay, getSelectedUser, getUndoneTasks ], calculateDateForUser)
