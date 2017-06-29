import React, { PureComponent } from 'react'
import firebaseInstance from '../../../firebaseInstance'
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import {signInWithEmailAndPassword} from 'actions'
import cn from 'classnames'
import _ from 'lodash'
import './styles.css'

export default class AdminLogin extends PureComponent{
  constructor(props){
    super(props)

    this.state = {
      accountsLoaded: false,
      accounts: [],
      pw: '',
      selectedAccount: ''
    }
  }

  async componentDidMount (){
    const accountsRef = firebaseInstance.database().ref('accountEmails')
    const accounts = await accountsRef.once('value').then(snap => {
      const accountsObj = snap.val()
      const accountsArr = _.keys(snap.val()).map(email => ({ID: [accountsObj[email]],  email: email }))
      return accountsArr
    })
    this.setState({accountsLoaded: true, accounts})
  }

  enterAsAdmin = () => {
    signInWithEmailAndPassword('admin@apotower.de', this.state.pw).then(() => {
      window.godmode = true
      window.targetAccount = this.state.selectedAccount
    }).catch((e) => console.log(e.message))
  }

  render(){
  return(
      <fb className="adminLoginMain">
        <fb className="pwInputWrapper">
          <InputMinimal onInputChange={(inp) => this.setState({pw: inp})} value={this.state.pw} password />
          <fb className="enterButton">
            <SButton
              label='enter'
              color='#2ecc71'
              disabled={!this.state.selectedAccount}
              onClick={this.enterAsAdmin}
              sStyle={{height: '38px', marginTop: '2px'}}/>
          </fb>
        </fb>
        <fb className="accountsList">
          {this.state.accounts.map(account =>
            <fb
              key={account.ID}
              className={cn({accountItem: true, selected: account.ID === this.state.selectedAccount})}
              onClick={() => this.setState({selectedAccount: account.ID})}
              >{account.email}</fb>
          )}
        </fb>
      </fb>
    )
  }
}
