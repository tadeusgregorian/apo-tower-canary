import moment from 'moment'

export const startNewDayChecker = () => {
  const twentyMin = 1000 * 60 * 20
  const today = moment().date()

  setInterval(
    () => { if(moment().date() !== today) location.reload() },
    twentyMin
  )
}
