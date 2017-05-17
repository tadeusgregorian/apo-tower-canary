import React from 'react'
import cN from 'classnames';
import _ from 'lodash';
import './styles.css'

export default ({users, selectedUsers, userClicked}) => {

  return(
    <fb className="selectUsersBoxMain">
      {users.map(u => (
          <fb
            key={u.ID}
            className={cN({'userElement': true, 'selected': selectedUsers && selectedUsers[u.ID]})}
            onClick={() => userClicked(u.ID)}
          >
            {u.name}
          </fb>
        )
      )}
    </fb>
  )
}
