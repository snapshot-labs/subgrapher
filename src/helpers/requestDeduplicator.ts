const ongoingRequests = new Map();

export default function serve(key, action, args) {
  if (!ongoingRequests.has(key)) {
    const requestPromise = action(...args)
      .then(result => result)
      .catch(error => {
        console.log('[requestDeduplicator] request error', error);
        throw { errors: [{ message: error.message }] };
      })
      .finally(() => {
        ongoingRequests.delete(key);
      });
  
    ongoingRequests.set(key, requestPromise);
  }

  return ongoingRequests.get(key);
}
