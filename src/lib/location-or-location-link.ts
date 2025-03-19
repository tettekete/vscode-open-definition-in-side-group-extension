import * as vscode from 'vscode';
import type { UriRangeRec } from '../types';

export type LocationOrLocationLink = vscode.Location | vscode.LocationLink;

export function isVSCLocation( location: LocationOrLocationLink ): location is vscode.Location
{
	return Object.hasOwn( location , 'range' )
			&& Object.hasOwn( location , 'uri' );
}

export function isVSCLocationLink( location: LocationOrLocationLink ): location is vscode.LocationLink
{
	return Object.hasOwn( location , 'targetRange' )
			&& Object.hasOwn( location , 'targetUri' );
}


export function getUriRangeFromLocationOrLocationLink( location:LocationOrLocationLink )
:UriRangeRec
{
	let uri: vscode.Uri;
	let range: vscode.Range;

	if( isVSCLocation( location ) )
	{
		uri		= location.uri;
		range	= location.range;
	}
	else
	{
		uri		= location.targetUri;
		range	= location.targetRange;
	}

	return { uri , range };
}