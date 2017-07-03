import React from 'react'
import './styles.css'

export default ({text, type}) => {

  return(
    <fb className="infoNoteMain">
      <icon className="icon-warning" />
      <fb className="infoNoteText">
        {text}
      </fb>
    </fb>
  )
}
