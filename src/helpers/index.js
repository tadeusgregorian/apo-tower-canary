import _ from 'lodash'
import moment from 'moment'

export * from './dataHelper'
export * from './GT_styles'
export * from './sounds'
export * from './databaseUpdates'
export * from './firebaseListeners'
export * from './databaseUpdate_qmLetters'

export function createGuid() {
	let d = new Date().getTime()
	if (window.performance && typeof window.performance.now === 'function') {
		d += performance.now()
	}
	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

export const createShortGuid = () => {
	let d = new Date().getTime()
	if (window.performance && typeof window.performance.now === 'function') {
		d += performance.now()
	}
	let uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
		let r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

export const shortenGuid = (longGuid) => {
	return (longGuid.substr(0, 8)+longGuid.substr(9, 4))
}

export const formatHourAndMinute = (hour, minute) => {
	let hourString = hour.toString();
	hourString = hourString.length == 1
		? '0' + hourString
		: hourString;
	if (typeof minute == "undefined") {
		return hourString + ":00"
	}
	let minuteString = minute.toString();
	minuteString = minuteString.length == 1
		? '0' + minuteString
		: minuteString;
	return hourString + ':' + minuteString;
}

export const wizardStepStatePropertyGenerator = (props, propertyName, defaultValue, forceBool = false) => {
	if (forceBool) {
		return !!props.subState[propertyName] || props.initData && !!props.initData[propertyName] || defaultValue
	} else {
		return props.subState[propertyName] || props.initData && props.initData[propertyName] || defaultValue
	}
}

export const wizardStepStateGenerator = (props, properties) => {
	const propertyNames = properties.map(p => p.name);
	const propertyValues = properties.map(p => wizardStepStatePropertyGenerator(props, p.name, (typeof p.defaultValue == "undefined"
		? false
		: p.defaultValue), p.forceBool || false));
	return _.zipObject(propertyNames, propertyValues);
}


export const darkenColor = (p, c0, c1) => {
	let n=p<0?p*-1:p; let u=Math.round; let w=parseInt;
	if(c0.length>7) {
	  let f=c0.split(","), t= (c1 ?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","), R=w(f[0].slice(4)), G=w(f[1]), B=w(f[2]);
	  return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
	}else{
		let f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
  	return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
	}
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
	const weekStr = String(week).length == 2 ? String(week) : '0'+week		// turn 7 into 07
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

export const doubleDigit = (num) => {
	return (String(num).length == 1) ? '0'+num : ''+num
}

export const minToTimeString = (min) => {
	if(!min) return '00:00'
	let minutes = doubleDigit(min % 60)
	let hours = doubleDigit(Math.floor(min/60))
	return hours+':'+minutes
}

export const 	timeStrToMin = (str) => {
	let hours = parseInt(str.substr(0, 2))
	let minutes = parseInt(str.substr(3, 2))
	return (hours * 60 + minutes)
}

export const getEmptyShiftWeekObj = () => {
	return { days: { mon: {number: 1}, tue: {number: 2}, wed: {number: 3}, thu: {number: 4}, fri: {number: 5}, sat: {number: 6}, sun: {number: 7} } }
}

export const getTotalWorkMinutesInWeek = (shiftDays, vacationDays, hoursPerWeek) => { // vacationDays and hoursPerWeek are optional
	// shiftDays format: {0: {shift: shiftObj }, 4: {shfit: shiftObj}}
	const minutesPerDay = hoursPerWeek && hoursPerWeek * 60 / 6
	const shiftMinutesArray = []

	for(let i=0; i<7; i++) {
		if(vacationDays && vacationDays.includes(i)) {
			shiftMinutesArray.push(minutesPerDay) // if user is on vacation add minutes per day to worked time, neglecting what he would have worked or not worked that day!
			continue
		}
		const shiftDay = shiftDays && shiftDays[i]
		if (shiftDay && shiftDay.shift) {
			const s = shiftDay.shift
			if(!_.isEmpty(s)) {
				if(isNaN(s.endTime - s.startTime - s.break)) continue // this might be the case if user is editing a shift. then shiftObj just contains shfitEdit and no times.
				shiftMinutesArray.push(s.endTime - s.startTime - s.break)
			}
		}
	}
	return(shiftMinutesArray.reduce((a, b) => a + b, 0))
}

export const shiftDaysToString = (shiftDays) => {
	let shiftsInMinutes = ''
	if(!shiftDays) return null
	for(let i=0; i<7; i++) {
		if(shiftDays[i] && shiftDays[i].shift) {
			const s = shiftDays[i].shift
			let shiftDuration = s.endTime - s.startTime - s.break
			if(isNaN(shiftDuration)) shiftDuration = '0'  // this might be the case if user is editing a shift. then shiftObj just contains shfitEdit and no times.
			shiftsInMinutes += shiftDuration
		}else{
			shiftsInMinutes += '0'
		}
		if(i < 6) { shiftsInMinutes += '-' }
	}
	return shiftsInMinutes
}

export const stringToShiftDays = (sDString) => {
	if(!sDString) return {}
	const shiftDays = {}
	const sDArray = sDString.split('-')
	sDArray.forEach((min, i)=> { if(min != '0') { shiftDays[i] = parseInt(min) }})
	return shiftDays
}

export const intervalsOverlap = (start1, end1, start2, end2) => {
	if(start1 > start2) return (end2 - start1) >= 0
	if(start1 < start2) return (end1 - start2) >= 0
	if(start1 == start2) return true
}

export const isNum = (input) => {
	return !isNaN(parseInt(input))
}

export const shortISOToSmartDate = (shortISO) => {
	const shortISOString = String(shortISO)
	const smartString =  shortISOString.substr(0, 4) + shortISOString.substr(5, 2) + shortISOString.substr(8, 2)
	return parseInt(smartString)
}

export const toSmartDate = (isoDate) => {
	const momentDate = moment(isoDate)
	const year = momentDate.year()
	const month = momentDate.month()+1 // we add 1 because moment counts months from 0 - 11
	const day = momentDate.date()
	const smartDate_str = year+doubleDigit(month)+doubleDigit(day)
	return parseInt(smartDate_str)
}

export const smartDateToIso = (smartDate) => {
	const momentDate = moment(smartDate, 'YYYYMMDD')
	return momentDate.toDate().toISOString()
}

export const addDays = (smartDate, days) => {
	const momentDate = moment(smartDate, 'YYYYMMDD')
	const momentNextDay = momentDate.add(days, 'day')
	return parseInt(momentNextDay.format('YYYYMMDD'))
}

export const subtractDays = (smartDate, days) => {
	const momentDate = moment(smartDate, 'YYYYMMDD')
	const momentNextDay = momentDate.subtract(days, 'day')
	return parseInt(momentNextDay.format('YYYYMMDD'))
}

export const getLastOfDates = (datesArr) => {
	let unixDatesArr = datesArr.map(d => moment(d).unix())
	let filteredArr = unixDatesArr.sort((a, b)=> a < b)
	return moment(filteredArr[0], 'X').toDate()
}

export const smartYear = (smartDate) => {
	return parseInt(String(smartDate).substr(0, 4))
}

export const smartMonth = (smartDate) => {
	return parseInt(String(smartDate).substr(4, 2))
}

export const smartDay = (smartDate) => {
	return parseInt(String(smartDate).substr(6, 2))
}

export const getTodaySmart = () => {
	return parseInt(moment().format('YYYYMMDD'))
}

export const getYesterdaySmart = () => {
	return parseInt(moment().subtract(1, 'day').format('YYYYMMDD'))
}

export const deletePropAndReturnObj = (obj, prop) => {
	const obj_copy = { ...obj }
	delete obj_copy[prop]
	return obj_copy
}

export const stringIncludes = (target, searchTerm) => {
	return target.toLowerCase().includes(searchTerm.toLowerCase())
}
