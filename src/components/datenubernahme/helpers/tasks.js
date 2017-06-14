/* eslint-disable no-use-before-define */
import FBInstance from '../../../firebaseInstance'
import { userIDTranslator } from './users'
import { dumbToSmart } from './index'
import moment from 'moment'
import _ from 'lodash'

export const getOldTasks = () => {
  const ref = FBInstance.database().ref('oldData/tasks')
  return ref.once('value').then(snap => snap.val())
}


export const refreshTasks = (_oldTasks) => {
  let branches = {}

  //console.log(_oldTasks)

  _.values(_oldTasks).forEach(t => {
    let newTask = {}
    !branches[t.branch] && (branches[t.branch] = {tasks: { single: {}, repeating: {} } })

    if(t.ID === '8e1caa2e-013a-4103-b31d-e52f339b05f9') return // crazy alle 2 wochen aufgabe macht trouble -> manuell rauskicken

    newTask.ID                    = t.ID
    newTask.onetimerDate          = t.onetimerDate ? dumbToSmart(t.onetimerDate) : null
    newTask.creatorID             = userIDTranslator[t.creatorID]
    newTask.originalShiftedTask   = t.originalShiftedTask ? updateOST(t.originalShiftedTask) : null
    newTask.originalStartDate     = t.originalStartDate ? dumbToSmart(t.originalStartDate) : null
    newTask.originalStartDate     = t.origintalStartDate ? dumbToSmart(t.origintalStartDate) : null // origintal -> typo in the whole DB !
    newTask.originalTaskID        = t.originalTaskID ? t.originalTaskID : null
    newTask.prio                  = t.prio ? true : null
    newTask.type                  = t.type
    newTask.text                  = t.text ? t.text : null
    newTask.subject               = t.subject
    newTask.assignedUsers         = updateAssignedUsers(t.assignedUsers, t.replacements)
    newTask.startDate             = t.startDate ? dumbToSmart(t.startDate) : null
    newTask.endDate               = t.endDate ?   dumbToSmart(t.endDate) : null
    newTask.creationDate          = moment(t.creationDate).unix()
    newTask.repeatEvery           = t.repeatEvery ? t.repeatEvery : null
    newTask.weekly                = t.weekly ? t.weekly : null
    newTask.monthly               = t.monthly ? t.monthly : null
    newTask.yearly                = t.yearly ? t.yearly.map(d => dumbToSmart(d)) : null
    newTask.irregularDates        = t.irregularDates ? t.irregularDates.map(d => dumbToSmart(d)) : null
    newTask.includesSaturday      = t.includesSaturday ? t.includesSaturday : null
    newTask.includeSunday         = t.includeSunday ? t.includeSunday : null

     t.onetimerDate && (branches[t.branch].tasks.single[t.ID] = newTask)
    !t.onetimerDate && (branches[t.branch].tasks.repeating[t.ID] = newTask)
  })

  return branches
}

const updateOST = (ost) => ({ ...ost, date: dumbToSmart(ost.date) })

const updateAssignedUsers = (asUs, repl) => {
  let newAsUs = {}
  _.keys(asUs).forEach(uID => newAsUs[userIDTranslator[uID]] = 1)
  repl && _.keys(repl).forEach(rAsUs => asUs[rAsUs] && (newAsUs[userIDTranslator[rAsUs]] = userIDTranslator[repl[rAsUs]]) )
  return newAsUs
}
