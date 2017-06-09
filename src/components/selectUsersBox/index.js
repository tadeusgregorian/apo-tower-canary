import React from 'react'
import cN from 'classnames';
import _ from 'lodash';
import './styles.css'

export default ({users, selectedUsers, blockedUsers, userClicked}) => {

  console.log(blockedUsers)

  return(
    <fb className="selectUsersBoxMain">
      {users.map(u => {
        const selected = selectedUsers && selectedUsers.includes(u.ID)
        const disabled = blockedUsers && blockedUsers.includes(u.ID)

        return(
          <fb key={u.ID} className={cN({ 'userElement': true, selected, disabled})} onClick={() => !disabled && userClicked(u.ID)}>
            {u.name}
          </fb>
        )
      })}
    </fb>
  )
}
