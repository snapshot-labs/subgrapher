const ongoingRequests = new Map();

export default async function serve(key, action, args) {
  if (!ongoingRequests.has(key)) {
    const requestPromise = action(...args)
      .then(result => {
        ongoingRequests.delete(key);
        return result;
      })
      .catch(error => {
        console.log('EventEmitter Error', error);
        ongoingRequests.delete(key);
        throw { errors: [{ message: error.message }] };
      });
    ongoingRequests.set(key, requestPromise);
  }

  return ongoingRequests.get(key);
}
