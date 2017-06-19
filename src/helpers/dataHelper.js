import {TaskType} from 'constants'
import _ from 'lodash';
import moment from 'moment'

const weekSorter = {
	"Mo":1,
	"Di":2,
	"Mi":3,
	"Do":4,
	"Fr":5,
	"Sa":6,
	"So":7
}

export function filterUsersByGroup(users, groupID) {
	let filteredUsers = users.filter((user) => {
		return user.assignedGroups && user.assignedGroups[groupID];
	});
	return filteredUsers ? filteredUsers : [];
}

export function filterUsersByBranch(users, branchID) {
	let filteredUsers = users.filter((user) => {
		return user.branches && user.branches[branchID];
	});
	return filteredUsers ? filteredUsers : [];
}

export function getUserById(users, userID) {
	return users.find(u => u.ID===userID);
}

export const filterTasksForUser = (tasks, user) => {
	return tasks.filter(t => !user || (!!_.values(t.assignedUsers).filter(auID => auID === user.ID).length))
}

export const getTypeAndPatternOfTask = (task) => {
		let r = {}
		switch (task.type) {
			case TaskType.onetimer:
			case "0": {		// crazyBugfix: for a while there was "0" written into DB instead of 0 .

				r.type = "Einmalig "
				r.pattern = moment(task.onetimerDate, 'YYYYMMDD').format("DD. MMM YYYY")
				break
			}
			case TaskType.weekly: {
				r.type = task.repeatEvery ?  `alle ${task.repeatEvery} Wochen` : "Wöchentlich "

			  let sortedWeekdays = task.weekly && [ ...task.weekly ].sort((a,b) =>  {
					return (weekSorter[a] > weekSorter[b])
				})
				r.pattern = sortedWeekdays.join("  ")
				break
			}
			case TaskType.monthly: {
				r.type =  task.repeatEvery ?  `alle ${task.repeatEvery} Monate` : "Monatlich "
				let sortedMonthDays = task.monthly && [...task.monthly].sort((a,b) => a > b )
				r.pattern = "am " + sortedMonthDays.map(date => date + ". /").join("  ").slice(0, -1)
				break
			}
			case TaskType.daily: {
				r.type =  "Täglich"
				r.pattern =  	((task.inculdeSaturday || task.includeSunday ) ? " inkl." : "" ) +
								( task.includeSaturday ? " SA " : "" ) +
								( task.includeSunday ? " SO" : "" )
				break
			}
			case TaskType.yearly: {
				r.type = task.repeatEvery ?  `alle ${task.repeatEvery} Jahre` : "Jährlich"
				r.patternFullLength = task.yearly && task.yearly.map( d => moment(d).format("DD MMM") ).join(",  ")
				if( task.yearly.length >= 4 ){
					r.pattern = task.yearly && task.yearly.at([0,1,2,3]).map( d => moment(d).format("DD MMM") ).join(" ,  ")+" , ..."
				}else{
					r.pattern = r.patternFullLength;
				}
				break
			}
			case TaskType.irregular: {
				r.type =  "Multi-Datum"
				r.patternFullLength = task.irregularDates && task.irregularDates.map( date =>  moment(date, 'YYYYMMDD').format("DD.MM.YY")).join(" / ")
				if( task.irregularDates.length >= 3 ){
					r.pattern = task.irregularDates && task.irregularDates.slice(0, 3).map( date =>  moment(date , 'YYYYMMDD').format("DD.MM.YY")).join(" /  ") +" , ..."
				}else{
					r.pattern = r.patternFullLength;
				}
				break
			}
			default: {
				r.type =  ""
				r.pattern = ""
				r.patternFullLength = null
			}
		}
		return r;
	}
