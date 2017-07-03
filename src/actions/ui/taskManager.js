export const openUndoneTasksModal = (modal) => ({type: 'OPEN_UNDONDE_TASKS_MODAL', payload: modal})

export const closeUndoneTasksModal = () => ({type: 'CLOSE_UNDONDE_TASKS_MODAL'})

export const openAddTaskWizard = () => ({type: 'OPEN_ADD_TASK_WIZARD'})

export const closeTaskWizard = () => ({type: 'CLOSE_TASK_WIZARD'})

export const setCheckingTask = (task) => ({type: 'SET_CHECKING_TASK', payload: task})

export const closeCheckingTask = () => ({type: 'CLOSE_CHECKING_TASK'})

export const setCurrentDay = (smartDate) => ({type: 'TASKS_SET_CURRENT_DAY', payload: smartDate})
