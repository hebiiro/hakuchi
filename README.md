# 白痴ースタイル編集

COEIROINK:白痴ーのスタイルを GUI で編集するツールです。
[最新バージョンをダウンロード](../../releases/latest/)

## 注意事項

ADODB.Stream を使用しているので、セキュリティソフトによっては誤検知されることがあるらしいです。

## 導入方法

hakuchi フォルダを基本となるスタイルのフォルダ (例えば 8f9b94c4-b587-11ec-9162-0242ac1c0002) に入れてください。<br>
<br>
**フォルダ構造**
```
COEIROINK
	speaker_info
		基本となるスタイルのフォルダ
			hakuchi
				js
				hakuchi.hta
				orig_metas.json
```

## 使用方法

1. COEIROINK を一旦閉じます。
2. hakuchi.hta を起動します。
3. 使用しないスタイルをクリックして非アクティブにします。
4. 「変更を適用」ボタンを押して変更を適用します。(metas.json の書き換えやファイルの移動が行われます)
5. COEIROINK を起動して設定が反映されている確認します。

※新しいスタイルを追加したときは orig_metas.json にも新しいスタイルの記述を追加してください。

## 更新履歴

* 38.0.0 - 2022/09/09 38種に対応

## クレジット

### jQuery v3.6.0
* https://jquery.com/
* (c) OpenJS Foundation and other contributors
* jquery.org/license

## 作成者情報
 
* 作成者 - 蛇色 (へびいろ)
* GitHub - https://github.com/hebiiro
* Twitter - https://twitter.com/io_hebiiro

## 免責事項

この作成物および同梱物を使用したことによって生じたすべての障害・損害・不具合等に関しては、私と私の関係者および私の所属するいかなる団体・組織とも、一切の責任を負いません。各自の責任においてご使用ください。
