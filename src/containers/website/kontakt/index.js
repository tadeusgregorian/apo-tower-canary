import React from 'react'
import './styles.css'

export default (props) => {

  return(
    <fb className="kontaktMain">
      <fb className="kontaktHead">Apotower / Kontakt</fb>
      <fb className="content">
        <fb className="row">
          <fb className="cell1">Adresse:</fb>
          <fb className="cell2">Bernstorffstraße 174, 22767 Hamburg</fb>
        </fb>
        <fb className="row">
          <fb className="cell1">Telefon:</fb>
          <fb className="cell2">0049/1623643444</fb>
        </fb>
        <fb className="row">
          <fb className="cell1">Email:</fb>
          <fb className="cell2">team@apotower.de</fb>
        </fb>
      </fb>
    </fb>
  )
}
