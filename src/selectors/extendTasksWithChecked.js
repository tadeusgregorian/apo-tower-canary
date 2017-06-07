import { createSelector } from 'reselect'
import { tasksWithReplacements } from 'selectors/tasksWithReplacements'

const getChecked = (state) => state.taskManager.checked

const getExtendedTasks = (tasks, checked) => {
	const extendedTasks = tasks.map(t => {
		const cObj = checked.find(c => c.taskID===t.ID)
		if(!cObj) return t

		switch (cObj.type) {
		case 'done' 		: return { ...t, isDone: true, 		isDoneBy: cObj.by,    isDoneDate: cObj.date}
		case 'ignored' 	: return { ...t, isIgnored: true, isIgnoredBy: cObj.by, isIgnoredDate: cObj.date}
		case 'shifted' 	: return { ...t, isShifted: true, isShiftedBy: cObj.by, isShiftedDate: cObj.date, isShiftedTo: cObj.shiftedTo}
		default : return t
		}
	})

	return extendedTasks
}

export const extendTasksWithChecked = createSelector([tasksWithReplacements, getChecked], getExtendedTasks)
