import _ from 'lodash'
import moment from 'moment'

export * from './dataHelper'
export * from './databaseUpdates'
export * from './databaseUpdate_qmLetters'
export * from './iziToast'
export * from './newDayChecker'

export function createGuid() {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	const x1 = possible.charAt(Math.floor(Math.random() * possible.length))
	const x2 = possible.charAt(Math.floor(Math.random() * possible.length))
	const x4 = possible.charAt(Math.floor(Math.random() * possible.length))
	const x5 = possible.charAt(Math.floor(Math.random() * possible.length))
	const unix = moment().format('X')
	let d = new Date().getTime()
	if (window.performance && typeof window.performance.now === 'function') {
		d += performance.now()
	}
	let uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
		let r = (d + Math.random() * 16) % 16 | 0
		// eslint-disable-next-line
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
	});
	return unix + uuid + x1 + x2 + x4 + x5;
}

export const createShortGuid = () => {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	const x1 = possible.charAt(Math.floor(Math.random() * possible.length))
	const x2 = possible.charAt(Math.floor(Math.random() * possible.length))
	const unix = moment().format('X')
	let d = new Date().getTime()
	if (window.performance && typeof window.performance.now === 'function') {
		d += performance.now()
	}
	let uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
		let r = (d + Math.random() * 16) % 16 | 0
		// eslint-disable-next-line
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
	});
	return unix + uuid + x1 + x2;
}

export const shortenGuid = (longGuid) => {
	return (longGuid.substr(0, 8)+longGuid.substr(9, 4))
}

export const isNumber = (inp) =>  { return !isNaN(parseFloat(inp)) }

export const formatHourAndMinute = (hour, minute) => {
	let hourString = hour.toString();
	hourString = hourString.length===1
		? '0' + hourString
		: hourString;
	if (typeof minute==="undefined") {
		return hourString + ":00"
	}
	let minuteString = minute.toString();
	minuteString = minuteString.length===1
		? '0' + minuteString
		: minuteString;
	return hourString + ':' + minuteString;
}

export const downloadFile = (fileURL, fileName) => {
	// for non-IE
	if (!window.ActiveXObject) {
		let save = document.createElement('a');
		save.href = fileURL;
		save.target = '_blank';
		if (typeof save.download === 'string') {
			save.download = fileName || 'unknown';
			try {
				let evt = new MouseEvent('click', {
					'view': window,
					'bubbles': true,
					'cancelable': false
				});
				save.dispatchEvent(evt);
				(window.URL || window.webkitURL).revokeObjectURL(save.href);
			} catch (e) {
				window.open(fileURL, fileName);
			}
		} else {
			//Creating new link node.
			let link = document.createElement('a');
			link.href = fileURL;

			//Dispatching click event.
			if (document.createEvent) {
				let e = document.createEvent('MouseEvents');
				e.initEvent('click', true, true);
				link.dispatchEvent(e);
				return true;
			}
			window.open(fileURL,  '_self');
		}
	}

		// for IE < 11
		else if (!!window.ActiveXObject && document.execCommand) {
				let _window = window.open(fileURL, '_blank');
				_window.document.close();
				_window.document.execCommand('SaveAs', true, fileName || fileURL)
				_window.close();
		}
}

export const yearAndWeekToWeekID = (year, week) => {
	const weekStr = String(week).length===2 ? String(week) : '0'+week		// turn 7 into 07
	return year + weekStr // the format is 201643 , for year: 2016 and week 43
}

export const dayNumToStr = (num) => {
	const dayStrArr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
	return dayStrArr[num-1]
}

export const shallowEqual = (a, b) => {
	if(!a && !b) return true
	if(!a || !b) return false
	for(let key in a) { if(a[key] !== b[key]) return false }
	for(let key in b) { if(a[key] !== b[key]) return false }
	return true
}

export const whatsDifferent = (a, b) => {
	let diff = []
	for(let key in b) { if(a[key] !== b[key]) diff.push(key)}
	for(let key in a) { if(a[key] !== b[key]) diff.push(key)}
	return _.uniq(diff)
}

export const doubleDigit = (num) => {
	return (String(num).length===1) ? '0'+num : ''+num
}

export const isNum = (input) => {
	return !isNaN(parseInt(input, 10))
}

export const shortISOToSmartDate = (shortISO) => {
	const shortISOString = String(shortISO)
	const smartString =  shortISOString.substr(0, 4) + shortISOString.substr(5, 2) + shortISOString.substr(8, 2)
	return parseInt(smartString, 10)
}

export const toSmartDate = (isoDate) => {
	const momentDate = moment(isoDate)
	const year = momentDate.year()
	const month = momentDate.month()+1 // we add 1 because moment counts months from 0 - 11
	const day = momentDate.date()
	const smartDate_str = year+doubleDigit(month)+doubleDigit(day)
	return parseInt(smartDate_str, 10)
}

export const smartDateToIso = (smartDate) => {
	const momentDate = moment(smartDate, 'YYYYMMDD')
	return momentDate.toDate().toISOString()
}

export const addDays = (smartDate, days) => {
	const momentDate = moment(smartDate, 'YYYYMMDD')
	const momentNextDay = momentDate.add(days, 'day')
	return parseInt(momentNextDay.format('YYYYMMDD'), 10)
}

export const subtractDays = (smartDate, days) => {
	const momentDate = moment(smartDate, 'YYYYMMDD')
	const momentNextDay = momentDate.subtract(days, 'day')
	return parseInt(momentNextDay.format('YYYYMMDD'), 10)
}

export const getLastOfDates = (datesArr) => {
	let unixDatesArr = datesArr.map(d => moment(d).unix())
	let filteredArr = unixDatesArr.sort((a, b)=> a < b)
	return moment(filteredArr[0], 'X').toDate()
}

export const smartYear = (smartDate) => {
	return parseInt(String(smartDate).substr(0, 4), 10)
}

export const smartMonth = (smartDate) => {
	return parseInt(String(smartDate).substr(4, 2), 10)
}

export const smartDay = (smartDate) => {
	return parseInt(String(smartDate).substr(6, 2), 10)
}

export const getTodaySmart = () => {
	return parseInt(moment().format('YYYYMMDD'), 10)
}

export const getYesterdaySmart = () => {
	return parseInt(moment().subtract(1, 'day').format('YYYYMMDD'), 10)
}

export const smartDatesDiff = (startDate, endDate) => {
	if(startDate > endDate) throw new Error('FirstDate is bigger then lastDate: ', startDate, endDate)
	return moment(endDate, 'YYYYMMDD').diff(moment(startDate, 'YYYYMMDD'), 'days')
}

export const deletePropAndReturnObj = (obj, prop) => {
	const obj_copy = { ...obj }
	delete obj_copy[prop]
	return obj_copy
}

export const stringIncludes = (target, searchTerm) => {
	return target.toLowerCase().includes(searchTerm.toLowerCase())
}

export const getSmartDayRange = (firstDate, lastDate) => {
	if(!Number.isInteger(firstDate) || !Number.isInteger(lastDate)) throw new Error('dates need to be numbers!')
	if(firstDate === lastDate) return [firstDate]
	let range = []
	let currentDate = firstDate
	let diff = smartDatesDiff(firstDate, lastDate)
	for(var i = 0; i <= diff; i++){
		range.push(currentDate)
		currentDate = addDays(currentDate, 1)
	}
	return range
}

export const replaceDotsWithCommas = (str) => str.replace(/\./g, ',')

export const isValidEmail = (email) => {
	// eslint-disable-next-line
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
