import FBInstance from '../../../firebaseInstance'

export const getOldGroups = () => {
  const ref = FBInstance.database().ref('oldData/groups')
  return ref.once('value').then(snap => snap.val())
}
