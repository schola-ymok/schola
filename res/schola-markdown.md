このチャプターの目次は次の通りです

:toc[depth=3]

## 見出し

```
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
```

## 目次の挿入

- `:toc`と入力すれば目次が挿入されます。
- `:toc[depth=表示する見出しレベル]`と入力すれば、指定したレベルまでの見出しが目次に挿入されます。

```
:toc
```

:note[レベル指定を省略した場合はレベル 2 までの見出しが挿入されます。]

## リスト

```
- Red
- Green
- Blue
  - Dark Blue
  - Light Blue
```

- Red
- Green
- Blue
  - Dark Blue
  - Light Blue

### 番号付きリスト

```
1. First
2. Second
3. Third
```

1. First
2. Second
3. Third

## テキストリンク

```
[リンクテキスト](リンクのURL)
```

[リンクテキスト](http://schola.jp)

### ページ内リンク

次のように見出しタイトルに`#`を付与した文字列をリンクに指定するとページ内にリンクすることができます。

```
[ページ内リンク](#数式)
```

[本ページ内の「数式」へリンク](#数式)

## インラインスタイル

```
*Italic*
**太字**
~~打消し線~~
`code`
```

- _Italic_
- **太字**
- ~~打消し線~~
- `code`

## 画像

```
![altテキスト](https://画像のURL)
```

![Lenna](https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png)

### 横幅を指定

次のように画像の URL の後にスペースと`"横幅px"`を記入すると画像の横幅を指定することができます。

```
![altテキスト](https://画像のURL "100px")
```

![Lenna](https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png '100px')

:note[横幅の単位に`%`を指定することもできます。]

## 区切り線

```
---
```

---

## 引用

```
> このように
> 引用文を記述
```

> このように
> 引用文を記述

## 脚注

次のようにして脚注を記述します。脚注の内容はページの末尾に表示されます。

```
これは脚注の例です[^1]。

[^1]: 脚注のサンプル
```

これは脚注の例です[^1]。

[^1]: 脚注のサンプル

## メッセージ

### note

```
:note[メッセージ]
```

:note[メッセージ]

### warning

```
:warning[注意メッセージ]
```

:warning[注意メッセージ]

## 表

```
| Head1 | Head2 | Head3 |
| ---- | ---- | ---- |
| Text | Text | Text |
| Text | Text | Text |
```

| Head1 | Head2 | Head3 |
| ----- | ----- | ----- |
| Cell  | Cell  | Cell  |
| Cell  | Cell  | Cell  |

## 数式

[**Tex**](https://katex.org/docs/support_table.html)形式で数式を記述できます。

### ブロックで挿入

次のように`$$`の間に記述すると

```
$$
e^{i\theta} = \cos\theta + i\sin\theta
$$
```

下のように表示されます。

$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

### インラインで挿入

`$b^2-4ac$` のように`$`の間に記述すると、$b^2-4ac$ のようにインラインで数式が表示されます。

## コードブロック

プログラムのコードは「```」で囲みます。

> \`\`\`java
>
> \`\`\`

のようにして言語名を書くとシンタックスハイライトが適用されます。

```java
class Hello{
  public static void main(String[] args){
    System.out.println("Hello World");
  }
}
```

## 埋め込み

### Youtube

次のようにアドレスを記述するとプレイヤが表示されます。

```
https://www.youtube.com/watch?v=TLDflhhdPCg
```

### Twitter

次のようにアドレスを記述するとツイートが表示されます。

```
https://twitter.com/jack/status/20
```

### GoogleMap

次のようにして`:gmap[GoogleMapの埋め込みコード]` と記述すると地図が表示されます。

```
:gmap[<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4719.952151533222!2d139.76692977946007!3d35.681002764145575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sja!2sjp!4v1676008882244!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>]
```

:note[ストリートビューも同様に表示できます。]

### NEORT

次のようにして`:neort[NEORTの埋め込みコード]` と記述すると NEORT アートが表示されます。

```
:neort[<iframe height="315" style="max-width: 560px; width: 100%; overflow:hidden; display:block;" src="https://neort.io/embed/cdlpg2kn70rqdtr2ies0?autoStart=true&quality=1&info=true" frameborder="0" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-downloads" allow="geolocation; microphone; camera; midi; vr" allowfullscreen="true" allowtransparency="true"></iframe>]
```

### SlideShare

次のようにして`:slideshare[SlideShareの埋め込みコード]` と記述するとスライドが表示されます。

```
:slideshare[<iframe src="//www.slideshare.net/slideshow/embed_code/key/DvhB5fUUbdUpPq" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>]
```

### SpeakerDeck

次のようにして`:speakerdeck[SpeakerDeckの埋め込みコード]` と記述するとスライドが表示されます。

```
:speakerdeck[<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/e2a40fa8861e41009aa155798414a509" title="Prettier Plugins" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 314;" data-ratio="1.78343949044586"></iframe>]
```

### CodeSandbox

次のようにして`:codesandbox[CodeSandboxの埋め込みコード]` と記述するとダッシュボードが表示されます。

```
<iframe src="https://codesandbox.io/embed/react-new?fontsize=14&hidenavigation=1&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="React" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>
```

### StackBlitz

次のように埋め込みリンクを記述するとダッシュボードが表示されます。

```
https://stackblitz.com/edit/react-ts-7r4rbh?embed=1&file=index.tsx
```

### Figma

次のようにして`:figma[Figmaの埋め込みコード]` と記述するとデザインプロトタイプが表示されます。

```
:figma[<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fj51f1AUIo9lwWbFsjqy8l7%2FNB-heatmap-(Community)%3Fnode-id%3D0%253A1%26t%3Dtq16yGCYJ6MeLsg0-1" allowfullscreen></iframe>]
```
