import React from 'react'
import cN from 'classnames';
import _ from 'lodash';
import './styles.css'

export default ({users, selectedUsers, blockedUsers, userClicked, whyBlocked}) => {

  return(
    <fb className="selectUsersBoxMain">
      {users.map(u => {
        const selected = selectedUsers && selectedUsers.includes(u.ID)
        const isDisabled = blockedUsers && blockedUsers.includes(u.ID)

        return isDisabled ?
          <fb key={u.ID} className='userElement isDisabled' data-balloon={whyBlocked} data-balloon-pos='top'>{u.name}</fb> :
          <fb key={u.ID} className={cN({ 'userElement': true, selected })} onClick={() => userClicked(u.ID)}>{u.name}</fb>
      })}
    </fb>
  )
}
