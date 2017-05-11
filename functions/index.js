const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const fbPath = '/accounts/{accountID}/users/{userID}'

exports.makeUppercase = functions.database.ref(fbPath).orderByChild('adminPinStatus').equalTo('requested')
    .on('child_added', event => {
      const user = event.data.val();
      console.log(user);

      return event.data.ref.parent.child('uppercase').set(uppercase);
    });
