export default function (value) {
  import moment from 'moment'
  
  let dateTime
  var datePart = value.slice(0, 10)
  var timePart = value.slice(11, 17)
  datePart = datePart.split('/').reverse().join('-')
  dateTime = datePart + timePart
  let timeVal = moment(dateTime).startOf('minute').fromNow()
  return timeVal
}
