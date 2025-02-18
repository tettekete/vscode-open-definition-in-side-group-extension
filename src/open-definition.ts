import * as vscode from 'vscode';

import { getViewColumnForOpen } from './lib/decide-view-column';
import { getActiveTextEditorForTabGroup } from './lib/utils';
import type { ValidProviderCommands } from './constants';
import { HightLightBox } from './lib/hight-light-box';
import { sleep } from './lib/sleep';

import type { LocationOrLocationLink } from './lib/location-or-location-link';
import { getUriRangeFromLocationOrLocationLink } from './lib/location-or-location-link';


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

	{
	}
	{
	}

	const targetViewColumn = getViewColumnForOpen();

	console.debug(`targetViewColumn: ${targetViewColumn}`);
	console.debug(`theUri: ${theUri}`);
	
	const r = getUriRangeFromLocationOrLocationLink( locations[0] );
	let theUri: vscode.Uri = r.uri;
	let theRange: vscode.Range = r.range;

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
		// set cursor pos
		defineEditor.revealRange(
			theRange,
			vscode.TextEditorRevealType.Default
		);

		const newSelection = new vscode.Selection(
				theRange.start,
				theRange.start
			);
		defineEditor.selection = newSelection;

		// Show HightLightBox
		HightLightBox.show({
			editor: defineEditor,
			range: theRange,
			// timeOut: 0.4,
			// opacityDelta: 0.1
		});
	}

	return true;
}