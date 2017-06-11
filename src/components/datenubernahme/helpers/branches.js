import FBInstance from '../../../firebaseInstance'

export const getOldBranches = () => {
  const ref = FBInstance.database().ref('branches')
  return ref.once('value').then(snap => snap.val())
}
