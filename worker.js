self.onmessage = (evt) => {
  const url = evt.data;
  self
    .fetch(url)
    .then(resp => resp.blob())
    .then(blob => self.createImageBitmap(blob))
    .then(image => self.postMessage({type: 'image', image: image}, [image]))
    .catch(err => self.postMessage({type: 'error', msg: err.message}));
}
