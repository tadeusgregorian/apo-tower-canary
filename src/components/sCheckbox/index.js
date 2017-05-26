import React from 'react'
import './styles.css'

export default ({onCheck, isChecked, label}) => {

  return(
    <fb className="sCheckboxMain">
      <fb className="theBox" onClick={onCheck}>
          <input // not puting onChange here cause it was not working at all -> onClick up there solves it
            checked={isChecked}
            type="checkbox"
            className="tadeCheckbox" />
            <label></label>
        </fb>
        <fb className="theLabel">
          {label}
        </fb>
    </fb>
  )
}
