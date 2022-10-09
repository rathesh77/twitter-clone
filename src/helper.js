
export function formatDate(date) {

  const { low, high } = date
  
  let lowBits = (low).toString(2)
  let highBits = (high).toString(2)
  if (low < 0)
    lowBits = (parseInt(lowBits.split('').map((b) => b === '1' ? '0' : '1').join(''), 2) + 1).toString(2)
  if (high < 0)
    highBits = (parseInt(highBits.split('').map((b) => b === '1' ? '0' : '1').join(''), 2) + 1).toString(2)

  let fullBits = highBits.concat(lowBits) + ""
  fullBits = '0'.repeat(64 - fullBits.length).concat(fullBits)

  return formatMillisecondsToDate(parseInt(fullBits, 2))
}

export function formatMillisecondsToDate(timestamp) {
  const dateTime = new Date(timestamp)
  const day = dateTime.getDate()
  const month = dateTime.getMonth() + 1
  const year = dateTime.getFullYear()
  const hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  const seconds = dateTime.getSeconds()

  const left = [day, month, year].map((e) => e < 10 ? '0' + e : e).join('/')
  const right = [hours, minutes, seconds].map((e) => e < 10 ? '0' + e : e).join(':')
  console.log(left + right)

  return left + ' ' + right
}
