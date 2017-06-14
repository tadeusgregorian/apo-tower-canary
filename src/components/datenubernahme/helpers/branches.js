import FBInstance from '../../../firebaseInstance'

export const getOldBranches = () => {
  const ref = FBInstance.database().ref('oldData/branches')
  return ref.once('value').then(snap => snap.val())
}
