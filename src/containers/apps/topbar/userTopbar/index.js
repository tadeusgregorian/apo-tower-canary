import React, { PureComponent } from 'react'
import SubBar from './subBar'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import './styles.css'

class UserTopbar extends PureComponent{

  pathIncludes = (path) => (this.props.location.pathname.includes(path))

  taskManagerSubRoutes = [
    { label: 'Kalender', path: '/Apps/TaskManager/Kalender'},
    { label: 'Editor', path: '/Apps/TaskManager/Editor'},
  ]

  render(){
    const { removeSelectedUser, users, selectedUser } = this.props
    const user = users.find(u => u.ID === selectedUser)
    return(
      <fb className="userTopbarWrapper">
        <fb className='userTopbar' style={{backgroundColor: user.color}}>
          <fb className="center">
            <fb className='navigation'>
              <Link to='/Apps/TaskManager'>
                <fb className='backButtonWrapper'>
                  <icon onClick={removeSelectedUser} className="backButton icon-arrow-left2"/>
                </fb>
              </Link>
              <Link to={`/Apps/TaskManager/Kalender/${user.ID}`}>
                <fb className="topbarButton topbarTasksButton">
                  <icon className="icon icon-stack2 no-border"></icon>
                  <fb className="topbarButtonLabel">AUFGABEN</fb>
                </fb>
              </Link>
              <Link to={`/Apps/QM/${user.ID}`}>
                <fb className="topbarButton topbarQmsButton">
                  <icon className="icon icon-mail no-border"></icon>
                  <fb className="topbarButtonLabel">ANSAGEN</fb>
                </fb>
              </Link>
              <Link to={'/Apps/Adminpanel'}>
                <fb className="topbarButton topbarAdminpanelButton">
                  <icon className="icon icon-params no-border"></icon>
                  <fb className="topbarButtonLabel">EINSTELLUNGEN</fb>
                </fb>
              </Link>
            </fb>
            <fb className='userInfo'>
              <fb className="userName">{user.name}</fb>
              <fb className="userIcon"><icon className="icon-account_circle"/></fb>
            </fb>
          </fb>
        </fb>
      { this.pathIncludes('TaskManager') && <SubBar subRoutes={this.taskManagerSubRoutes} bgColor={user.color}/> }
    </fb>
    )
  }
}

const mapStateToProps = (state) => ({
	selectedUser: state.core.selectedUser,
  users: state.data.users
})

const mapDispatchToProps = (dispatch) => ({
		removeSelectedUser: () => dispatch({type: 'REMOVE_SELECTED_USER'})

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserTopbar))
