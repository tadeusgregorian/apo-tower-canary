import React from 'react';
import './styles.css';
import FlatButton from 'material-ui/FlatButton';
import { NavLink } from 'react-router-dom';

const Navbar = ({routes, children, user}) => {
	return (
		<fb id="navbar">
			<fb className='navbarContentWrapper'>
				<left>
					{ routes.map(r =>
						<FlatButton
							key={r.path}
							rippleColor="white"
							className="linkButton"
							containerElement={<NavLink activeClassName="active" to={r.path} />}
							label={r.name} />
					)}
				</left>
			</fb>
		</fb>
	)
}



export default Navbar;
