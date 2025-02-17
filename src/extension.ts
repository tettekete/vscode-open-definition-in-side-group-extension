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
		openReference
	);
}

export function deactivate() {}
