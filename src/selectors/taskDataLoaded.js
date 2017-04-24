import { createSelector } from 'reselect';
import _ from 'lodash'

const rep = (state) => { return state.taskManager.repeatingTasksDataStatus }
const sin = (state) => { return state.taskManager.singleTasksDataStatus }
const che	= (state) => { return state.taskManager.checkedDataStatus }
const und = (state) => { return state.taskManager.undoneTasksDataStatus }
const las	= (state) => { return state.taskManager.lastUTUpdateDataStatus }

// returns TRUE if all DataStatuses are 'LOADED', else returns FALSE
const allLoaded = (rep, sin, che, und, las) => {
	const dataStatuses = [rep, sin, che, und, las]
	return dataStatuses.reduce((acc, curr) => (curr !== 'LOADED' ? false : acc), true)
}

export const taskDataLoaded = createSelector([rep, sin, che, und, las], allLoaded)
