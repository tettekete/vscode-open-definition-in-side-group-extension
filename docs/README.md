
<p align="center">English / <a href="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/README.ja.html">日本語</a></p>

**Table of Contents**

- [Overview](#overview)
	- [How to Use](#how-to-use)
		- [Automatic Mode (Default)](#automatic-mode-default)
		- [Manual Selection Mode](#manual-selection-mode)
- [Configuration Options](#configuration-options)
	- [Automatic Mode](#automatic-mode)
		- [`Show Open In Side Group Menu`](#show-open-in-side-group-menu)
		- [`Allow View Columns`](#allow-view-columns)
	- [Manual Selection Mode](#manual-selection-mode-1)
		- [`Show Open With Group No. Menu`](#show-open-with-group-no-menu)
		- [`Show Current Editor Group in Manual Mode`](#show-current-editor-group-in-manual-mode)
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
- [Bug Reports and Feature Requests](#bug-reports-and-feature-requests)

---

# Overview

In VSCode, built-in features like `Go to Definition` and `Go to Type Definition` open the target "Definition" within the same editor group[^1]. This can cause you to lose sight of your current code or definition.

This extension provides functionality to open "Definitions" in an adjacent editor group instead.  

[^1]: In this document, the term "pane" may be used interchangeably.

![demo](https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/demo.gif)


## How to Use

This extension features two modes for determining the destination editor group when using the `Go to ...` command: an "Automatic Selection Mode," which automatically decides the editor group and is accessed via the `Open in Side Group` menu, and a "Manual Selection Mode," which allows you to specify an editor group number and is accessed via the `Open with Group No.` menu.

By default, only the "Automatic Selection Mode" is enabled, but you can use the "Manual Selection Mode" exclusively or in conjunction with the automatic mode.

### Automatic Mode (Default)

Once installed, a submenu called `Open in Side Group` will be added to the context menu when you right-click on a function or type.

Simply select `Go to Definition`, `Go to Type Definition`, or similar options from this submenu.

<div align="center"><img src="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png" srcset="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/sub-menu.png 2x" width="420"></div>


### Manual Selection Mode

If you check `Show Open With Group No Menu` in the configuration, the `Open with Group No.` menu will specifically appear in the context menu, allowing you to manually select the editor group for opening with `Go to ...`.

<div align="center"><img src="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/manual-selection-mode.png" srcset="https://tettekete.github.io/vscode-open-definition-in-side-group-extension/images/manual-selection-mode.png 2x" width="517"></div>

To hide the default automatic mode, uncheck the `Show Open In Side Group Menu` item in the configuration.


# Configuration Options

## Automatic Mode

### `Show Open In Side Group Menu`

**Config ID**: `open-definition-in-side-group.showOpenInSideGroupMenu`

This checkbox specifies whether to display the `Show Open In Side Group` menu item in the context menu. The default setting is ON.

The `Show Open In Side Group` menu is for the mode that automatically decides the editor group to open when using `Go to ...`. It automatically determines the destination editor group based on the group numbers allowed by the config item `Allow View Columns`.



### `Allow View Columns`

**Config ID:** `open-definition-in-side-group.allowViewColumns`

Specifies the `viewColumn` numbers where definitions are allowed to be displayed. Multiple numbers can be set, separated by commas.

The default setting is `1,2,3`.

For example, if you always work in a three-pane mode and want definitions to appear exclusively in the third pane, set this value to `3`.

Alternatively, setting it to `2,3` will attempt to alternate between the second and third panes when displaying definitions.

#### How to Check `viewColumn` Numbers

You can check the `viewColumn` number of the active editor by running the command `OpenDefinitionInSideGroup: Check the viewColumn number of the active editor` from the command palette. The `viewColumn` number will be displayed in the status bar for a short period.


## Manual Selection Mode

### `Show Open With Group No. Menu`

**Config ID**: `open-definition-in-side-group.showOpenWithGroupNoMenu`

This checkbox determines whether to display the `Open with Group No.` menu item in the context menu. The default setting is OFF.

The `Open with Group No.` menu appears as a submenu under the `Go to ...` item, allowing you to choose the editor group number where you want to open the destination.


### `Show Current Editor Group in Manual Mode`

**Config ID**: `open-definition-in-side-group.showCurrentGroupInManualMode`

This checkbox specifies whether to include the current editor group number in the opening destination list when `Show Open With Group No. Menu` is ON.

Since the concept of this extension is to "open definitions in the side," the default setting is OFF.



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


# Bug Reports and Feature Requests

If you encounter any bugs or have any suggestions, please let us know by [submitting an issue on our GitHub page](https://github.com/tettekete/vscode-open-definition-in-side-group-extension/issues).

