import React from 'react'
import doctorJpg from './doctor.jpg'
import relaxedJpg from './relaxed.jpg'
import './styles.css'

export default () => {

  return(
    <fb className="testimonyMain">
      <fb className="center">
        <img className="pharmacistImg" src={relaxedJpg} alt='doc' />
        <fb className="textWrapper">
          <fb className="main">"Mit dem Apotower organisiert sich die Apotheke wie von selbst."</fb>
          <fb className="small">Mark Bender - Apothekenleiter</fb>
        </fb>
      </fb>
    </fb>
  )
}
