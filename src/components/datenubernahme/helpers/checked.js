/* eslint-disable no-use-before-define */
import { userIDTranslator } from './users'
import { dumbToSmart } from './index'
import moment from 'moment'
import _ from 'lodash'

export const refreshChecked = (_oldTasks, branchID) => {
  let branch = { checked: {}, checkedMini: {} }

  _.values(_oldTasks).filter(t => t.branch === branchID).forEach(t => {

    t.checked && _.keys(t.checked).forEach(tDate => {
      if(tDate.length === 8) return // there is dirty data in db
      if(t.onetimerDate && tDate !== t.onetimerDate) return // when tasks got shifted, the checked of repTasks got copied over, and bloat the checked now. The are unnecessary
      if(t.startDate && dumbToSmart(t.startDate) > dumbToSmart(tDate)) return
      const freshChecked   = getChecked(tDate, t.ID, t.checked[tDate], 'done')
      addToBranch(branch, freshChecked)
    })

    t.ignored && _.keys(t.ignored).forEach(tDate => {
      if(t.onetimerDate && tDate !== t.onetimerDate) return
      if(t.startDate && dumbToSmart(t.startDate) > dumbToSmart(tDate)) return
      const freshIgnored   = getChecked(tDate, t.ID, t.ignored[tDate], 'ignored')
      addToBranch(branch, freshIgnored)
    })

    t.shifted && _.keys(t.shifted).forEach(tDate => {
      if(t.onetimerDate && tDate !== t.onetimerDate) return
      if(t.startDate && dumbToSmart(t.startDate) > dumbToSmart(tDate)) return
      const freshShifted   = getShifted(tDate, t.ID, t.shifted[tDate])
      addToBranch(branch, freshShifted)
    })
  })

  console.log(_.keys(branch.checked).length)
  return branch
}

const getChecked = (_taskDate, _taskID, checked, _type) => {
  const ID        = dumbToSmart(_taskDate) + _taskID
  const by        = userIDTranslator[checked.checkerID]
  const date      = moment(checked.date).unix()
  const taskDate  = dumbToSmart(_taskDate)
  const type      = _type
  const taskID    = _taskID

  return { ID, by, date, taskDate, type, taskID }
}

const getShifted = (_taskDate, _taskID, _shiftedTo) => {
  const ID        = dumbToSmart(_taskDate) + _taskID
  const by        = 'u001'
  const date      = moment().unix()
  const taskDate  = dumbToSmart(_taskDate)
  const type      = 'shifted'
  const taskID    = _taskID
  const shiftedTo = _shiftedTo

  return { ID, by, date, taskDate, type, taskID, shiftedTo }
}

const addToBranch = (branch, checked) => {


  branch.checked[checked.ID] = checked
  !branch.checkedMini[checked.taskDate] && (branch.checkedMini[checked.taskDate] = {})
  branch.checkedMini[checked.taskDate][checked.taskID] = 1
}
