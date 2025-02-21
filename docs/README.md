
<p align="center">English / <a href="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/README.ja.html">日本語</a></p>

**Table of Contents**

- [Overview](#overview)
	- [How to Use](#how-to-use)
- [Configuration Options](#configuration-options)
	- [`Allow View Columns`](#allow-view-columns)
		- [How to Check `viewColumn` Numbers](#how-to-check-viewcolumn-numbers)
- [Available Commands (For Shortcut Configuration)](#available-commands-for-shortcut-configuration)
	- [`OpenDefinitionInSideGroup: Go to Definition`](#opendefinitioninsidegroup-go-to-definition)
	- [`OpenDefinitionInSideGroup: Go to Type Definition`](#opendefinitioninsidegroup-go-to-type-definition)
	- [`OpenDefinitionInSideGroup: Go to Source Definition`](#opendefinitioninsidegroup-go-to-source-definition)
	- [`OpenDefinitionInSideGroup: Go to Implementations`](#opendefinitioninsidegroup-go-to-implementations)
	- [`OpenDefinitionInSideGroup: Go to References`](#opendefinitioninsidegroup-go-to-references)
	- [`OpenDefinitionInSideGroup: Show viewColumn number`](#opendefinitioninsidegroup-show-viewcolumn-number)
- [Known Issues](#known-issues)
	- [Behavior of `Go to Source Definition`](#behavior-of-go-to-source-definition)
	- [`Open in Side Group` Submenu Appearing in Non-Programming Languages](#open-in-side-group-submenu-appearing-in-non-programming-languages)

---

# Overview

In VSCode, built-in features like `Go to Definition` and `Go to Type Definition` open the target "Definition" within the same tab group[^1]. This can cause you to lose sight of your current code or definition.

This extension provides functionality to open "Definitions" in an adjacent tab group instead.  

[^1]: In this document, the term "pane" may be used interchangeably.

![demo](https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/demo.gif)


## How to Use

Once installed, a submenu called `Open in Side Group` will be added to the context menu when you right-click on a function or type.

Simply select `Go to Definition`, `Go to Type Definition`, or similar options from this submenu.

<img src="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png" srcset="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png 2x" width="420">


# Configuration Options

## `Allow View Columns`

**Config ID:** `open-definition-in-side-group.allowViewColumns`

Specifies the `viewColumn` numbers where definitions are allowed to be displayed. Multiple numbers can be set, separated by commas.

The default setting is `1,2,3`.

For example, if you always work in a three-pane mode and want definitions to appear exclusively in the third pane, set this value to `3`.

Alternatively, setting it to `2,3` will attempt to alternate between the second and third panes when displaying definitions.

### How to Check `viewColumn` Numbers

You can check the `viewColumn` number of the active editor by running the command `OpenDefinitionInSideGroup: Check the viewColumn number of the active editor` from the command palette. The `viewColumn` number will be displayed in the status bar for a short period.


# Available Commands (For Shortcut Configuration)

## `OpenDefinitionInSideGroup: Go to Definition`

Command ID: `open-definition-in-side-group.openDefinitionInSidePane`

Searches for the definition of a symbol and jumps to it.
If multiple results are found, you can preview and select the destination via the QuickPick menu.


## `OpenDefinitionInSideGroup: Go to Type Definition`

**Command ID**: `open-definition-in-side-group.openTypeDefinitionInSidePane`

Jumps to the type definition of a symbol (such as `interface`).
If multiple results are found, you can preview and select the destination via the QuickPick menu.

## `OpenDefinitionInSideGroup: Go to Source Definition`

**Command ID**: `open-definition-in-side-group.openDeclarationInSidePane`

Normally searches for and jumps to the definition of a symbol. (_See the known issue section on [Behavior of `Go to Source Definition`](#behavior-of-go-to-source-definition)_)
If multiple results are found, you can preview and select the destination via the QuickPick menu.


## `OpenDefinitionInSideGroup: Go to Implementations`

**Command ID**: `open-definition-in-side-group.openImplementationInSidePane`

Jumps to the implementation classes of abstract classes or interfaces.
If multiple results are found, you can preview and select the destination via the QuickPick menu.

## `OpenDefinitionInSideGroup: Go to References`

**Command ID**: `open-definition-in-side-group.openReferenceInSidePane`

Searches for and jumps to the references (usages) of a symbol.
If multiple results are found, you can preview and select the destination via the QuickPick menu.

## `OpenDefinitionInSideGroup: Show viewColumn number`

**Command ID**: `open-definition-in-side-group.showViewColumn`

Displays the `viewColumn` number of the active editor in the status bar for a set period.


# Known Issues

## Behavior of `Go to Source Definition`

Currently, there is no built-in VSCode command that behaves exactly like `Go to Source Definition`. As a result, this extension's implementation of `Go to Source Definition` will behave similarly to `Go to Definition` in most cases.

## `Open in Side Group` Submenu Appearing in Non-Programming Languages

Ideally, the `Open in Side Group` submenu should not appear when opening the context menu in non-programming language editors. However, it currently appears regardless of the file type.

This is due to an issue where trying to conditionally hide the menu causes instability in its visibility[^2]. 

After considering the trade-offs, we decided that ensuring the `Open in Side Group` option is always available is more beneficial for users. 

Thus, this behavior is intentional and considered part of the extension's design.

[^2]: This is because, immediately after the editor has been switched, the analysis process by the language server has not yet finished, and in many cases, "no definition" is returned even though there is a definition.
