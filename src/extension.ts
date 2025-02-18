import * as vscode from 'vscode';

import { openDefinitionInSidePane } from './open-definition';
import {
	kCmdExecuteDefinitionProvider,
	kCmdExecuteTypeDefinitionProvider,
	kCmdExecuteDeclarationProvider,
	kCmdExecuteImplementationProvider,
	kCmdExecuteReferenceProvider
} from './constants';

import { HightLightBox } from './lib/hight-light-box';

export function activate(context: vscode.ExtensionContext) {

	// Go to Definition
	const openDefinition = vscode.commands.registerCommand(
		'open-definition-in-side-group.openDefinitionInSidePane',
		() =>
		{
			openDefinitionInSidePane( kCmdExecuteDefinitionProvider );
		}
	);

	// Go to Type Definition
	const openTypeDefinition = vscode.commands.registerCommand(
		'open-definition-in-side-group.openTypeDefinitionInSidePane',
		() =>
		{
			openDefinitionInSidePane( kCmdExecuteTypeDefinitionProvider );
		}
	);

	// Go to Source Definition
	const openDeclaration = vscode.commands.registerCommand(
		'open-definition-in-side-group.openDeclarationInSidePane',
		async () =>
		{
			if(! await openDefinitionInSidePane( kCmdExecuteDeclarationProvider ) )
			{
				openDefinitionInSidePane( kCmdExecuteDefinitionProvider );
			}
		}
	);

	// Go to Implementations
	const openImplementation = vscode.commands.registerCommand(
		'open-definition-in-side-group.openImplementationInSidePane',
		() =>
		{
			openDefinitionInSidePane( kCmdExecuteImplementationProvider );
		}
	);

	// Go to References
	const openReference = vscode.commands.registerCommand(
		'open-definition-in-side-group.openReferenceInSidePane',
		() =>
		{
			openDefinitionInSidePane( kCmdExecuteReferenceProvider );
		}
	);

	const showViewColumn = vscode.commands.registerCommand(
		'open-definition-in-side-group.showViewColumn',
		() =>
		{
			const editor = vscode.window.activeTextEditor;
			let message = '';
			if(! editor )
			{
				message = 'There are no active text editor.';
			}
			else
			{
				message = `viewColumn is ${editor.viewColumn}`;
			}

			vscode.window.setStatusBarMessage( message , 5000 );
		}
	);

	// Register event listeners to hide the HighlightBox on click or cursor position change.
	vscode.window.onDidChangeTextEditorSelection( ( event ) =>
		{
			HightLightBox.disposeIfSameEditor( event.textEditor );
		}
		,null
		,context.subscriptions
	);

	context.subscriptions.push(
		openDefinition,
		openTypeDefinition,
		openDeclaration,
		openImplementation,
		openReference,
		showViewColumn
	);
}

export function deactivate() {}
