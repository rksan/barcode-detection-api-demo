# barcode-detection-api-demo

## use

QuaggaJS
https://github.com/serratus/quaggaJS

## Demo

https://rksan.github.io/barcode-detection-api-demo/

## History

2. <p><h3>拡大/縮小</h3>

`<video>`や`<canvas>`を画面幅一杯になる様に拡大/縮小した場合、`QuaggaJS.ImageDebug.drawPath()`で描画した矩形イメージが拡大/縮小されない問題に対する解を追加

`html`

```html
<div id="interactive" class="viewport">
  <!-- QuaggaJS が使う canvas -->
  <canvas class="drawingBuffer"></canvas>
  <!-- 拡大縮小用のcanvas -->
  <canvas class="debug"></canvas>
  　<!-- QuaggaJS が使う video -->
  <video></video>
</div>
```

`css`

```css
.viewport > video,
.viewport > canvas.debug {
  position: absolute;
  top: 0;
  /* bottom: 0; */
  left: 0;
  /* right: 0; */

  width: 100%;
  /*height: 100%;*/
}
.viewport > canvas.drawingBuffer {
  position: absolute;
  top: 0;
  left: 0;
}

.viewport > canvas.drawingBuffer {
  visibility: hidden;
  z-index: 3;
}

.viewport > canvas.debug {
  z-index: 2;
}

.viewport > video {
  z-index: 1;
}
```

```js
/** @type {CanvasRenderingContext2D} */
const buffer = QuaggaJS.canvas.ctx.overlay;

/** @type {HTMLCanvasElement} */
const offCanvas = QuaggaJS.canvas.dom.overlay;

// ... 中略 ...
// 矩形の描画処理等
// QuaggaJS.ImageDebug.drawPath() ...

//
/** @type {HTMLCanvasElement} */
const onCanvas = document.querySelector("canvas.debug");

/** @type {CanvasRenderingContext2D} */
const context = onCanvas.getContext("2d");

// onCanvas の Rectangle
const rect = onCanvas.getBoundingClientRect();

// onCanvas の矩形をクリア
context.clearRect(0, 0, rect.width, rect.height);

// offCanvas -> onCanvas へ イメージを転写
context.drawImage(offCanvas, 0, 0, rect.width, rect.height);
```

</p>

1. <p><h3>チェックディジット</h3>
   JAN コード（13 桁、8 桁）のチェックディジットを検証する処理を追加 （`モジュラス10 | Modulus 10`）

コード抜粋

```cjs
// ./verifier/modulus10.js

class Modulus10 extends Verifier {
  //...

  /**
   *
   * @param {Array<String>} chars code without check digit
   * @return {Number} check digit
   * @memberof Modulus10
   */
  checkdigit(chars) {
    let subtotal = [0, 0];

    chars.forEach((code, idx) => {
      let num = parseInt(code, 10);

      if (idx % 2 === 0) {
        // 偶数
        subtotal[1] += num;
      } else {
        // 奇数
        subtotal[0] += num;
      }
    });

    let total = subtotal[0] * this._config.weight + subtotal[1];
    let subplus = total % this._config.base;
    let digit = 0;

    if (subplus === 0) {
      digit = 0;
    } else {
      digit = this._config.base - subplus;
    }

    return digit;
  }

  //...
}
```

#### 使い方

```cjs
const Modulus10 = require("./verifer/modulus10.js");

const modulus = new Modulus10();

if (!(modulus.verify(/** bardocde string */))) {
  console.error("不正なバーコードです");
}

console.log("正しいバーコードです。");

// debug
//console.log("[modulus10]", modulus)
```

</p>

# Memo

`Quagga`オブジェクトを`console.log()`で出力した際の内容(加筆有り)

```js
Quagga: {
  CameraAccess: {
    enumerateVideoDevices: f(),
    getActiveStreamLabel : String,
    getActiveTrack: MediaStreamTrack, // @ref : https://developer.mozilla.org/ja/docs/Web/API/MediaStreamTrack
    release: f(),
    request: f(),
  },
  ImageDebug:{
    drawImage: f(t, e, n),
    drawPath: f(t, e, n, r),
    drawRect: f(t, e, n, r),
  },
  ImageWrapper: f r(t, e, n, r){
    clearArray: f(t),
    sample: f(t, e, n),
  },
  ResultCollector: {
    create: f(t),
  },
  canvas: {
    ctx: {
      image: CanvasRenderingContext2D, //@ref : https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D
      overlay: CanvasRenderingContext2D,
    },
    dom: {
      image: canvas.imgBuffer,
      overlay: canvas.drawingBuffer,
    },
  },
  decodeSingle: f(t, e),
  init: f(t, e, n),
  offDetected: f(t),
  offProcessed: f(t),
  onDetected: f(t),
  onProcessed: f(t),
  pause: f(),
  registerResultCollector: f(t),
  setReaders: f(t),
  start: f(),
  stop: f(),
};
```
