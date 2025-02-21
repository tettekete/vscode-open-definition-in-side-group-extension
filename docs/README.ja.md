

**目次**

- [概要](#概要)
	- [使用方法](#使用方法)
- [コンフィグ項目](#コンフィグ項目)
	- [`Allow View Columns`](#allow-view-columns)
		- [`viewColumn` 番号の確認方法](#viewcolumn-番号の確認方法)
	- [利用可能なコマンド(ショートカット設定向け)](#利用可能なコマンドショートカット設定向け)
		- [`OpenDefinitionInSideGroup: Go to Definition`](#opendefinitioninsidegroup-go-to-definition)
		- [`OpenDefinitionInSideGroup: Go to Type Definition`](#opendefinitioninsidegroup-go-to-type-definition)
		- [`OpenDefinitionInSideGroup: Go to Source Definition`](#opendefinitioninsidegroup-go-to-source-definition)
		- [`OpenDefinitionInSideGroup: Go to Implementations`](#opendefinitioninsidegroup-go-to-implementations)
		- [`OpenDefinitionInSideGroup: Go to References`](#opendefinitioninsidegroup-go-to-references)
		- [`OpenDefinitionInSideGroup: Show viewColumn number`](#opendefinitioninsidegroup-show-viewcolumn-number)
- [既知の問題](#既知の問題)
	- [`ソース定義に移動` の挙動](#ソース定義に移動-の挙動)
	- [プログラミング言語以外でも `隣で開く` サブメニューが表示される問題](#プログラミング言語以外でも-隣で開く-サブメニューが表示される問題)

---

# 概要

VSCode 標準の `定義へ移動`や `型定義へ移動` などは同じタググループ[^1]内で対象の「定義」を開いてしまうため、今見ている自分のコードや定義が見えなくなってしまいます。

本機能拡張は「隣」のタググループで「定義」を開くための機能拡張です。

[^1]: 本ドキュメントでは単にペインと呼ぶ場合があります。

![demo](https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/demo.gif)



## 使用方法

インストールすると関数や型の上で開いたコンテキストメニューにサブメニュー `隣で開く` が追加されます。

あとはその中の `定義へ移動` や `型定義へ移動` などを選ぶだけです。

<img src="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png" srcset="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png 2x" width="420">


# コンフィグ項目

## `Allow View Columns`

コンフィグID: `open-definition-in-side-group.allowViewColumns`

定義等の表示先として許可する `viewColumn` 番号をカンマ区切りで設定します。

デフォルトは `1,2,3` です。

例えばあなたがいつも 3 ペインモードで使っていて、定義の表示には必ず 3 つ目のペインで表示したいならば `3` と設定することでそれを実現できます。

あるいは `2,3` と指定すれば、可能な限り 2 番目と 3 番目のペインで交互に表示します。


### `viewColumn` 番号の確認方法

コマンドパレットで `OpenDefinitionInSideGroup: Check the viewColumn number of the active editor` を選ぶとステータスバーにアクティブなエディターの `viewColumn` 番号を一定時間表示します。


## 利用可能なコマンド(ショートカット設定向け)

### `OpenDefinitionInSideGroup: Go to Definition`

**コマンドID**: `open-definition-in-side-group.openDefinitionInSidePane`

シンボルの定義を検索し、ジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。


### `OpenDefinitionInSideGroup: Go to Type Definition`

**コマンドID**: `open-definition-in-side-group.openTypeDefinitionInSidePane`

シンボルの型定義（`interface` など）にジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。

### `OpenDefinitionInSideGroup: Go to Source Definition`

**コマンドID**: `open-definition-in-side-group.openDeclarationInSidePane`

通常、シンボルの定義を検索し、ジャンプします。（_既知の問題の[`ソース定義に移動` の挙動](#ソース定義に移動-の挙動)を参照して下さい_）
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。


### `OpenDefinitionInSideGroup: Go to Implementations`

**コマンドID**: `open-definition-in-side-group.openImplementationInSidePane`

抽象クラスやインターフェースの実装クラスへジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。

### `OpenDefinitionInSideGroup: Go to References`

コマンドID: `open-definition-in-side-group.openReferenceInSidePane`

シンボルの参照元（使用箇所）を検索しジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。

### `OpenDefinitionInSideGroup: Show viewColumn number`

**コマンドID**: `open-definition-in-side-group.showViewColumn`

アクティブエディタの `viewColumn` 番号をステータスバーに一定時間表示します。


# 既知の問題

## `ソース定義に移動` の挙動

`ソース定義に移動` と完全に同じ挙動を返す組み込みコマンドが現在提供されていないため、（`ソース定義に移動` と同じように）ほとんどのケースで `定義へ移動` と同じ挙動をします。


## プログラミング言語以外でも `隣で開く` サブメニューが表示される問題

本来であれば非プログラミング言語系のエディタでコンテキストメニューを開いたとき `隣で開く` サブメニューは表示されるべきではありませんが表示される状態にあります。

非プログラミング言語系の場合に表示しないようにしようとするとメニューの表示・非表示が不安定になってしまう[^2]問題があるためです。

検討した結果、使いたいときに確実に `隣で開く` が使える方がユーザーにとって有益と判断し、常に表示される仕様を選択しました。

したがってこの問題は仕様です。

[^2]: エディタが切り替わった直後は言語サーバーによる解析処理まで終わっていない事が多く、定義の有無が正しく返されないのが原因です。
