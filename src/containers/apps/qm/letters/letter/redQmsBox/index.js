import React from 'react'
import './styles.css'

export default ({redNum, totalNum}) => {

  return(
    <fb className='unredQmsBox'>
      {redNum + ' / ' + totalNum}
    </fb>
  )
}
