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
    const tomorrow      = moment().add(1, 'days').format('YYYYMMDD')
    const vacDate       = this.props.users.find(u => u.ID === userID).onVacation
    const vacDateInPast = vacDate < today

    return(
      <fb className="vacationMain">
        <fb className="headline">
          <fb className="text">{`Ich bin abwesend ${vacDateInPast ? 'seit' : 'ab'}`}</fb>
          <fb className="vacactionDate">{vacDate && this.formatDate(vacDate)}</fb>
        </fb>

        <fb className="vacationStartButtons">
          <SButton label='HEUTE'  onClick={() => setUserVacation(userID, today)}/>
          <SButton label='MORGEN' onClick={() => setUserVacation(userID, tomorrow)}/>
          <SButton label='DATUM WÄHLEN' onClick={() => this.refs.vacationDP.openDialog()}/>
        </fb>

        <fb className="vacationEndButton">
          {/* <SButton label='HEUTE'  onClick={() => setUserVacation(userID, null)}/> */}
        </fb>
        <DatePicker style={{"display": "none"}}
          ref='vacationDP'
          onChange={(e, d) => setUserVacation(userID, moment(d).format('YYYYMMDD'))}
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
