import * as vscode from 'vscode';

import {
	openDefinitionInSidePane,
	openDefinitionWithViewNo
} from './open-definition';
import {
	kCmdExecuteDefinitionProvider,
	kCmdExecuteTypeDefinitionProvider,
	kCmdExecuteDeclarationProvider,
	kCmdExecuteImplementationProvider,
	kCmdExecuteReferenceProvider
} from './constants';

import type { ValidProviderCommands } from './constants';

import { HightLightBox } from './lib/hight-light-box';
import { resetLastResolvedNo } from './lib/decide-view-column';
import { VSCConfig } from './lib/vsc-config';

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
	const editorSelectionChangedListener = vscode.window.onDidChangeTextEditorSelection( ( event ) =>
		{
			HightLightBox.disposeIfSameEditor( event.textEditor );
		}
		,null
		,context.subscriptions
	);

	// reset last resolved viewColumn No.
	const configChangedListener = vscode.workspace.onDidChangeConfiguration((event)=>
	{
		if( event.affectsConfiguration('open-definition-in-side-group.allowViewColumns') )
		{
			resetLastResolvedNo();
		}
	});

	const openDefinitions = [];
	{
		const commandData = [
			{
				baseName: 'Definition',
				providerCommand: kCmdExecuteDefinitionProvider as ValidProviderCommands
			},
			{
				baseName: 'TypeDefinition',
				providerCommand: kCmdExecuteTypeDefinitionProvider as ValidProviderCommands
			},
			{
				baseName: 'Declaration',
				providerCommand: kCmdExecuteDeclarationProvider as ValidProviderCommands
			},
			{
				baseName: 'Implementation',
				providerCommand: kCmdExecuteImplementationProvider as ValidProviderCommands
			},
			{
				baseName: 'Reference',
				providerCommand: kCmdExecuteReferenceProvider as ValidProviderCommands
			}
		];
		
		for(let i = 1;i<=9; i++)
		{
			for(const props of commandData )
			{
				const commandID = `tettekete.open-definition-in-side-group.open${props.baseName}WithNo${i}`;

				openDefinitions.push(
					vscode.commands.registerCommand(
						commandID,
						() =>
						{
							console.log(`${commandID} called with ${props.providerCommand}`);
							const viewNo = i;
							openDefinitionWithViewNo(
								{
									providerCommand: props.providerCommand ,
									viewNo
								}
							);
						}
					)
				);
			}
			
		}
	}
	

	const onDidChangeVisibleTextEditors = vscode.window.onDidChangeVisibleTextEditors(( editors )=>
		{
			setTimeout(()=>
				{
					updateContextOfDisplayedViewColumns();
				},
				500
			);

			/*
				Neither the editors argument, vscode.window.tabGroups.all, nor the result
				of collecting viewColumn values via vscode.window.visibleTextEditors.forEach
				return the correct state when a tab group is closed or when a tab is split
				upwards using Split Up.

				Various solutions were attempted, but the only effective way to work around
				this VSCode API issue was to use setTimeout, so execution is delayed accordingly.
			*/
			
		}
	);

	const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(( editor )=>
		{
			console.debug(`## onDidChangeActiveTextEditor`);
			console.debug(`- uri: ${editor ? editor.document.uri.toString() : 'undefined'}`);
			console.debug(`- viewColumn: ${editor ? editor.viewColumn : 'undefined' }`);
			updateContextOfActiveViewColumn( editor );
			updateContextOfDisplayedViewColumns();
		}
	);

	updateContextOfDisplayedViewColumns();
	updateContextOfActiveViewColumn();

	context.subscriptions.push(
		openDefinition,
		openTypeDefinition,
		openDeclaration,
		openImplementation,
		openReference,
		showViewColumn,
		editorSelectionChangedListener,
		configChangedListener,
		...openDefinitions,
		onDidChangeVisibleTextEditors,
		onDidChangeActiveTextEditor,
	);
}

export function deactivate() {}

function updateContextOfDisplayedViewColumns( editors?: readonly vscode.TextEditor[] )
{
	const displayedGroupSet:Set<number> = new Set<number>();

	vscode.window.tabGroups.all.forEach( ( tab ) =>
		{
			if( tab.viewColumn > 0 )
			{
				displayedGroupSet.add( tab.viewColumn );
			}
		}
	);

	for( let i=1;i<=9;i++ )
	{
		const contextKey = `viewColumn_${i}_Opened`;
		const isOpened = displayedGroupSet.has( i ) ? true : false;

		vscode.commands.executeCommand('setContext', contextKey, isOpened);
	}
}

function updateContextOfActiveViewColumn( editor?: vscode.TextEditor | undefined )
{
	let activeViewColumn = vscode.window.tabGroups.activeTabGroup.viewColumn;
	if( editor !== undefined && editor.viewColumn !== undefined )
	{
		activeViewColumn = editor.viewColumn;
	}

	const showCurrentGroupInManualMode =  VSCConfig.showCurrentGroupInManualMode();

	console.debug(`activeViewColumn: ${activeViewColumn}`);

	for( let i=1;i<=9;i++ )
	{
		const contextKey = `isViewColumn_${i}_Active`;
		const isActive = showCurrentGroupInManualMode ?
							false:
							activeViewColumn === i ?
								true :
								false;
		vscode.commands.executeCommand('setContext', contextKey, isActive);
	}

}
