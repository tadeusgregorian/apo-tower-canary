import firebase from 'firebase';

let config;

if (process.env.NODE_ENV === 'production') {
	// Production config (STERSEMANN + ANDREAS DB)
	// console.log("YOU are working with the produciton database - be cautious!");
	// config = {
	// 	apiKey: 'AIzaSyBwOP-NqDRYCw59ZdMlKAHK53sEnjG_l6s',
	// 	authDomain: 'apochecklist2.firebaseapp.com',
	// 	databaseURL: 'https://apochecklist2.firebaseio.com',
	// 	storageBucket: 'apochecklist2.appspot.com'
	// };
	console.log('DEMO DATABASE')
	config = {
	    apiKey: "AIzaSyCRAE8D33cStZVlM_uGLKptrPA8EaCZC-w",
	    authDomain: "apochecklistdemo.firebaseapp.com",
	    databaseURL: "https://apochecklistdemo.firebaseio.com",
	    storageBucket: "apochecklistdemo.appspot.com",
	};
} else {
	// Development config (Demo DB)
	console.log("demo database - EVERYTHING FINE");
	config = {
		apiKey: "AIzaSyCRAE8D33cStZVlM_uGLKptrPA8EaCZC-w",
		authDomain: "apochecklistdemo.firebaseapp.com",
		databaseURL: "https://apochecklistdemo.firebaseio.com",
		storageBucket: "apochecklistdemo.appspot.com"
	};
	// config = {
	//     apiKey: 'AIzaSyBwOP-NqDRYCw59ZdMlKAHK53sEnjG_l6s',
	//     authDomain: 'apochecklist2.firebaseapp.com',
	//     databaseURL: 'https://apochecklist2.firebaseio.com',
	//     storageBucket: 'apochecklist2.appspot.com'
	// };
}

const firebaseInstance = firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const Storage = firebaseInstance.storage();

export default firebaseInstance;
