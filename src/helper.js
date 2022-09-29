
function formatDate(date) {

  const { low, high } = date
  let lowBits = null
  let highBits = null

  lowBits = (low).toString(2)
  highBits = (high).toString(2)
  if (low < 0)
    lowBits = (parseInt(lowBits.split('').map((b) => b === '1' ? '0' : '1').join(''), 2) + 1).toString(2)
  if (high < 0)
    highBits = (parseInt(highBits.split('').map((b) => b === '1' ? '0' : '1').join(''), 2) + 1).toString(2)

  let fullBits = highBits.concat(lowBits) + ""
  fullBits = '0'.repeat(64 - fullBits.length).concat(fullBits)
  const dateTime = new Date(parseInt(fullBits, 2))
  const day = dateTime.getDate()
  const month = dateTime.getMonth() + 1
  const year = dateTime.getFullYear()
  const hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  const seconds = dateTime.getSeconds()

  const left = [day, month, year].map((e) => e < 10 ? '0' + e : e).join('/')
  const right = [hours, minutes, seconds].map((e) => e < 10 ? '0' + e : e).join(':')

  return left + ' ' + right
}

export default formatDate;