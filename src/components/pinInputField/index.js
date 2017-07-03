import React, {PureComponent} from 'react'
import './styles.css'

export default class PinInputField extends PureComponent{

  trimLast = (str) => str.substring(0, str.length - 1)

  onKeyDown = (e) => {
    if(e.key === 'Backspace') e.preventDefault()
    const curPin = this.props.pin

    e.key === 'Enter' && this.props.onEnter && this.props.onEnter()
    e.key === 'Backspace' && curPin.length && this.props.onChange(this.trimLast(curPin))
    if(e.key.length > 1) return   // this prevents something like 'Enter' to the appended to the pin
    if(curPin.length > 3) return  // so the max-pin-length is 4
    this.props.onChange(curPin + e.key)
  }

  componentDidMount = () => this.props.autoFocus && this.refs.pinField.focus()
  componentWillUnmount = () => document.body.removeEventListener('keydown', this.onKeyDown)

  componentDidUpdate = (pP) => !pP.getFocused && this.props.getFocused && this.refs.pinField.focus()

  onFocus = () => document.body.addEventListener('keydown', this.onKeyDown)
  onBlur = () => document.body.removeEventListener('keydown', this.onKeyDown)

  render(){
    const pinLength = this.props.pin.length
    return(
      <fb className="myInputField" tabIndex={this.props.tabInd} ref='pinField' onFocus={this.onFocus} onBlur={this.onBlur}>
        <fb className="digitBox">{pinLength > 0 && 'X'}</fb>
        <fb className="digitBox">{pinLength > 1 && 'X'}</fb>
        <fb className="digitBox">{pinLength > 2 && 'X'}</fb>
        <fb className="digitBox">{pinLength > 3 && 'X'}</fb>
      </fb>
    )
  }
}
