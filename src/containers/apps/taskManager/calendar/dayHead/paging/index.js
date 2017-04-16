import cN  from 'classnames'
import React  from 'react'
import './styles.scss'

const Paging = ({clickHandler, direction, children}) => (
	<fb className={cN({"paging":true,  "paging-left": direction == "left", "paging-right": direction == "right", })}>
		{children}
		<icon	onTouchTap={clickHandler}
					className={cN({  "icon-arrow-left2": direction == "left", "icon-arrow-right2": direction == "right", })}
		/>
	</fb>
)

export default Paging;
