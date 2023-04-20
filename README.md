# barcode-detection-api-demo

## Demo

https://rksan.github.io/barcode-detection-api-demo/

## History

- JAN コード（13 桁、8 桁）のチェックディジットを検証する処理を追加 （`モジュラス10 | Modulus 10`）

### コード抜粋

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

### 使い方

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
