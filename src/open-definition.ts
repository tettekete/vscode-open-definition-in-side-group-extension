import * as vscode from 'vscode';

import { getViewColumnForOpen } from './lib/decide-view-column';
import {
	getActiveTextEditorForTabGroup,
	findWorkspaceFolder
} from './lib/utils';
import type { ValidProviderCommands } from './constants';
import { HightLightBox } from './lib/hight-light-box';

import type { LocationOrLocationLink } from './lib/location-or-location-link';
import { getUriRangeFromLocationOrLocationLink } from './lib/location-or-location-link';
import path from 'node:path';


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

	const targetViewColumn = getViewColumnForOpen();
	let openedViewColumn = targetViewColumn;
	if( targetViewColumn === vscode.ViewColumn.Beside )
	{
		openedViewColumn = ((vscode.window.tabGroups.activeTabGroup.viewColumn - 1) % 8) + 1;
	}

	if( locations.length > 1 )
	{
		navigateWithQuickPick({ locations ,viewColumn: openedViewColumn });
		return true;
	}
	
	const r = getUriRangeFromLocationOrLocationLink( locations[0] );
	let theUri: vscode.Uri = r.uri;
	let theRange: vscode.Range = r.range;

	const cursorPosRange = new vscode.Range( theRange.start, theRange.start );
	await vscode.window.showTextDocument(
		theUri,
		{
			viewColumn: targetViewColumn,
			selection: cursorPosRange,
		}
	);

	// Scroll to definition pos
	const defineEditor = getActiveTextEditorForTabGroup( openedViewColumn );
	if( defineEditor )
	{
		// Show HightLightBox
		HightLightBox.show({
			editor: defineEditor,
			range: theRange
		});
	}

	return true;
}

interface RefQuicPickItem extends vscode.QuickPickItem
{
	uri: vscode.Uri
	range: vscode.Range
}

async function navigateWithQuickPick(
	{
		locations,
		viewColumn
	}:
	{
		locations: LocationOrLocationLink[];
		viewColumn: vscode.ViewColumn;
	}
)
{
	const qpItems:RefQuicPickItem[] = [];

	const uriRangeList = locations.map((location) =>
	{
		return getUriRangeFromLocationOrLocationLink( location );
	});
	
	for( const entry of uriRangeList )
	{
		const workspaceFolder = findWorkspaceFolder( entry.uri.fsPath );
		let relPath:string;
		if( workspaceFolder )
		{
			relPath = path.relative( workspaceFolder , entry.uri.fsPath );
		}
		else
		{
			relPath = path.basename( entry.uri.fsPath );
		}

		const label = relPath;

		const description = `Line: ${entry.range.start.line}`;

		qpItems.push(
			{
				label,
				description,
				uri: entry.uri,
				range: entry.range
			}
		);
	}

	const quickPick = vscode.window.createQuickPick<RefQuicPickItem>();
	quickPick.items = qpItems;

	// define preview callback
	quickPick.onDidChangeActive((selectedItems) =>
		{
			const selection = selectedItems[0];
			if( selection )
			{
				previewLocation( viewColumn , selection );
			}
		}
	);

	// define callback on decision by user
	quickPick.onDidAccept(()=>
		{
			quickPick.hide();
		}
	);

	// define callback in canceled by user
	quickPick.onDidHide(() =>
		{
			quickPick.dispose();
		}
	);

	// show QuickPick
	quickPick.show();
}


async function previewLocation( viewColumn:vscode.ViewColumn , refQPItem: RefQuicPickItem )
{
	const cursorRange = new vscode.Range( refQPItem.range.start , refQPItem.range.start );
	await vscode.window.showTextDocument( refQPItem.uri ,
	{
		viewColumn,
		selection: cursorRange,
		preview: true,
		preserveFocus: true
	});

	const defineEditor = getActiveTextEditorForTabGroup( viewColumn );
	if( defineEditor )
	{
		// Show HightLightBox
		HightLightBox.show({
			editor: defineEditor,
			range: refQPItem.range
		});
	}
}
