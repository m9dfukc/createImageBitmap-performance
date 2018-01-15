const PIXI = require('./vendor/pixi.js');
const Control = require('control-panel');

let counter = -1;
const path = 'image.png';
const app = new PIXI.Application(256 * 3, 256);
app.stage.scale.x = app.stage.scale.y = 0.0625;
document.body.appendChild(app.view);

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

const viaResourceLoader = () => {
  const index = 'img' + counter;
  PIXI.Loader.shared.add(index, path).load((loader, resources) => {
    const sprite = new PIXI.Sprite(resources[index].texture);
    sprite.position.x = sprite.width * counter;
    app.stage.addChild(sprite);
  });
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

const incFunc = func => () => {
  counter++;
  func();
}

const buttons = Control([
  {type: 'button', label: 'HTMLImageElement', action: incFunc(viaHtmlImage) },
  {type: 'button', label: 'ResourceLoader', action: incFunc(viaResourceLoader) },
  {type: 'button', label: 'Blob', action: incFunc(viaBlob)}
]);
