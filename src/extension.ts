import * as vscode from 'vscode';

import { openDefinitionInSidePane } from './open-definition';

export function activate(context: vscode.ExtensionContext) {


	const openDefinition = vscode.commands.registerCommand(
		'open-definition-in-side-group.openDefinitionInSidePane',
		openDefinitionInSidePane
	);

	context.subscriptions.push(openDefinition);
}

export function deactivate() {}
