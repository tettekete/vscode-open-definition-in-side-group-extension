
<p align="center"><a href="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/">English</a> / 日本語</p>

**目次**

- [概要](#概要)
	- [使用方法](#使用方法)
		- [自動選択モード（デフォルト）](#自動選択モードデフォルト)
		- [手動選択モード](#手動選択モード)
- [コンフィグ項目](#コンフィグ項目)
	- [Automatic Mode](#automatic-mode)
		- [`Show Open In Side Group Menu`](#show-open-in-side-group-menu)
		- [`Allow View Columns`](#allow-view-columns)
	- [Manual Selection Mode](#manual-selection-mode)
		- [`Show Open With Group No. Menu`](#show-open-with-group-no-menu)
		- [`Show Current Editor Group in Manual Mode`](#show-current-editor-group-in-manual-mode)
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

VSCode 標準の `定義へ移動`や `型定義へ移動` などは同じエディタグループ[^1]内で対象の「定義」を開いてしまうため、今見ている自分のコードや定義が見えなくなってしまいます。

本機能拡張は「隣」のエディタグループで「定義」を開くための機能拡張です。

[^1]: 本ドキュメントでは単にペインと呼ぶ場合があります。

![demo](https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/demo.gif)



## 使用方法

本機能拡張には `... へ移動` で開く先のエディタグループを自動で決定する「自動選択モード」とエディタグループ番号を指定することが出来る「手動選択モード」が用意されています。

デフォルトでは「自動選択モード」のみが有効ですが「手動選択モード」のみを使うことも併用することも出来ます。


### 自動選択モード（デフォルト）

インストールすると関数や型の上で開いたコンテキストメニューにサブメニュー `隣で開く` が追加されます。

あとはその中の `定義へ移動` や `型定義へ移動` などを選ぶだけです。

<div align="center"><img src="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png" srcset="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png 2x" width="420"></div>



### 手動選択モード

コンフィグの `Show Open With Group No Menu` をチェックすると `... へ移動` で開く先のエディタグループを指定出来るメニュー `グループを指定して開く` が現れます。

<div align="center"><img src="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/manual-selection-mode.png" srcset="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/manual-selection-mode.png 2x" width="517"></div>

デフォルトのオートモードを表示しないようにするにはコンフィグの `Show Open In Side Group Menu` 項目のチェックを外してください。



# コンフィグ項目

## Automatic Mode

### `Show Open In Side Group Menu`

**コンフィグID**: `open-definition-in-side-group.showOpenInSideGroupMenu`

コンテキストメニューに `Show Open In Side Group`  メニュー項目を表示するかどうかを指定するためのチェックボックスです。

`Show Open In Side Group`  メニューは `... へ移動` で開く先のエディタグループを自動で決定するモードのメニューです。コンフィグ項目 `Allow View Columns` で許可されたエディタグループ番号から自動的に開き先を決定します。


### `Allow View Columns`

**コンフィグID**: `open-definition-in-side-group.allowViewColumns`

定義等の表示先として許可する `viewColumn` 番号をカンマ区切りで設定します。

デフォルトは `1,2,3` です。

例えばあなたがいつも 3 ペインモードで使っていて、定義の表示には必ず 3 つ目のペインで表示したいならば `3` と設定することでそれを実現できます。

あるいは `2,3` と指定すれば、可能な限り 2 番目と 3 番目のペインで交互に表示します。


#### `viewColumn` 番号の確認方法

コマンドパレットで `OpenDefinitionInSideGroup: Check the viewColumn number of the active editor` を選ぶとステータスバーにアクティブなエディターの `viewColumn` 番号を一定時間表示します。


## Manual Selection Mode

### `Show Open With Group No. Menu`

**コンフィグID**: `open-definition-in-side-group.showOpenWithGroupNoMenu`


コンテキストメニューに `グループを指定して開く`  メニュー項目を表示するかどうかを指定するためのチェックボックスです。デフォルトは OFF です。

`グループを指定して開く`  メニューは `... へ移動` 項目がサブメニューを持っており、開き先のエディタグループ番号を選ぶ事ができます。



### `Show Current Editor Group in Manual Mode`

**コンフィグID**: `open-definition-in-side-group.showCurrentGroupInManualMode`

`Show Open With Group No. Menu` が ON の時、カレントのエディタグループ番号を開き先リストに含めるかどうかを指定するチェックボックスです。

この機能拡張のコンセプトが「定義を隣で開く」なのでデフォルトは OFF です。



# 利用可能なコマンド(ショートカット設定向け)

## `OpenDefinitionInSideGroup: Go to Definition`

**コマンドID**: `open-definition-in-side-group.openDefinitionInSidePane`

シンボルの定義を検索し、ジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。


## `OpenDefinitionInSideGroup: Go to Type Definition`

**コマンドID**: `open-definition-in-side-group.openTypeDefinitionInSidePane`

シンボルの型定義（`interface` など）にジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。

## `OpenDefinitionInSideGroup: Go to Source Definition`

**コマンドID**: `open-definition-in-side-group.openDeclarationInSidePane`

通常、シンボルの定義を検索し、ジャンプします。（_既知の問題の[`ソース定義に移動` の挙動](#ソース定義に移動-の挙動)を参照して下さい_）
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。


## `OpenDefinitionInSideGroup: Go to Implementations`

**コマンドID**: `open-definition-in-side-group.openImplementationInSidePane`

抽象クラスやインターフェースの実装クラスへジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。

## `OpenDefinitionInSideGroup: Go to References`

コマンドID: `open-definition-in-side-group.openReferenceInSidePane`

シンボルの参照元（使用箇所）を検索しジャンプします。
検索結果が複数ある場合は QuickPick メニューでジャンプ先をプレビューしつつ選択できます。

## `OpenDefinitionInSideGroup: Show viewColumn number`

**コマンドID**: `open-definition-in-side-group.showViewColumn`

アクティブエディタの `viewColumn` 番号をステータスバーに一定時間表示します。


# 既知の問題

## `ソース定義に移動` の挙動

`ソース定義に移動` と完全に同じ挙動を返す組み込みコマンドが現在提供されていないため、（`ソース定義に移動` と同じように）ほとんどのケースで `定義へ移動` と同じ挙動をします。


## プログラミング言語以外でも `隣で開く` サブメニューが表示される問題

本来であれば非プログラミング言語系のエディタでコンテキストメニューを開いたとき `隣で開く` サブメニューは表示されるべきではありませんが表示される状態にあります。

これは非プログラミング言語系の場合に表示しないようにしようとするとメニューの表示・非表示が不安定になってしまう[^2]問題があるためです。

検討した結果、使いたいときに確実に `隣で開く` が使える方がユーザーにとって有益と判断し、常に表示される仕様を選択しました。

したがってこの問題は仕様です。

[^2]: エディタが切り替わった直後は言語サーバーによる解析処理が終わっておらず、定義があるのに「定義無し」が返されるケースが少なくないためです。
