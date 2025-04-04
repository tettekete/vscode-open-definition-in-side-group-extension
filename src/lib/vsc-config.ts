
import * as vscode from 'vscode';

export class VSCConfig
{
	static #config = vscode.workspace.getConfiguration();


	// - - - - - - - - - - - - - - - - - - - -
	// allowViewColumns: number[]
	// - - - - - - - - - - - - - - - - - - - -
	static allowViewColumns( fallback?: number[] ):number[]
	{
		let _fallback = [1,2];
		if( fallback )
		{
			_fallback = fallback;
		}

		const config = VSCConfig._stringConfig(
			'open-definition-in-side-group.allowViewColumns'
		);

		if( config === undefined )
		{
			return _fallback;
		}
		
		const allowNumRegex = /^[1-9]$/;
		const filtered = config.split(/\D/).filter((item)=>
		{
			return allowNumRegex.test( item );
		});

		if( filtered )
		{
			const numList: number[] = [];
			filtered.forEach(( item ) =>
			{
				numList.push( Number( item ) );
			});

			if( numList.length > 0 )
			{
				return numList;
			}			
		}

		return _fallback;
		
	}


	static showCurrentGroupInManualMode( fallback: boolean = false ): boolean
	{
		const config	= VSCConfig._booleanConfig(
							'open-definition-in-side-group.showCurrentGroupInManualMode'
						);

		if( config === undefined )
		{
			return fallback;
		}

		return config;
	}

	static _stringConfig( configName: string , fallback?: string ):string | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<string>( configName );
		
		if( value === undefined && typeof fallback === 'string' )
		{
			return fallback;
		}

		return value;
	}

	static _numberConfig( configName: string , fallback?:number ):number | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<number>( configName );
		
		if( value === undefined && typeof fallback === 'number' )
		{
			return fallback;
		}
		return value;
	}

	static _booleanConfig( configName: string , fallback?:boolean ):boolean | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
		
		if( value  === undefined && typeof fallback === 'boolean' )
		{
			return fallback;
		}
		return value;
	}
}