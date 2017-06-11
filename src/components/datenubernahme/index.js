import React from 'react'
import SButton from 'components/sButton'
import { getOldQms, getOldUsers, refreshUsers, saveToAccount, getOldBranches, getOldGroups, refreshQms } from './helpers'
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
    console.log(newQms)
    saveToAccount(targetAccountID, 'qmLetters', newQms)
  }

  return(
    <fb className="datenubernahmeMain edgebox">
      <SButton label='Users Ubernehmen' onClick={usersUbernehmen}/>
      <SButton label='Branches Ubernehmen' onClick={branchesUbernemen}/>
      <SButton label='Groups Ubernehmen' onClick={groupsUbernemen}/>
      <SButton label='QMS Ubernehmen' onClick={qmsUbernehmen}/>
    </fb>
  )
}
