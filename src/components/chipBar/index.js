import React from 'react'
import cN from 'classnames';
import _ from 'lodash';
import './styles.css'

export default ({chips, selectedChips, chipClicked}) => {

  return(
    <fb className="chipBarMain">
      {chips.map(g => {
        let isSelected = (selectedChips.indexOf(g.ID) >= 0)
        return (
          <fb
            key={g.ID}
            className={cN({"chip": true, "selected": isSelected})}
            onClick={() => chipClicked(g.ID)}>
            {g.name}
          </fb>
        )
      })}
    </fb>
  )
}
