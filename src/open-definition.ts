import * as vscode from 'vscode';

import { getViewColumnForOpen } from './lib/decide-view-column';
import { getActiveTextEditorForTabGroup } from './lib/utils';
import type { ValidProviderCommands } from './constants';

type LocationOrLocationLink = vscode.Location | vscode.LocationLink;

function isVSCLocation( location: LocationOrLocationLink ): location is vscode.Location
{
	return Object.hasOwn( location , 'range' )
			&& Object.hasOwn( location , 'uri' );
}

function isVSCLocationLink( location: LocationOrLocationLink ): location is vscode.LocationLink
{
	return Object.hasOwn( location , 'targetRange' )
			&& Object.hasOwn( location , 'targetUri' );
}

export async function openDefinitionInSidePane( providerCommand: ValidProviderCommands ):Promise<boolean>
{
	const editor = vscode.window.activeTextEditor;
	if( !editor ){ return false;}

	// 定義の位置を取得
	const locations: LocationOrLocationLink[] | undefined = await vscode.commands.executeCommand(
		providerCommand,
		editor.document.uri,
		editor.selection.active
	);

	if( ! locations || locations.length <= 0 ) {
		return false;
	}

	
	let theUri: vscode.Uri;
	let theRange: vscode.Range;

	if( isVSCLocation( locations[0] ) )
	{
		theUri		= locations[0].uri;
		theRange	= locations[0].range;
	}
	else if( isVSCLocationLink( locations[0] ) )
	{
		theUri		= locations[0].targetUri;
		theRange	= locations[0].targetRange;
	}
	else
	{
		return false;
	}

	const targetViewColumn = getViewColumnForOpen();

	console.debug(`targetViewColumn: ${targetViewColumn}`);
	console.debug(`theUri: ${theUri}`);

	await vscode.commands.executeCommand(
		'vscode.open',
		theUri,
		{
			viewColumn: targetViewColumn
		}
	);


	// Scroll to definition pos
	let openedViewColumn = targetViewColumn;
	if( targetViewColumn === vscode.ViewColumn.Beside )
	{
		openedViewColumn = ((vscode.window.tabGroups.activeTabGroup.viewColumn - 1) % 8) + 1;

		console.debug( `openedViewColumn: ${openedViewColumn}` );
	}

	const defineEditor = getActiveTextEditorForTabGroup( openedViewColumn );
	if( defineEditor )
	{
		defineEditor.revealRange(
			theRange,
			vscode.TextEditorRevealType.Default
		);

		const newSelection = new vscode.Selection(
				theRange.start,
				theRange.start
			);
		defineEditor.selection = newSelection;
	}

	return true;
}