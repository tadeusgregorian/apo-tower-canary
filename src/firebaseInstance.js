import firebase from 'firebase';

let config;
console.log('REACT_APP_TARGET: ',process.env.REACT_APP_TARGET)

if (process.env.REACT_APP_TARGET === 'production' && process.env.NODE_ENV === 'production') {

	console.log('prod_DB')
	config = {
		apiKey: "AIzaSyDvrSSswvlUmB2hhrgQwA3407_KUPqcYXY",
    authDomain: "apotower-ed9eb.firebaseapp.com",
    databaseURL: "https://apotower-ed9eb.firebaseio.com",
    projectId: "apotower-ed9eb",
    storageBucket: "apotower-ed9eb.appspot.com",
    messagingSenderId: "1070970987025"
	}
} else {

	console.log("dev_DB")
	config = {
		apiKey: "AIzaSyCg4wdcZLYjOv9giDzGyE1wwwrdwSf1G28",
		authDomain: "apotowerdev.firebaseapp.com",
		databaseURL: "https://apotowerdev.firebaseio.com",
		projectId: "apotowerdev",
		storageBucket: "apotowerdev.appspot.com",
		messagingSenderId: "359455830469"
	}
}

const firebaseInstance = firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const Storage = firebaseInstance.storage();
export const serverTimestamp = firebase.database.ServerValue.TIMESTAMP

export default firebaseInstance;
