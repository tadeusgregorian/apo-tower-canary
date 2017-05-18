
export const openConfirmPopup = (popupComponent) => {
	return { type: 'OPEN_CONFIRM_POPUP', payload:  popupComponent}
}

export const closeConfirmPopup = () => {
	return { type: 'CLOSE_CONFIRM_POPUP' }
}
