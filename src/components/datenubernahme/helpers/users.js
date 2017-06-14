import FBInstance from '../../../firebaseInstance'
import _ from 'lodash'

export const userIDTranslator = {
  '4e9a9d17-6099-47ce-bb73-afb829d5b18c': 'u001',
  '17ea0649-b563-425c-85f9-de04d93ac49a': 'u002',
  '39cde6fd-5d02-463d-9192-e061aa34cf30': 'u003',
  '3b5828b7-aaed-478a-b2f7-40ac35abc2eb': 'u004',
  '080ed8da-a609-4314-a7e8-19c9c1a55e86': 'u005',
  '5d2e9a83-5b8a-48c8-bc46-0e240467de22': 'u006',
  '61510760-8eeb-4006-abdd-582f0db1d802': 'u007',
  '63e33292-ee38-4236-8286-02a104bb61bb': 'u008',
  '77f75e08-84f9-4d50-9be3-06d94c5fbf57': 'u009',
  '7909b923-6016-48ca-bd26-f199af8c747c': 'u010',
  '9f794c9a-2a6f-4a6c-b182-8fe12d43050b': 'u011',
  'a2657b10-c812-4028-acbc-6a22e1aaa331': 'u012',
  'b8f4c336-7c36-47c1-8bcd-5ea22cf52653': 'u013',
  'bdb6cbb1-846f-4293-84de-8f08d5e156a8': 'u014',
  'cbb8bb6f-1bd6-497d-81f8-252c448706fe': 'u015',
  'd6ec68ca-5406-4539-a038-1f0b8748ab43': 'u016',
  'dc44cecb-dcb6-42c2-9b59-90896f670c92': 'u017',
}

export const getOldUsers = () => {
  const ref = FBInstance.database().ref('oldData/users')
  return ref.once('value').then(snap => snap.val())
}

export const refreshUsers = (_oldUsers, _oldBranches, _oldGroups) => {
  let newUsers = {}

  _.values(_oldUsers).forEach(u => {
    let branches = {}
    let assignedGroups = {}

    _.keys(u.branches).forEach(bID => branches[bID] = '1')
    _.keys(u.assignedGroups).forEach(gID => assignedGroups[gID] = '1')

    const ID = userIDTranslator[u.ID]
    const name = u.name
    const nameInitials = u.nameInitials
    const color = u.color
    const isAdmin = u.isAdmin || null

    newUsers[ID] =  {ID, name, nameInitials, color, branches, assignedGroups, isAdmin}
  })

  return newUsers
}
