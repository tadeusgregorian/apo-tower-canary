import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { updateIntroVideoWatched } from 'actions'
import YouTube from 'react-youtube'
import './styles.css'

class IntroVideoPopup extends PureComponent {
  constructor(p){
    super(p)

    this.opts = {
      height: '600',
      width: '920',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        modestbranding:1
      }
    }
  }

  componentDidMount = () => {
    const tenSeconds = 10000
    setTimeout(this.changeVideoWatchedStatus, tenSeconds)
  }

  changeVideoWatchedStatus = () => {
    const videoOpen       = this.props.introVideoPopup.isOpen
    const alreadyWatched  = !!this.props.introVideoWatched
    // if video was already watched at least once ( no matter if insufficiently watched: we mark it next time as sufficient)
    // we just bother the user maximal 2 times. If user watched it sufficiently, we dont auto-open the popup ever again.
    const newStatus       = (videoOpen || alreadyWatched) ? 'sufficent' : 'insufficient'
    updateIntroVideoWatched(newStatus)
  }

  render = () => (
    <fb className="vidWrapper">
      <YouTube
        videoId="oR7Kz2VCaQ0"
        opts={this.opts}
        onEnd={this.props.closePopup}
      />
    </fb>
  )
}

const mapStateToProps = (state) => ({
	introVideoWatched: state.accountDetails.data.introVideoWatched,
	introVideoPopup: state.ui.app.introVideoPopup
})

export default connect(mapStateToProps)(IntroVideoPopup)
