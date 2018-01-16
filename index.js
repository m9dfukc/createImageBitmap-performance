const PIXI = require('./vendor/pixi.js');
const Control = require('control-panel');

let counter = -1;
const path = 'image.png';
const app = new PIXI.Application(256 * 5, 256);
app.stage.scale.x = app.stage.scale.y = 0.0625;
document.body.appendChild(app.view);

const viaHtmlImageResourceLoader = () => {
  const index = 'img' + counter;
  PIXI.Loader.shared.add(index, path).load((loader, resources) => {
    const sprite = new PIXI.Sprite(resources[index].texture);
    sprite.position.x = sprite.width * counter;
    app.stage.addChild(sprite);
  });
}

const viaBlobResourceLoader = () => {
  const index = 'img' + counter;
  PIXI.Loader.shared
    .add(index, path, {
      loadType: PIXI.Loader.Resource.LOAD_TYPE.XHR,
      xhrType: PIXI.Loader.Resource.XHR_RESPONSE_TYPE.BLOB
    })
    .load((loader, resources) => {
      const sprite = new PIXI.Sprite(resources[index].texture);
      sprite.position.x = sprite.width * counter;
      app.stage.addChild(sprite);
    });
}

const viaHtmlImage = () => {
  const img = new Image();
  img.src = path;
  img.onload = () => {
    window.createImageBitmap(img)
      .then(image => {
        const resource = new PIXI.resources.BaseImageResource(image);
        const baseTexture = new PIXI.BaseTexture(resource);
        const texture = new PIXI.Texture(baseTexture);
        const sprite = new PIXI.Sprite(texture);
        sprite.position.x = sprite.width * counter;
        app.stage.addChild(sprite);
      });
  }
}

const viaBlob = () => {
  fetch(path)
    .then(resp => resp.blob())
    .then(blob => {
      return window.createImageBitmap(blob);
    })
    .then(image => {
      const resource = new PIXI.resources.BaseImageResource(image);
      const baseTexture = new PIXI.BaseTexture(resource);
      const texture = new PIXI.Texture(baseTexture);
      const sprite = new PIXI.Sprite(texture);
      sprite.position.x = sprite.width * counter;
      app.stage.addChild(sprite);
    });
}

const viaWorker = () => {
  const worker = new Worker('worker.js');
  const timeout = setTimeout(() => worker.terminate(), 2000);
  worker.postMessage(path);
  worker.onmessage = function(evt) {
    if (evt.data.type === 'image') {
      const resource = new PIXI.resources.BaseImageResource(evt.data.image);
      const baseTexture = new PIXI.BaseTexture(resource);
      const texture = new PIXI.Texture(baseTexture);
      const sprite = new PIXI.Sprite(texture);
      sprite.position.x = sprite.width * counter;
      app.stage.addChild(sprite);
    }
    clearTimeout(timeout);
    worker.terminate();
  }
}

const incFunc = func => () => {
  counter++;
  func();
}

const buttons = Control([
  {type: 'button', label: 'ResourceLoader Image', action: incFunc(viaHtmlImageResourceLoader)},
  {type: 'button', label: 'ResourceLoader Blob', action: incFunc(viaBlobResourceLoader)},
  {type: 'button', label: 'Fetch Image', action: incFunc(viaHtmlImage)},
  {type: 'button', label: 'Fetch Blob', action: incFunc(viaBlob)},
  {type: 'button', label: 'Fetch Worker Blob', action: incFunc(viaWorker)}
]);
