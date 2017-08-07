import React from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

export default () => {

  return(
    <fb className="footerMain">
      <fb className="center">
        <Link to='/Home/Kontakt' ><fb className="footerBtn">Kontakt</fb></Link>
        <Link to='/Home/Datenschutz' ><fb className="footerBtn">Datenschutz</fb></Link>
        <Link to='/Home/Impressum' ><fb className="footerBtn">Impressum</fb></Link>
      </fb>
    </fb>
  )
}
