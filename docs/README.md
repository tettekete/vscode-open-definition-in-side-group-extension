**Table of Contents**

- [Overview](#overview)
	- [How to Use](#how-to-use)
- [Configuration Options](#configuration-options)
	- [`Allow View Columns`](#allow-view-columns)
		- [How to Check `viewColumn` Numbers](#how-to-check-viewcolumn-numbers)
- [Known Issues](#known-issues)
	- [Behavior of `Go to Source Definition`](#behavior-of-go-to-source-definition)
	- [`Open in Side Group` Submenu Appearing in Non-Programming Languages](#open-in-side-group-submenu-appearing-in-non-programming-languages)

---

# Overview

In VSCode, built-in features like `Go to Definition` and `Go to Type Definition` open the target "Definition" within the same tab group[^1]. This can cause you to lose sight of your current code or definition.

This extension provides functionality to open "Definitions" in an adjacent tab group instead.  

[^1]: In this document, the term "pane" may be used interchangeably.



## How to Use

Once installed, a submenu called `Open in Side Group` will be added to the context menu when you right-click on a function or type.

Simply select `Go to Definition`, `Go to Type Definition`, or similar options from this submenu.



# Configuration Options

## `Allow View Columns`

**Config ID:** `open-definition-in-side-group.allowViewColumns`

Specifies the `viewColumn` numbers where definitions are allowed to be displayed. Multiple numbers can be set, separated by commas.

The default setting is `1,2,3`.

For example, if you always work in a three-pane mode and want definitions to appear exclusively in the third pane, set this value to `3`.

Alternatively, setting it to `2,3` will attempt to alternate between the second and third panes when displaying definitions.

### How to Check `viewColumn` Numbers

You can check the `viewColumn` number of the active editor by running the command `OpenDefinitionInSideGroup: Check the viewColumn number of the active editor` from the command palette. The `viewColumn` number will be displayed in the status bar for a short period.


# Known Issues

## Behavior of `Go to Source Definition`

Currently, there is no built-in VSCode command that behaves exactly like `Go to Source Definition`. As a result, this extension's implementation of `Go to Source Definition` will behave similarly to `Go to Definition` in most cases.

## `Open in Side Group` Submenu Appearing in Non-Programming Languages

Ideally, the `Open in Side Group` submenu should not appear when opening the context menu in non-programming language editors. However, it currently appears regardless of the file type.

This is due to an issue where trying to conditionally hide the menu causes instability in its visibility[^2]. 

After considering the trade-offs, we decided that ensuring the `Open in Side Group` option is always available is more beneficial for users. 

Thus, this behavior is intentional and considered part of the extension's design.

[^2]: The primary reason for this instability is that when switching editors, the language server may not have finished its analysis yet, leading to incorrect detection of definition availability.