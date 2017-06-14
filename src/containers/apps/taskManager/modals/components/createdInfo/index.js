import React from 'react'
import './styles.css'
import moment from 'moment'

export default ({createdBy, creationDate}) => {

  return(
    <fb className='createdInfo'>
      <icon className='icon-account_circle nop'/>
      <p>Erstellt von <b>{createdBy}</b> am<b> {moment.unix(creationDate).format('DD.MM.YYYY')}</b></p>
    </fb>
  )
}
