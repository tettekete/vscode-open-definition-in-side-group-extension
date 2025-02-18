import * as vscode from 'vscode';

import { VSCConfig } from './vsc-config';
import { intersection } from './utils';

let lastResolvedNo = 0;

export function resetLastResolvedNo()
{
	lastResolvedNo = 0;
}

export function getViewColumnForOpen():vscode.ViewColumn
{
	// get displayed columns
	const displayedGroupSet:Set<number> = new Set<number>();
	vscode.window.tabGroups.all.forEach( ( tab ) =>
	{
		if( tab.viewColumn > 0 )
		{
			displayedGroupSet.add( tab.viewColumn );
		}
	});

	if( displayedGroupSet.size <= 1 )
	{
		return vscode.ViewColumn.Beside;
	}

	// get current view column
	const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
	if( activeTab === undefined )
	{
		return vscode.ViewColumn.One;
	}
	const activeViewColumn = activeTab.group.viewColumn;
	

	// allowed by config
	const allowViewColumns = VSCConfig.allowViewColumns();
	const allowedSet:Set<number> = new Set<number>( allowViewColumns );

	const intersectViews = intersection( displayedGroupSet ,allowedSet );

	if( intersectViews.size === 0 )
	{
		return vscode.ViewColumn.Beside;
	}

	// ----
	// Determine which columns should be displayed
	const candidateColumns = [...intersectViews].sort( (a:number,b:number) => a - b );
	let resolvedNo = 0;
	let baseViewColumn = activeViewColumn;

	if( lastResolvedNo && ! candidateColumns.includes( activeViewColumn ))
	{
		baseViewColumn = lastResolvedNo;
	}

	for(const candidateColumnNo of candidateColumns )
	{
		if( baseViewColumn < candidateColumnNo )
		{
			lastResolvedNo = candidateColumnNo;
			return candidateColumnNo;
		}
	}

	if( ! resolvedNo )
	{
		resolvedNo = candidateColumns[0];
	}

	lastResolvedNo = resolvedNo;
	return resolvedNo;
}