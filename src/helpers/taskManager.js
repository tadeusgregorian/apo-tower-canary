import moment from 'moment'
import { getTasksForDay } from 'selectors/tasksDaySelector'

export const calculatePastTasksGrid = (repeatingTasks, pastSingleTasks, daysInPastToTrack) => {
	let tasksGrid = {}

	for(let i=1; i <= daysInPastToTrack; i++) {
		const day = parseInt(moment().subtract(i, 'days').format('YYYYMMDD'))
		tasksGrid[day] = getTasksForDay(repeatingTasks, [], day).map(t => t.ID) // giving just the repeatingTasks in this func, we leave second argument empty. We handle singleTasks seperateley to imporve performance.
	}
	pastSingleTasks.forEach(t => tasksGrid[t.onetimerDate]  = tasksGrid[t.onetimerDate] ? tasksGrid[t.onetimerDate].concat([ t.ID ]) : [ t.ID ])

	return tasksGrid
}
