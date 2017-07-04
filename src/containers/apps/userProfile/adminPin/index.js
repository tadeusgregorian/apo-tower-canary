import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import SButton from 'components/sButton'
import { openAdminPinDialog } from 'actions/ui/core'
import './styles.css'


const AdminPin = (props) => {

  return(
    <fb className="adminPinConfigMain">
      <fb className="headline">
        <fb className="icon icon-lock3 lockIcon"></fb>
        <fb>Admin PIN</fb>
      </fb>
      <fb className="content">
        <SButton
          label='PIN Ändern'
          onClick={() => props.openAdminPinDialog('editing')}
        />
      </fb>
    </fb>
  )
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		openAdminPinDialog,
	}, dispatch)
}

export default connect(null, mapDispatchToProps)(AdminPin)
