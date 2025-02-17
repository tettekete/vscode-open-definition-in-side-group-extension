import * as vscode from 'vscode';

export class HightLightBox
{
	static #textEditorDecoration:vscode.TextEditorDecorationType | undefined;
	static #timeOut: NodeJS.Timeout;
	static #displayEditor: vscode.TextEditor | undefined;
	static #showTime: number = 0;

	static dispose()
	{
		if( HightLightBox.#textEditorDecoration )
		{
			HightLightBox.#textEditorDecoration.dispose();
		}

		clearTimeout( HightLightBox.#timeOut );
		HightLightBox.#displayEditor = undefined;
		HightLightBox.#showTime = 0;
	}


	static disposeIfSameEditor( editor:vscode.TextEditor )
	{
		if( editor === HightLightBox.#displayEditor )
		{
			HightLightBox.dispose();
		}
	}


	private static _setTextEditorDecoration( decoration: vscode.TextEditorDecorationType ):vscode.TextEditorDecorationType
	{
		HightLightBox.dispose();
		HightLightBox.#textEditorDecoration = decoration;
		return HightLightBox.#textEditorDecoration;
	}


	static show(
		{
			editor
			,range
			,timeOut
			,opacityDelta
			,autoPartialLine = true
		}:
		{
			editor?: vscode.TextEditor;
			range: vscode.Range;
			timeOut?: number;
			opacityDelta?: number;
			autoPartialLine?: boolean
		}
	)
	{
		HightLightBox.dispose();

		// validation
		editor ??= vscode.window.activeTextEditor;
		if( ! editor )
		{
			return;
		}

		if( opacityDelta !== undefined )
		{
			if( opacityDelta < 0 || opacityDelta > 1.0 )
			{
				console.error("opacityDelta should be minus number that 0 < number < 1.0");
				return;
			}
		}

		let isWholeLine = true;
		if( autoPartialLine )
		{
			if( range.start.line === range.end.line )
			{
				isWholeLine = false;
			}
		}

		// display process
		if( timeOut === undefined )
		{
			HightLightBox._showHightLightBox({
				editor,
				range,
				isWholeLine
			});
		}
		else if( opacityDelta )
		{
			HightLightBox._showWithFadeOutOpacity({
				editor,
				range,
				isWholeLine,
				timeOut,
				opacityDelta
			});
		}
		
	}

	
	/**
	 * A method prepared to determine whether the onDidChangeTextEditorSelection
	 * event should execute disposeIfSameEditor.
	 *
	 * The onDidChangeTextEditorSelection event is fired when the UI is actually
	 * updated, not when there is a change in TextEditor.selection.
	 * 
	 * In other words, even if you perform the display processing for the HightLightBox
	 * immediately after updating TextEditor.selection, the cursor movement event
	 * will occur in the UI update immediately after that, and the HightLightBox
	 * will disappear immediately.
	 * 
	 * By returning whether the HightLightBox is fresh or not, you can determine
	 * whether to call disposeIfSameEditor() in the event callback.
	 * 
	 *
	 * @static
	 * @returns {boolean} 
	 */
	static isFreshBox()
	{
		if( Date.now() - HightLightBox.#showTime > 100 )
		{
			HightLightBox.#showTime = 0;
		}

		if( ! HightLightBox.#showTime )
		{
			return false;
		}

		HightLightBox.#showTime = 0;

		return true;
	}


	private static _showHightLightBox(
		{
			editor,
			range,
			isWholeLine
		}:
		{
			editor: vscode.TextEditor;
			range: vscode.Range;
			isWholeLine: boolean;
		}
	)
	{
		const highlightBox = vscode.window.createTextEditorDecorationType(
			{
				backgroundColor: new vscode.ThemeColor('editor.selectionBackground'),
				isWholeLine
			}
		);

		HightLightBox._setDecorations( editor , range , highlightBox );
		HightLightBox.#showTime = Date.now();
	}


	private static _showWithFadeOutOpacity(
		{
			editor,
			range,
			isWholeLine,
			timeOut,
			opacityDelta
		}:
		{
			editor: vscode.TextEditor;
			range: vscode.Range;
			isWholeLine: boolean;
			timeOut: number;
			opacityDelta: number;
		}
	)
	{
		let opacity = 0;
		const interval = 1000 * timeOut / (1 / opacityDelta );
		const decorationBuilder = ( _opacity:number ) =>
		{
			return vscode.window.createTextEditorDecorationType(
				{
					backgroundColor: new vscode.ThemeColor('editor.selectionBackground'),
					isWholeLine,
					opacity: `${opacity}`
				}
			);
		};

		const transition = ( fin:boolean = false ) =>
		{
			const highlightBox = decorationBuilder( opacity );
			HightLightBox._setDecorations( editor , range , highlightBox );

			opacity += Math.abs( opacityDelta );
			opacity = Math.floor( opacity * 100 ) / 100;

			if( fin )
			{
				HightLightBox.dispose();
				return;
			}

			if( opacity < 1.0 )
			{
				HightLightBox.#timeOut = setTimeout( transition , interval );
			}
			else
			{
				HightLightBox.#timeOut = setTimeout( ()=>{transition(true)} , interval );
			}	
		};

		HightLightBox.#showTime = Date.now();
		
		transition();
	}

	private static _setDecorations(
		editor: vscode.TextEditor
		,range: vscode.Range
		,decoration: vscode.TextEditorDecorationType
	)
	{
		editor.setDecorations(
			HightLightBox._setTextEditorDecoration( decoration )
			,[range]
		);

		HightLightBox.#displayEditor = editor;
	}
}
