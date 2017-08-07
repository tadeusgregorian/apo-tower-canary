import React from 'react'
import mediManJpg from './mediMan.jpg'
import './styles.css'

export default () => {

  return(
    <fb className="qmFeatureMain">
      <fb className="center">
        <fb className="textWrapperCenter">
          <fb className="textWrapper">
            <fb className="main">Papierlose QM-Briefe</fb>
            <fb className="small">
              Teilen Sie Informationen mit Ihrem Team einfach und schnell über digitale QM-Briefe. Keine Zettel mehr die in Ablagen verschwinden.
            </fb>
          </fb>
        </fb>
        <img className="theImage" src={mediManJpg} alt='tasks' />
      </fb>
    </fb>
  )
}
