import FBInstance from '../../../firebaseInstance';

export * from './users'
export * from './branches'
export * from './groups'
export * from './qms'


export const saveToAccount = (accountID, path, data) => {
  const ref = FBInstance.database().ref('accounts/' + accountID + '/' + path)
  ref.set(data)
    .then(console.log('success'))
    .catch(e => console.log('something Wrong ?: ', e))
}
