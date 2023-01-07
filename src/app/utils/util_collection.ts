export const getAssetFile = async (pathInAssetFolder: string, name: string, type: string): Promise<File> => {
	let response = await fetch(`../assets/${pathInAssetFolder}`);
	let data = await response.blob();
	let metadata = {
		type: type,
	};
	return new File([data], name, metadata);
};
