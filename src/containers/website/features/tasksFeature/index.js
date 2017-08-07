import React from 'react'
import tasksJpg from './dummyTasks.jpg'
import './styles.css'

export default () => {

  return(
    <fb className="tasksFeatureMain">
      <fb className="center">
        <img className="tasksJpg" src={tasksJpg} alt='tasks' width='557px' height='205px'/>
        <fb className="textWrapper">
          <fb className="main">Alle Aufgaben auf einem Blick</fb>
          <fb className="small">
            Ist eine Aufgabe erledigt hakt der Mitarbieter diese im Apotower ab. So ist immer auf einem Blick sichtbar, welche Aufgaben noch ausstehen.
          </fb>
        </fb>
      </fb>
    </fb>
  )
}
