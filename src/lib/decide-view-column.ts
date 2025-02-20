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
	let candidateColumns: number[] = [];

	// Narrowing down the candidate view
	const tasks = [
		()=>{return [...intersectViews].sort( (a:number,b:number) => a - b );},
		()=>{return candidateColumns.filter( no => no !== activeViewColumn );},
		()=>{return candidateColumns.filter( no => no !== lastResolvedNo );},
	];

	for(const task of tasks )
	{
		candidateColumns = task();
		if( candidateColumns.length === 1 )
		{
			return lastResolvedNo = candidateColumns[0];
		}
	}

	// Determine the next view for display based on either lastResolvedNo or activeViewColumn.
	let baseViewColumn = activeViewColumn;
	if( lastResolvedNo )
	{
		baseViewColumn = lastResolvedNo;
	}

	let resolvedNo = 0;
	for(const candidateColumnNo of candidateColumns )
	{
		if( baseViewColumn < candidateColumnNo )
		{
			return lastResolvedNo = candidateColumnNo;;
		}
	}

	if( ! resolvedNo )
	{
		resolvedNo = candidateColumns[0];
	}

	return lastResolvedNo = resolvedNo;
}
