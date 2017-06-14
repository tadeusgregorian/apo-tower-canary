import React, {PureComponent} from 'react';
import _ from 'lodash';

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import './styles.css'

export default class FilterBar extends PureComponent {

	render() {
		const users = this.props.users
		const creatorMenuItems = users.map(u => <MenuItem key={u.ID} value={u.ID} primaryText={u.name} />)
		creatorMenuItems.unshift(<MenuItem key={"keinFilter"} value={"none"} primaryText={'Kein Filter'} />)
		const assignedUserMenuItems = users.map(u => <MenuItem key={u.ID} value={u.ID} primaryText={u.name} />)
		assignedUserMenuItems.unshift(<MenuItem key={"test"} value={"none"} primaryText={'Kein Filter'} />)

		let selectedCreatorUser =  users.find(u => u.ID===this.props.filterCreator)
		let selectedAssignedUser = users.find(u => u.ID===this.props.filterAssignedUser)

		return(
			<fb className="searchFilterBar">
				<fb className="creatorFilterWrapper selectFieldWrapper">
					<SelectField
						value={this.props.filterCreator}
						onChange={(event, index, value) => this.props.changeFilter({filterCreator: value})}
						floatingLabelText="Ersteller"
						underlineStyle={{ borderColor: "rgba(0,0,0,0.15)"}}
						iconStyle={{fill: "rgba(0,0,0,0.15)"}}
						floatingLabelStyle={{color: 'grey' }}
						style={{width: 160, fontSize:14, fontWeight: 'bold' }}
						labelStyle={{ color: !selectedCreatorUser ? '#b5b5b5' : selectedCreatorUser.color }}
					>
						{creatorMenuItems}
					</SelectField>
				</fb>
				<fb className="searchFieldWrapper">
					<icon className="icon icon-search no-border"></icon>
					<TextField
						id="text-field-controlled"
						value={this.props.taskSearchString}
						onChange={(event) => this.props.changeFilter({taskSearchString:  event.target.value})}
						hintText={'Suche'}
						underlineStyle={{ borderColor: "rgba(0,0,0,0.15)"}}
						style={{width:160}}
					/>
				</fb>
				<fb className="assignedUserFilterWrapper selectFieldWrapper">
					<SelectField
						value={this.props.filterAssignedUser}
						onChange={(event, index, value) => this.props.changeFilter({filterAssignedUser: value})}
						floatingLabelText="Beauftragter"
						underlineStyle={{ borderColor: "rgba(0,0,0,0.15)"}}
						iconStyle={{fill: "rgba(0,0,0,0.15)"}}
						floatingLabelStyle={{color: 'grey' }}
						style={{width: 160, fontSize:14, fontWeight: 'bold'}}
						labelStyle={{ color: !selectedAssignedUser ? '#b5b5b5' : selectedAssignedUser.color }}
					>
						{assignedUserMenuItems}
					</SelectField>
				</fb>
				<fb className="filterTaskCategory filterCheckBox">
					<RadioButtonGroup name="notRight"
						onChange={(e)=>this.props.changeCategoryTo(e.target.value)}
						valueSelected={this.props.selectedCategory}
						style={{fontSize: "14px"}}
					>
						<RadioButton value="single" label="Einmalige" style={{marginBottom: 4}} iconStyle={{marginRight: 10}}/>
						<RadioButton value="repeating" label="Wiederholende" style={{}} iconStyle={{marginRight: 10}}/>
					</RadioButtonGroup>
				</fb>
				<fb className="filterActivesCheckbox filterCheckBox">
				<Checkbox
				label="Vergangene anzeigen"
				iconStyle={{marginRight: 10}}
				style={{fontSize: "14px"}}
				checked={this.props.showPastTask}
				onCheck={()=>this.props.changeFilter({showPastTask: !this.props.showPastTask})}
				/>
				</fb>
			</fb>
		)
	}
}
