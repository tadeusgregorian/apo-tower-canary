import { createSelector } from 'reselect';

const getSelectedUser = (state) => { return state.core.selectedUser }
const getUndoneTasks = (state) => { return state.taskManager.undoneTasks }


const filterUndoneTasks = (selectedUser, undoneTasks) => {
  return !selectedUser ? undoneTasks : undoneTasks.filter(t => t.assignedUsers[selectedUser])
}


export const undoneTasksOfSelectedUser = createSelector([ getSelectedUser, getUndoneTasks ], filterUndoneTasks)
