import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import { logoutFromFirebase } from 'actions'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import './styles.css'

class PublicTopbar extends PureComponent{
  constructor(props) {
    super(props)

    this.state = {
      popoverOpen: false,
      settingsButton: null
    }
  }

  openPopover = (e) => {
    e.preventDefault();
    this.setState({popoverOpen: true, settingsButton: e.currentTarget})
  }

  logoutAndReload = () => {
    logoutFromFirebase()
    window.location = '/'
  }

  render(){
    const {selectedBranch, branches} = this.props
		const selectedBranchObj = branches.find(b => b.ID === selectedBranch)
		const selectedBranchName = selectedBranchObj ? selectedBranchObj.name : ''

		return (
			<fb className="publicTopbar">
          <fb className='leftSide'>
            <icon className="icon icon-arrow_drop_down" />
            {/* <fb className="apotheken_a"></fb> */}
            <fb className="text">{selectedBranchName}</fb>
          </fb>
          <fb className='rightSide'>
            <fb className='moreOptions' onClick={this.openPopover}>
              <icon className='icon-dehaze'/>
            </fb>
            <Popover
              open={this.state.popoverOpen}
              anchorEl={this.state.settingsButton}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
              onRequestClose={() => this.setState({popoverOpen: false})}>
              <Menu>
                {this.props.branches.length > 1 &&
                <MenuItem primaryText="Filliale wechseln" onClick={() => {
                  this.props.openSelectbranchDialog()
                  this.setState({popoverOpen: false})
                }}/>}
                <MenuItem primaryText="Abmelden" onClick={this.logoutAndReload}/>
              </Menu>
            </Popover>
          </fb>
			</fb>
		)
  }
}

const mapStateToProps = (state) => ({
	branches: state.data.branches,
	selectedBranch: state.core.selectedBranch
})

const mapDispatchToProps = (dispatch) => (
	bindActionCreators({
		openSelectbranchDialog: () => ({type: 'OPEN_SELECT_BRANCH_DIALOG'})
	}, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(PublicTopbar)
