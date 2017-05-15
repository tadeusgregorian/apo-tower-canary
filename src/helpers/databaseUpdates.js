import {eternitySmart, TaskType} from 'constants'
import FBInstance from '../firebaseInstance';
import {createShortGuid, shortenGuid, shortISOToSmartDate} from 'helpers';
import _ from 'lodash'
import moment from 'moment'

const toSmart = (dDate) => parseInt((dDate.substr(0, 4) + dDate.substr(5, 2) + dDate.substr(8, 2)), 10)

export const updateKeysToSmart = (target) => {
	let result = {}
	for(let dDate in target) {
		result[toSmart(dDate)] = target[dDate]
		//console.log(toSmart(dDate))
	}
	return result
}

export const updateKeysAndValuesToSmart = (target) => {
	let result = {}
	for (let dDate in target) {
		result[toSmart(dDate)] = toSmart(target[dDate])
	}
	return result
}

const updateArrayToSmart = (target) => {
	return target.map(dumb => toSmart(dumb))
}

const refreshAssignedUsers = (aU) => {
	let result = {}
	for (let uID in aU) {
		result[shortenGuid(uID)] = 1
	}
	return result
}

const refreshTasks = (_tasks) => {
	return _tasks.map(t =>{

		if(t.isDuplicate) return null

		t.assignedUsers = refreshAssignedUsers(t.assignedUsers)
		t.creatorID = shortenGuid(t.creatorID)
		t.ID = shortenGuid(t.ID)

		if(t.ignored)	t.ignored	= null
		if(t.checked)	t.checked	= null
		if(t.shifted) t.shifted = null

		if(t.replacements) t.replacements = null

		if(t.irregularDates) t.irregularDates = updateArrayToSmart(t.irregularDates)
		if(t.yearly) t.yearly = updateArrayToSmart(t.yearly)

		if(t.onetimerDate) 	t.onetimerDate 	= toSmart(t.onetimerDate)
		if(t.endDate) 			t.endDate 			= toSmart(t.endDate)
		if(t.startDate) 		t.startDate 		= toSmart(t.startDate)

		if(t.originalShiftedTask) t.originalShiftedTask.date = toSmart(t.originalShiftedTask.date)

		// add endDate as eternety, where there is no end Date. Its Needed for filtering from DB
		if(!t.endDate) {
			if(t.type===TaskType.onetimer) 	t.endDate = t.onetimerDate
			if(t.type===TaskType.irregular) 	t.endDate = _.max(t.irregularDates)

			if(t.type===TaskType.daily) 			t.endDate = eternitySmart
			if(t.type===TaskType.weekly) 		t.endDate = eternitySmart
			if(t.type===TaskType.monthly) 		t.endDate = eternitySmart
			if(t.type===TaskType.yearly) 		t.endDate = eternitySmart
		}

		if(t.type===TaskType.onetimer)  t.startDate = null // delte startdate, some onetimers have fucking startdates, i think caused by a already fixed bug.

		t.withDetailedTime = null
		t.isDeadline = null
		t.withEndDate = null
		t.preponeHoliday = null
		t.preponeSaturday = null
		t.preponeSunday = null
		t.ignored = null
		t.shifted = null
		t.checked = null
		if(t.hour) t.hour = null
		if(t.minute) t.minute = null
		if(t.prio===0) t.prio = null
		if(t.replacementBoxOpen) t.replacementBoxOpen = null	// so random shit in the db
		if(t.replacementPopupIsOpen) t.replacementPopupIsOpen = null // so random shit in db

		if(t.onetimerDate) t.endDate = null

		if(t.originalStartDate) {
			t.startDate = toSmart(t.originalStartDate)
			t.originalStartDate = null
		}
		if(t.origintalStartDate) { // origintal <- there is actually a typo in a lot of nodes in DB
			t.startDate = toSmart(t.origintalStartDate)
			t.origintalStartDate = null
		}
		return t
	})
}

export const createCheckedInBranches = (_tasks) => {
	const tasksFiltered = _tasks.filter(t => !t.isDuplicate && !t.originalShiftedTask)
	const checked = {}

	tasksFiltered.forEach(t => {
		if(!checked[t.branch]) checked[t.branch] = {}
		for(let taskDate in t.checked) {
			const guid = createShortGuid()
			checked[t.branch][guid] = {
				ID: guid,
				taskID: shortenGuid(t.ID),
				taskDate: shortISOToSmartDate(taskDate),
				date: t.checked[taskDate].date || moment().toISOString(),
				by: shortenGuid(t.checked[taskDate].checkerID),
				type: 'done'
			}
		}
		for(let taskDate in t.ignored) {
			const guid = createShortGuid()
			checked[t.branch][guid] = {
				ID: guid,
				taskID: shortenGuid(t.ID),
				taskDate: shortISOToSmartDate(taskDate),
				date: t.ignored[taskDate].date || moment().toISOString(),
				by: shortenGuid(t.ignored[taskDate].checkerID),
				type: 'ignored'
			}
		}
		for(let from in t.shifted) {
			const guid = createShortGuid()
			checked[t.branch][guid] = {
				ID: guid,
				taskID: shortenGuid(t.ID),
				taskDate: shortISOToSmartDate(from),
				shiftedTo: shortISOToSmartDate(t.shifted[from]),
				date: moment().toISOString(),
				by: shortenGuid("dc44cecb-dcb6-42c2-9b59-90896f670c92"),
				type: 'shifted'
			}
		}
	})

	for(let branch in checked) {
		console.log(checked)
		const ref = FBInstance.database().ref('taskManager/branches/'+branch+'/checked')
		ref.off()
		ref.set(checked[branch]).then(console.log('finishedREAL'))
	}
}

export const deleteTaskManager = () => {
	const ref = FBInstance.database().ref('taskManager')
	ref.off()
	ref.set(null)
}

export const shortenUsers = (users) => {
	const ref = FBInstance.database().ref('users')
	let shortUsers = {}
	users.forEach(u =>{ shortUsers[shortenGuid(u.ID)] = { ...u, ID: shortenGuid(u.ID)} })
	ref.off()
	ref.set(shortUsers)
	//console.log(shortUsers)
}

export const moveTasksToBranches = (tasks) => {
	console.log('hitIT')
	const ref = FBInstance.database().ref('taskManager')
	ref.off()
	let freshTasks = refreshTasks(tasks)

	freshTasks.forEach(t => {
		if(!t) return
		const branch = t.branch
		const categorie = t.onetimerDate ? 'single' : 'repeating'
		t.branch  = null
		ref.child('branches/'+branch+'/tasks/'+categorie).child(t.ID).set(t)
		//console.log(t)
	})
}

export const createCheckedCount = (branches, checked, repeatingTasks) => {
	branches.forEach(b => {
		const ref = FBInstance.database().ref('taskManager/branches/'+b.ID+'/checked')
		let checkedMini = {}
		ref.once('value').then(checkedSnap => {
			const checked = _.values(checkedSnap.val()).filter(c => c.taskDate > 20160101 && c.taskDate < 20180101)
			checked.forEach(c => {
				if(!checkedMini[c.taskDate]) checkedMini[c.taskDate] = {}
				checkedMini[c.taskDate][c.taskID] =  1
			})
			const targetRef = FBInstance.database().ref('taskManager/branches/'+b.ID+'/checkedMini')
			targetRef.set(checkedMini)
			console.log('done')
		})
	})
}
