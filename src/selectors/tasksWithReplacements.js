import { createSelector } from 'reselect'
import { getTodaySmart } from 'helpers'
import { tasksForDaySelector } from 'selectors/tasksDaySelector'
import _ from 'lodash'

const getUsers = (state) => state.data.users

const getRearrangedTasks = (tasks, users) => {

	let usersOnVac = {}
	users.forEach(u => u.onVacation && u.onVacation <= getTodaySmart() && (usersOnVac[u.ID] = 1))
	if(!_.keys(usersOnVac).length) return tasks

	const rearrangedTasks = tasks.map(t => {
		if(t.onetimerDate) return t // onetimer dont have replacements

		const assignedUsersOnVac = _.keys(t.assignedUsers).filter(uID => usersOnVac[uID])
		if(!assignedUsersOnVac.length) return t
		const assignedUsersOnVacWithRepl = assignedUsersOnVac.filter(uID => t.assignedUsers[uID] !== 1)
		if(!assignedUsersOnVacWithRepl.length) return t

		const replacersArray = _.uniq(assignedUsersOnVacWithRepl.map(uID => t.assignedUsers[uID])) // we use uniq cause there can be the same replacer for two assignedUsers

		let newAssignedUsers = { ...t.assignedUsers } // assignedUsers just get extended by replacers. the replacedUsers stay here as well.
		replacersArray.forEach(uID => { if(!t.assignedUsers[uID]) newAssignedUsers[uID] = 'replacer' }) // put a user only as replacer, If he istn't already an assignes User!
		assignedUsersOnVacWithRepl.forEach(uID => newAssignedUsers[uID] = 'replaced')

		return { ...t, assignedUsers: newAssignedUsers}
	})

	return rearrangedTasks
}

export const tasksWithReplacements = createSelector([tasksForDaySelector, getUsers], getRearrangedTasks)

// info: if the replacer himselfe is in vacation / or deleted he will still be displayed. We dont check for that ( for now )
