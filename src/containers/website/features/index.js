import React from 'react'
import './styles.css'
import Testimony from './testimony'
import TasksFeature from './tasksFeature'
import QmFeature from './qmFeature'

export default () => {

  return(
    <fb className="featuresMain">
      <Testimony />
      <QmFeature />
      <TasksFeature />
    </fb>
  )
}
