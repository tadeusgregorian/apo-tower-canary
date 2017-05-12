const functions = require('firebase-functions');
let Mailjet = require('node-mailjet').connect(
	'1017ade9d8cbc49b1dd919dad716ab36',
	'21f42711406b08417aa1a3a955284ce1'
)
// const zohoEmail = functions.config().zoho.email
// const zohoPassword = functions.config().zoho.pw

// const smtpConfig = {
// 	host: 'smtp.zoho.com',
// 	port: 465,
// 	secure: true, // use SSL
// 	auth: {
// 		user: 'tadeus.gregorian@apotower.de',
// 		pass: 'Davidof2'
// 	}
// }

//const mailTransport = nodemailer.createTransport(smtpConfig)

// const mailOptions = {
//     from: '"Apotower" <tadeus.gregorian@apotower.de>', // sender address (who sends)
//     to: 'tade.gregorian@gmail.com', // list of receivers (who receives)
//     subject: 'Hello Tade', // Subject line
//     text: 'Hello world Tade', // plaintext body
//     html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
// };

const fbPath = '/accounts/{accountID}/users/{userID}/adminPinStatus'
exports.handlePinEmailRequest = functions.database.ref(fbPath).onWrite(event => {
	console.log(event.data.val())
	//const rootRef = event.data.adminRef.root

	if(event.data.val() !== 'requested') return
  const accountID = event.params.accountID;
  const userID = event.params.userID;
	const mailRef = event.data.ref.parent.child('adminEmail')

	return mailRef.once('value').then(snap => {
		const mail = snap.val()
		//TODO: check if mail exists and is correct Mail format
		console.log(`user ${userID} on account: ${accountID} requested mail to ${mail}`);

		// return mailTransport.verify((error, success) => {
		// 	error ? console.log(error) : console.log('Server is ready to take our messages')
		// })

		// return mailTransport.sendMail(mailOptions).then((error, info) => {
		//   if(error) return console.log(error);
		//   console.log('Message sent: ' + info.response)
		// })

		// do this after email sending was successfull!
		// let changeDetails = {accountID, userID, type: 'adminPin'}
		// let updates = {}
		// updates['/configKeys/randonNum7d-8d7-d83'] = changeDetails
		// updates[`/accounts/${accountID}/users/${userID}/adminPinStatus`] = 'emailSent'
		// rootRef.update(updates)

		const sendEmail = Mailjet.post('send');

		const emailData = {
	    'FromEmail': 'tadeus.gregorian@apotower.de',
	    'FromName': 'Tadeus Gregorian',
	    'Subject': 'Test with the NodeJS Mailjet wrapper',
	    'Text-part': 'Hello NodeJs !',
	    'Recipients': [{'Email': 'tade.gregorian@gmail.com'}]
		}

		return sendEmail.request(emailData)
    	.then(event => console.log(event))
    	.catch(error => console.log(error))

	}).catch(e => console.log(e.message))
})
