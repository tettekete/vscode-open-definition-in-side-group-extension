
export const kCmdExecuteDefinitionProvider		= 'vscode.executeDefinitionProvider';
export const kCmdExecuteTypeDefinitionProvider	= 'vscode.executeTypeDefinitionProvider';
export const kCmdExecuteDeclarationProvider		= 'vscode.executeDeclarationProvider';
export const kCmdExecuteImplementationProvider	= 'vscode.executeImplementationProvider';
export const kCmdExecuteReferenceProvider		= 'vscode.executeReferenceProvider';

export const ValidProviderCommands = [
	kCmdExecuteDefinitionProvider,
	kCmdExecuteTypeDefinitionProvider,
	kCmdExecuteDeclarationProvider,
	kCmdExecuteImplementationProvider,
	kCmdExecuteReferenceProvider
] as const;

export type ValidProviderCommands = (typeof ValidProviderCommands)[number];
