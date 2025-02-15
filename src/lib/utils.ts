import * as vscode from 'vscode';

// The intersection of Set is not implemented even in ES2024.
export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T>
{
	return new Set([...setA].filter(item => setB.has(item)));
}


/**
 * Returns the vscode.TextEditor object active in the specified tagGroup = viewColumn.
 *
 * Returns undefined if not found.
 *
 * @export
 * @param {vscode.ViewColumn} viewColumn 
 * @returns {(vscode.TextEditor | undefined)} 
 */
export function getActiveTextEditorForTabGroup( viewColumn: vscode.ViewColumn ): vscode.TextEditor | undefined
{
	// Get the active tab of the target tag group = ViewColumn
	let targetTab:vscode.Tab | undefined;
	for(const tagGroup of vscode.window.tabGroups.all )
	{
		if( tagGroup.viewColumn === viewColumn )
		{
			targetTab = tagGroup.activeTab;
			break;
		}
	}

	if( targetTab === undefined )
	{
		// Basically, it's impossible.
		return undefined;
	}

	let pathString: string | undefined = undefined;
	if( targetTab.input !== null
	 && typeof targetTab.input === 'object'
	 && 'uri' in targetTab.input )
	{
		pathString = (targetTab.input as {uri: vscode.Uri }).uri.toString();
	}

	if( pathString === undefined )
	{
		return undefined;
	}
	
	return findTextEditorWithViewColumnAndPathString( viewColumn , pathString );
	
}


/**
 * Returns a vscode.TextEditor object matching viewColumn and pathString =
 * uri.toString().
 * 
 * If not found, returns undefined.
 *
 * @param {vscode.ViewColumn} viewColumn 
 * @param {string} pathString 
 * @returns {(vscode.TextEditor | undefined)} 
 */
function findTextEditorWithViewColumnAndPathString(
	viewColumn: vscode.ViewColumn,
	pathString: string
):vscode.TextEditor | undefined
{
	const foundEditor = vscode.window.visibleTextEditors.find((textEditor: vscode.TextEditor ) =>
	{
		return textEditor.viewColumn === viewColumn
		&& textEditor.document.uri.toString() === pathString;
	});

	return foundEditor;
}