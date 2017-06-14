import FBInstance from '../../../firebaseInstance';

export * from './users'
export * from './branches'
export * from './groups'
export * from './qms'
export * from './tasks'
export * from './checked'


export const saveToAccount = (accountID, path, data) => {
  const ref = FBInstance.database().ref('accounts/' + accountID + '/' + path)
  ref.set(data)
    .then(console.log('success'))
    .catch(e => console.log('something Wrong ?: ', e))
}

export const dumbToSmart = (_dDate, caller) => {
  let dDate = _dDate
  _dDate.length === 24 && (dDate = _dDate.slice(0,10)) // there have been a lots of tasks with isoDates instead of dumbDates in the db ( we cutt off the dumb date out of the iso date here)
  if(_dDate === '29082016') return 20160829
  if(_dDate === '01082016') return 20160801
  if(_dDate === '11082016') return 20160811
  if(_dDate === '18082016') return 20160818
  if(!dDate || dDate.length !== 10) console.log(dDate, caller) //throw new Error('dumbdate wrong: ' + dDate)


  const sDateString = dDate.slice(0,4) + dDate.slice(5,7) + dDate.slice(8)
  return parseInt(sDateString, 10)
}
