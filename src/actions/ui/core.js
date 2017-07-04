export const setSelectedUser          = (userID) => ({type: 'SET_SELECTED_USER', payload: userID})
export const removeSelectedUser       = (userID) => ({type: 'REMOVE_SELECTED_USER'})

export const logAdminIn               = (adminID) => 	({type: 'ADMIN_LOGGED_IN', payload: adminID})

export const closeAdminPinDialog      =	() => ({type: 'CLOSE_ADMIN_PIN_DIALOG'})
export const openAdminPinDialog       =	(mode) => ({type: 'OPEN_ADMIN_PIN_DIALOG', payload: mode})

export const openSelectbranchDialog   = () => ({type: 'OPEN_SELECT_BRANCH_DIALOG'})
export const closeSelectbranchDialog  = () =>	({type: 'CLOSE_SELECT_BRANCH_DIALOG'})

export const closeConfirmPopup        =	() => ({type: 'CLOSE_CONFIRM_POPUP'})
