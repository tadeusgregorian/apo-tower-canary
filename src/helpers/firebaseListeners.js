
//blocks the initial childAdded Events until we reach the number of children loaded by the once(value) event
export const blockInit = (childrenCount, callback) => {
	let childrenAdded = 0
	return (snap) => {
		if(++childrenAdded <= childrenCount) return
		callback(snap)
	}
}
