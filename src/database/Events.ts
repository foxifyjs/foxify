import * as EventEmitter from 'events'
import Model from './Model'

const events = [
  'db:connecting',
  'db:connected'
]

class Event extends EventEmitter {
  on(event: string, listener: (...args: any[]) => void) {
    if (events.indexOf(event) === -1) throw new Error('undefined database event')

    return super.on(event, listener)
  }

  emit(event: string, ...args: Array<any>) {
    if (events.indexOf(event) === -1) throw new Error('undefined database event')

    return super.emit(event, ...args)
  }
}

export default Event
