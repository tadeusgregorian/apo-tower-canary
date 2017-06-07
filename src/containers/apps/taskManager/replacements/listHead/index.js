import React from 'react'
import './styles.css'

export default ({selectedCategory}) => (
  <fb className="replacementsListHead">
    <fb className="taskInfo taskInfoCell">Aufgabe</fb>
    {/* <fb className="taskType taskTypeCell">Typ</fb> */}
    <fb className="myReplacement myReplacementCell">Meine Vertretung</fb>
    {/* <fb className="assignedUsers assignedUsersCell">Beauftragte</fb> */}
  </fb>
)
