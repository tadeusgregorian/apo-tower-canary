import React from 'react'
import './styles.css'

export default () => (
  <fb className="taskRow headerRow">
    <fb className="creator">Ersteller</fb>
    <fb className="taskInfo">Aufgabe</fb>
    <fb className="assignedUsers">Beauftragte</fb>
    <fb className="taskType">Typ</fb>
    <fb className="creationDate">erstellt am</fb>
  </fb>
)
