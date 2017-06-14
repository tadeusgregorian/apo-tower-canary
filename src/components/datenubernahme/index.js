import React from 'react'
import FBInstance from '../../firebaseInstance';
import SButton from 'components/sButton'
import {
  getOldQms,
  getOldUsers,
  refreshUsers,
  saveToAccount,
  getOldBranches,
  getOldGroups,
  getOldTasks,
  refreshTasks,
  refreshChecked,
  refreshQms } from './helpers'
import _ from 'lodash'
import './styles.css'

export default (props) => {
  const targetAccountID = '4pgrqyiOCKhuoNQQeLjj7AyYW1G2' // email is: info@andreas-apotheke-hh.de

  async function usersUbernehmen () {
    const oldUsers = await getOldUsers()
    const newUsers = refreshUsers(oldUsers)
    saveToAccount(targetAccountID, 'users', newUsers)
  }

  async function branchesUbernemen () {
    const branches = await getOldBranches()
    saveToAccount(targetAccountID, 'branches', branches)
  }

  async function groupsUbernemen () {
    const groups = await getOldGroups()
    saveToAccount(targetAccountID, 'groups', groups)
  }

  async function qmsUbernehmen () {
    const oldQms = await getOldQms()
    const newQms = refreshQms(oldQms)
    saveToAccount(targetAccountID, 'qmLetters', newQms)
  }

  async function tasksUbernehmen () {
    const oldTasks = await getOldTasks()
    const newTasks = refreshTasks(oldTasks)
    saveToAccount(targetAccountID, 'taskManager/branches', newTasks)
  }

  async function checkedUbernehmen () {
    const oldTasks = await getOldTasks()
    const branches = await getOldBranches()
    _.keys(branches).forEach(bID => {
      const newChecked = refreshChecked(oldTasks, bID)
      saveToAccount(targetAccountID, 'taskManager/branches/' + bID +'/checked', newChecked.checked)
      saveToAccount(targetAccountID, 'taskManager/branches/' + bID +'/checkedMini', newChecked.checkedMini)
    })
  }

  const createNode = () => {
    FBInstance.database().ref().child('oldData/dummy').set('dully')
  }

  return(
    <fb className="datenubernahmeMain edgebox">
      <SButton label='Users' onClick={usersUbernehmen}/>
      <SButton label='Branches' onClick={branchesUbernemen}/>
      <SButton label='Groups' onClick={groupsUbernemen}/>
      <SButton label='QMS' onClick={qmsUbernehmen}/>
      <SButton label='Tasks' onClick={tasksUbernehmen}/>
      <SButton label='Checked' onClick={checkedUbernehmen}/>
      <SButton label='create node' color='red' onClick={createNode}/>
    </fb>
  )
}
