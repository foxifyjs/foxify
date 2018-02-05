import microseconds from 'microseconds'
import * as http from 'http'
import * as colors from 'colors'

/**
 *
 * @param {!Number|String} time
 * @return {{time: (Number|String), measurement: *}}
 */
const calculate = (time: number) => {
  if (time < 1000) {
    return {
      time,
      measurement: '\u00B5s'.green
    }
  }

  if (time >= 1000 && time < 1000 * 1000) {
    return {
      time: (time / 1000).toFixed(3),
      measurement: 'ms'.green
    }
  }

  if (time >= 1000 * 1000) {
    return {
      time: (time / (1000 * 1000)).toFixed(3),
      measurement: 's'.yellow
    }
  }

  // if (time >= 1000 * 1000 * 60) {
  return {
    time: (time / (1000 * 1000 * 60)).toFixed(3),
    measurement: 'm'.red
  }
  // }
};

export default (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
  let startTime = microseconds.now()

  res.on('finish', () => {
    let _calculate = calculate(microseconds.since(startTime).toFixed(3))

    console.log(
      req.method,
      req.url,
      res.statusCode >= 200 && res.statusCode < 300 ?
        colors.green(`${res.statusCode}`) :
        colors.yellow(`${res.statusCode}`),
      '\u007E'.blue,
      `${_calculate.time} ${_calculate.measurement}`
    )
  })

  next()
}
