import events from 'events';
import { sha256 } from '../utils';

const eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(10000); // https://stackoverflow.com/a/26176922

export default async function serve(id, action, args) {
  const key = sha256(id);
  return new Promise(async resolve => {
    eventEmitter.on(key, data => {
      resolve(data);
      const listeners = eventEmitter.listeners(key);
      // @ts-ignore
      eventEmitter.removeListener(key, listeners[0]);
    });
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
