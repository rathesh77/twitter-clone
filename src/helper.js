
function formatDate(date) {
 /* const {day, month, year} = date
  const str = [day, month, year].map((e) => e.low < 10 ? '0' + e.low : e.low).join('/')
  return str
*/
  const {low, high} = date
  let lowBits = (low).toString(2)
  lowBits = '0'.repeat(32 - lowBits.length).concat(lowBits)
  let highBits = (high).toString(2)
  highBits = '0'.repeat(32 - highBits.length).concat(highBits)

  const fullBits = highBits.concat(lowBits)+ ""
  const dateTime = new Date(parseInt(fullBits, 2))
  const day = dateTime.getDate()
  const month = dateTime.getMonth()
  const year = dateTime.getFullYear()
  const hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  const seconds = dateTime.getSeconds()

  const left = [day, month, year].map((e) => e < 10 ? '0' + e : e).join('/')
  const right = [hours, minutes, seconds].map((e) => e < 10 ? '0' + e : e).join(':')

  return left + ' ' + right
}

export default formatDate;