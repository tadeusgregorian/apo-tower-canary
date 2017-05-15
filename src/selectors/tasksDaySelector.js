import { createSelector } from 'reselect'
import _ from 'lodash'
import {Wochentage} from 'constants';
import {TaskType} from 'constants'
import {smartYear} from 'helpers'
import {smartMonth} from 'helpers'
import moment from 'moment'

const MS_IN_WEEK = 7 * 24 * 60 * 60 * 1000

const getRepeatingTasks = (state) => state.taskManager.repeatingTasks
const getSingleTasks = (state) => state.taskManager.singleTasks
const getCurrentDay = (state) => state.ui.taskManager.currentDay


export const getTasksForDay = (repeatingTasks, singleTasks, day) => {
	const tasks = repeatingTasks.concat(singleTasks)
	if(!tasks) return []

	const dMoment = moment(day, 'YYYYMMDD')
	const beginningOfWeekMs = moment(day, 'YYYYMMDD').startOf('week').format('x')
	const daysInMonth = dMoment.daysInMonth()
	const dayOfMonth = parseInt(String(day).substr(6, 2), 10)
	const weekDay = dMoment.weekday()
	const dayIsSaturday = weekDay === 5
	const dayIsSunday = weekDay === 6

	let tasksForDay = tasks.filter(t => {

		if (t.endDate 	&& t.endDate   < day) return false
		if (t.startDate && t.startDate > day) return false

		if (t.onetimerDate && t.onetimerDate===day) return true
		if (t.irregularDates) return t.irregularDates.find(date => date===day)
		if (t.type===TaskType.daily) return ((!dayIsSaturday && !dayIsSunday) || (dayIsSaturday && t.includeSaturday) || (dayIsSunday && t.includeSunday))

		if (t.weekly) {
			if (t.repeatEvery) {
				let weekMsDifference = beginningOfWeekMs - t.beginningOfWeekMs
				if (!((weekMsDifference % (t.repeatEvery * MS_IN_WEEK))===0)) return false
			}
			return t.weekly.includes(Wochentage[weekDay])
		}

		if (t.monthly) {
			if (t.repeatEvery) {
				let yearDifference = smartYear(day) - smartYear(t.originalStartDate && t.startDate)
				let monthsDifference = smartMonth(day) - smartMonth(t.originalStartDate ? t.originalStartDate : t.startDate) + (yearDifference * 12)
				if (!(monthsDifference % t.repeatEvery)===0) return false
			}
			return t.monthly.find(md => { return md===dayOfMonth || (dayOfMonth===daysInMonth && md > daysInMonth) })
		}

		if (t.yearly) {
			if (t.repeatEvery) {
				let yearDifference = smartYear(day) - smartYear(t.originalStartDate && t.startDate)
				if (!(yearDifference % t.repeatEvery)===0) return false
			}
			return t.yearly.find(yD => String(yD).substr(4)===String(day).substr(4))
		}

		return false;
	})
	return tasksForDay
}

export const tasksForDaySelector = createSelector([getRepeatingTasks, getSingleTasks, getCurrentDay], getTasksForDay)
