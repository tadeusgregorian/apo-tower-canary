import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {setUserVacation} from 'actions'
import SButton from 'components/sButton'
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment'
import './styles.css'

class Vacation extends PureComponent{

  formatDate = (smartDate) => moment(smartDate, 'YYYYMMDD').format('DD.MM.YYYY')


  render(){
    const userID        = this.props.selectedUser
    const today         = moment().format('YYYYMMDD')
    const vacDate       = this.props.users.find(u => u.ID === userID).onVacation
    const onVacNow      = vacDate && vacDate <= today
    const vacDateInPast = vacDate && vacDate < today

    const vacIcon = onVacNow ? 'icon-aircraft' : 'icon-perm_contact_calendar'

    return(
      <fb className="vacationMain">
        <fb className="presentInfo">
          <fb className={`icon ${vacIcon}`}></fb>
          <fb>{`Du bist ${onVacNow ? 'zurzeit abwesend' : 'anwesend'}.`}</fb>
          {onVacNow && <SButton label='Abwesenheit beenden'  onClick={() => setUserVacation(userID, null)}/>}
        </fb>
        <fb className="vacationInfo">
          {vacDate ?
            <fb className="vacationExistsRow">
              <fb className="icon icon-navigate_next iconMinimalRight"></fb>
              <fb className="text">{vacDateInPast ? 'Abwesend seit dem' : 'Abwesenheit beginnt am'}</fb>
              <fb className="vacactionDate">{vacDate && this.formatDate(vacDate)}</fb>
              {!onVacNow && <fb className="icon icon-pencil"  onClick={() => this.refs.vacationDP.openDialog()}></fb>}
              {!onVacNow && <fb className="icon icon-cross"   onClick={() => setUserVacation(userID, null)}></fb>}
            </fb> :
            <fb className="vacationEmptyRow">
              <SButton label='+ Abwesenheit eintragen' onClick={() => this.refs.vacationDP.openDialog()}/>
            </fb>
          }
        </fb>

        <DatePicker style={{"display": "none"}}
          ref='vacationDP'
          onChange={(e, d) => setUserVacation(userID, parseInt(moment(d).format('YYYYMMDD'),10))}
          floatingLabelText="asd"
          cancelLabel="Abbrechen"
          DateTimeFormat={window.DateTimeFormat}
          locale="de-DE"/>
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  selectedUser: state.core.selectedUser,
  users: state.data.users,
})



const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({

  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Vacation)
