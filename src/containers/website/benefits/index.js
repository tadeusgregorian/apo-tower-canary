import React from 'react'
import checkboxIcon from './checkboxes6.png'
import ringIcon from './ring3.png'
import chattingIcon from './commun2.png'
import './styles.css'

export default () => {
  return(
    <fb className="benefitsMain">
      <fb className="center">
        <fb className="organisation infoBox">
          <img className="bigIcon" src={checkboxIcon} alt='checkbox' height='50px' width='50px' />
          <fb className="text">Bessere Organisation durch tägliche ToDo-Listen</fb>
          <fb className="moreText">Jedem Mitarbeiter erscheint täglich seine ToDo-Liste. Somit sind die Verantwortlichkeiten klar zugewiesen.</fb>
        </fb>
        <fb className="reminder infoBox">
          <img className="bigIcon" src={ringIcon} alt='checkbox' height='50px' width='50px' />
          <fb className="text">Erinnerung an unerledigte Aufgaben</fb>
          <fb className="moreText">Damit keine Aufgaben mehr vergessen oder unter den Teppich gekehrt werden.</fb>
        </fb>
        <fb className="communication infoBox">
          <img className="bigIcon" src={chattingIcon} alt='checkbox' height='50px' width='50px' />
          <fb className="text">Digitale Kommunikation mit dem Team</fb>
          <fb className="moreText">Informieren Sie Mitarbieter / Mitarbeiter-Gruppen, auch wenn diese gerade nicht anwesend sind.</fb>
        </fb>
      </fb>
    </fb>
  )
}
