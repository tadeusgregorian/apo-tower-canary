import React, { PureComponent } from 'react'
import { createNewAccountOnDB, createUserWithEmailAndPassword } from 'actions'
import { isValidEmail, Toast } from 'helpers'
import InputMinimal from 'components/inputMinimal'
import './styles.css'


export default class Registration extends PureComponent{
	constructor(props){
		super(props)
		this.state = {
			pharmacyName: '',
			email: '',
			password: ''
		}
	}

	regButtonClicked = () => {
		const { pharmacyName, email, password } = this.state
		let error = ''
		const emailInUse = 'Dise E-Mail Adresse ist bereits registriert.'

		if(!pharmacyName || !email || !password) 	error = error || 'Bitte füllen Sie alle Felder aus.'
		if(pharmacyName.length < 6 )							error = error || 'Der Name der Apotheke ist zu kurz.'
		if(password.length < 6 )									error = error || 'Das Passwort muss mindestens 6 Zeichen lang sein.'
		if(!isValidEmail(email)) 									error = error || 'Bitte geben Sie eine gültige E-Mail Adresse ein.'

		error ?
			Toast.warning(error) :
			createUserWithEmailAndPassword(email, password)
				.then(user => user && createNewAccountOnDB(user.uid, pharmacyName, email))
				.catch(e => e.code === 'auth/email-already-in-use' && Toast.warning(emailInUse))
	}

	render = () =>{
		return (
		<fb id='registrationMain'>
			<fb id='registrationHead'>Jetzt kostenlos registrieren!</fb>
			<fb className="subHeader">Dieses Angebot ist limitiert.</fb>
			<fb id='registrationBody'>
				{/* fake inputfileds to distract the autofill! */}
				<input type="text" style={{display: 'none'}} />
				<input type="password" style={{display: 'none'}} />
				<fb id='iWrapperPharmacyName' className='inputRegElement'>
					<InputMinimal
						onInputChange={(inp)=>this.setState({pharmacyName: inp})}
						icon='user'
						value={this.state.pharmacyName}
						defaultText='Name der Apotheke'/>
				</fb>
				<fb id='iWrapperPharmacyEmail' className='inputRegElement' data-balloon="Email-Adresse der Apotheke" data-balloon-pos="up">
					<InputMinimal
						onInputChange={(inp)=>this.setState({email: inp})}
						icon='email'
						value={this.state.email}
						defaultText='Email'/>
				</fb>
				<fb id='iWrapperPassword' className='inputRegElement' onKeyDown={(e) => e.keyCode === 13 && this.regButtonClicked()}>
					<InputMinimal
						onInputChange={(inp)=>this.setState({password: inp})}
						icon='lock'
						value={this.state.password}
						defaultText='Passwort'
						password={true} />
				</fb>
				<fb id='registrationSubmitButton' onClick={this.regButtonClicked}>Registrieren</fb>
			</fb>
		</fb>
	)
	}
}
