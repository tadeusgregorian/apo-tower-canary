import { combineReducers } from 'redux'
import { createFirebaseReducer_simple, createDataStatusReducer } from './reducerHelpers'

const data	       = createFirebaseReducer_simple('accountDetails')
const dataStatus   = createDataStatusReducer('accountDetails')

export default combineReducers({
  data,
  dataStatus
})
