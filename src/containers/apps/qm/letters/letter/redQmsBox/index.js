import React from 'react'
import WithTooltip from 'components/withTooltip'
import './styles.css'

export default ({redNum, totalNum}) => {

  return(
    <WithTooltip text={redNum + ' von ' + totalNum + ' haben diesen QM-Brief gelesen.'} pos='left'>
      <fb className='unredQmsBox'>
        {redNum + ' / ' + totalNum}
      </fb>
    </WithTooltip>
  )
}
