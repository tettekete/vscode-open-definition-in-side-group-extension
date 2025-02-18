import * as fs from 'fs/promises';
import * as vscode from 'vscode';
import { getUriRangeFromLocationOrLocationLink } from './location-or-location-link';
import type { LocationOrLocationLink } from './location-or-location-link';


interface LocationTextEntry
{
	rangeText: string;
	uri: vscode.Uri
	range: vscode.Range
};

async function readTextFromRange( location: LocationOrLocationLink): Promise<LocationTextEntry>
{
	const { uri , range } = getUriRangeFromLocationOrLocationLink( location );

	try
	{
		const data = await fs.readFile( uri.fsPath, { encoding: 'utf8' } );
		const lines = data.split(/\r?\n/);

		const text = lines.slice(range.start.line, range.end.line + 1)
			.map((line, idx) => {
				if( idx === 0 && range.start.line === range.end.line )
				{
					return line.substring(range.start.character, range.end.character);
				}
				else if( idx === 0 )
				{
					return line.substring(range.start.character);
				}
				else if( idx === range.end.line - range.start.line )
				{
					return line.substring(0, range.end.character);
				}
				return line;
			}).join('\n');

		return {
			rangeText: text,
			uri,
			range
		};
	}
	catch( error )
	{
		console.error('Error reading file or extracting range:', error);
		return {
			rangeText: '',
			uri,
			range
		};
	}
}


export async function getLocationTextEntries( locations: LocationOrLocationLink[]): Promise<LocationTextEntry[]>
{
    return Promise.all(
		locations.map(
			( location ) =>
			{
				return readTextFromRange( location );
			}
		)
	);
}

