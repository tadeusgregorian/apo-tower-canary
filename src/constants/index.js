export const eternitySmart = 30000101

export const TaskType = {
	onetimer: 0,
	weekly: 1,
	monthly: 2,
	daily: 3,
	yearly: 4,
	deadline: 5,
	irregular: 6,
};

export const daysInPastToTrack = 30

export const Wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export const TaskPrio = {
	low: null,
	middle: 1,
	high: 2
}

export const addTaskWizzardPhases  = ['chooseType', 'setTiming', 'defineContent', 'assignedUsers']
export const editTaskWizzardPhases = ['setTiming', 'defineContent', 'assignedUsers']
