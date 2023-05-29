import events from 'events';
import { sha256 } from '../utils';

const eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(1000); // https://stackoverflow.com/a/26176922

export default async function serve(id, action, args) {
  const key = sha256(id);
  return new Promise(async resolve => {
    eventEmitter.once(key, data => resolve(data));
    if (eventEmitter.listenerCount(key) === 1) {
      try {
        eventEmitter.emit(key, await action(...args));
      } catch (error: any) {
        console.log('EventEmitter Error', error);
        eventEmitter.emit(key, { errors: [{ message: error.message }] });
      }
    }
  });
}
