import React from 'react'
import './styles.css'
import { getTypeAndPatternOfTask } from 'helpers';


export default ({task}) => {

	const taskTypeAndPattern = getTypeAndPatternOfTask(task);
  return(
    <fb className='modalTaskTypeInfo'>
      <icon className='icon-insert_invitation nop'/>
      <bo>{taskTypeAndPattern.type} </bo> {(taskTypeAndPattern.patternFullLength || taskTypeAndPattern.pattern)}
    </fb>
  )
}
