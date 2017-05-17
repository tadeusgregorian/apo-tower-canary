import React from 'react'
import { NavLink } from 'react-router-dom'
import './styles.css'

export default ({subRoutes, bgColor}) => {
  return(
    <fb className="subBarMain" style={{backgroundColor: bgColor}}>
      <fb className="justDarken">
        <fb className="center">
          {
            subRoutes.map(route =>
              <NavLink to={route.path} key={route.label} activeClassName="active">
                  <fb className="subBarButton">{route.label}</fb>
              </NavLink>
            )
          }
        </fb>
      </fb>
    </fb>
  )
}
