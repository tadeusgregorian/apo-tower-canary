import FBInstance from '../../../firebaseInstance'
import { userIDTranslator } from './users'
import moment from 'moment'
import _ from 'lodash'

export const getOldQms = () => {
  const ref = FBInstance.database().ref('oldData/qmList')
  return ref.once('value').then(snap => snap.val())
}

const isValidQm = ({ID, subject, creatorID, date, files}) => {
  let error = ''

  if(!ID || !ID.length || ID.length < 10)   error = 'ID is wrong: ' + ID
  if(!subject)                              error = 'subject wrong: ' + subject
  if(!creatorID)                            error = 'creatorID wrong: ' + creatorID
  if(!date)                                 error = 'date wrong: ' + date
  if(files && !Array.isArray(files))        error = 'fiels wrong: ' + files

  return !error
}

export const refreshQms = (_oldQms) => {
  let newQms = {}

  _.values(_oldQms).forEach(qm => {
    let assignedUsers = {}

    _.keys(qm.assignedUsers).forEach(uID => assignedUsers[userIDTranslator[uID]] = 1)
    _.keys(qm.usersRed).forEach(uID => qm.assignedUsers[uID] && (assignedUsers[userIDTranslator[uID]] = 2))

    const ID        = qm.ID
    const subject   = qm.subject
    const text      = qm.text
    const creatorID = userIDTranslator[qm.creatorID]
    const date      = moment(qm.date).unix() // converting it here to unix seconds !
    const isUrgent  = qm.isUrgent || null
    const files     = qm.files || null

    const newQm = {ID, subject, text, creatorID, date, isUrgent, assignedUsers, files}
    if(!isValidQm(newQm)) console.log('something')
    newQms[ID] = newQm
  })

  return newQms
}
