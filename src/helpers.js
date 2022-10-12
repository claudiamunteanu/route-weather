const reviver = (key, value) => {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
export const isPersistedSessionStorageState = stateName => {
  const sessionState = sessionStorage.getItem(stateName);
  return sessionState && JSON.parse(sessionState, reviver);
}

export const isPersistedLocalStorageState = stateName => {
  const sessionState = localStorage.getItem(stateName);
  return sessionState && JSON.parse(sessionState, reviver);
}

export const isEmpty = obj => {
  return Object.keys(obj).length === 0;
}

export const dateToTimestamp = date => {
  return Date.parse(date) / 1000
}

const formatNumber = number => {
  return number<10 ? "0"+number : number
}

export const timestampToDateTime = timestamp => {
  if (timestamp==null)
    return  '';
  var date = new Date(timestamp * 1000);
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let hour = date.getHours()
  let minutes = date.getMinutes()
  return year + "-" + formatNumber(month) + "-" + formatNumber(day) + "T" + formatNumber(hour) + ":" + formatNumber(minutes)
}

export const timestampToDate = timestamp => {
  if (timestamp == null)
    return ''
  var date = new Date(timestamp * 1000);
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  return  formatNumber(day)+"." + formatNumber(month)
}

export const timestampToFormattedDateTime = timestamp => {
  if (timestamp==null)
    return '';
  var date = new Date(timestamp * 1000);
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let hour = date.getHours()
  let minutes = date.getMinutes()
  return formatNumber(day) + '.' + formatNumber(month) + '.' + year + " " + formatNumber(hour) + ":" + formatNumber(minutes)
}

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const weekBeginning = timestamp => {
  let seconds = 7*24 * 3600;
  return timestamp - seconds;
}

export const weatherCategories = ['THUNDERSTORM', 'DRIZZLE', 'RAIN', 'SNOW', 'ATMOSPHERE', 'CLEAR', 'CLOUDS']

export const daysOfWeek = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat']

export const meterPerSecToKmPerHour = value => {
  return (value * 18 / 5).toFixed(2)
}

export const meterPerSecToMilesPerHour = value => {
  return (value * 2.2369).toFixed(2)
}

export const celsiusToFahrenheit = temp => {
  return (temp * 9 / 5 + 32).toFixed(2)
}

export const hPaToinHg = value => {
  return  (value * 0.02953).toFixed(2)
}

export const mmToIn = value => {
  return (value * 0.0393701).toFixed(2)
}
