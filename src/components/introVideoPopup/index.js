import React from 'react'
import YouTube from 'react-youtube'
import './styles.css'

export default ({closePopup}) => {
  const opts = {
    height: '600',
    width: '920',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  }


  return(
    <fb className="vidWrapper">
      <YouTube
        videoId="oR7Kz2VCaQ0"
        opts={opts}
        onEnd={closePopup}
      />
    </fb>
  )
}
