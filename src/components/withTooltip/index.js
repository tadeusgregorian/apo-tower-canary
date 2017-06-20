import React from 'react'
import './styles.css'

export default ({pos, text, disabled, children}) => {
  return(
    disabled ?
      <fb className="theTooltip" >{children}</fb> :
      <fb className="theTooltip" data-balloon={text} data-balloon-pos={pos} >{children}</fb>
  )
}
