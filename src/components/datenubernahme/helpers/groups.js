import FBInstance from '../../../firebaseInstance'

export const getOldGroups = () => {
  const ref = FBInstance.database().ref('groups')
  return ref.once('value').then(snap => snap.val())
}
