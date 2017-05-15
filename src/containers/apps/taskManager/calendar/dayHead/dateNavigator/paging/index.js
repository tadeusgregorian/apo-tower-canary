import cN  from 'classnames'
import React  from 'react'
import './styles.css'

const Paging = ({clickHandler, direction}) => {
	const isLeft = direction === 'left'
	const isRight = direction === 'right'

	return(
		<fb className={cN({ 'paging': true, 'paging-left': isLeft, 'paging-right': isRight})} onClick={clickHandler}>
			<icon	className={cN({  'icon-arrow-left2': isLeft, 'icon-arrow-right2': isRight})}/>
		</fb>
	)
}

export default Paging;
