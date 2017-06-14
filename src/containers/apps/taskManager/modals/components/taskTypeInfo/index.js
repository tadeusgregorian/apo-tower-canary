import React from 'react'
import './styles.css'
import { getTypeAndPatternOfTask } from 'helpers';


export default ({task}) => {

	const taskTypeAndPattern = getTypeAndPatternOfTask(task);
  return(
    <fb className='modalTaskTypeInfo'>
      <icon style={{ alignItems: 'flex-start', paddingTop: '4px'}}className='icon-insert_invitation nop'/>
      <bo style={{ display: 'flex', flex: '0 0 auto'}}>{taskTypeAndPattern.type} </bo> {(taskTypeAndPattern.patternFullLength || taskTypeAndPattern.pattern)}
    </fb>
  )
}
