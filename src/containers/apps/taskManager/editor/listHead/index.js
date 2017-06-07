import React from 'react'
import './styles.css'

export default ({selectedCategory}) => (
  <fb className="headerRow">
    <fb className="creator creatorCell">Ersteller</fb>
    <fb className="taskInfo taskInfoCell">Aufgabe</fb>
    <fb className="assignedUsers assignedUsersCell">Beauftragte</fb>
    <fb className="taskType taskTypeCell">Typ</fb>
    <fb className="dateOfInterest taskDateCell">
      {selectedCategory === 'single' ?
        'fällig am' :
        'Startdatum'
      }
    </fb>
  </fb>
)
