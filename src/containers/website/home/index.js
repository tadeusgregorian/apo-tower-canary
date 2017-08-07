import React from 'react'
import Registration from './registration'
import YouTube from 'react-youtube'
import './styles.css'

export default() => {

	const opts = {
		height: '340',
		width: '604',
		playerVars: { // https://developers.google.com/youtube/player_parameters
			modestbranding:1,
			showinfo: 0,
			controls: 0,
			rel: 0
		}
	}

	return(
		<fb id='homeMain'>
			<fb className="center">
				<fb id='homeLeft'>
					<YouTube videoId="lJACSys0FGc" opts={opts} />
				</fb>
				<fb id='homeRight'>
					<Registration />
				</fb>
			</fb>
		</fb>
	)
}
