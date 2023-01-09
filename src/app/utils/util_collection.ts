export const getAssetFile = async (pathInAssetFolder: string, name: string, type: string): Promise<File> => {
	const response = await fetch(`../assets/${pathInAssetFolder}`);
	const data = await response.blob();
	const metadata = {
		type,
	};
	return new File([data], name, metadata);
};

export const compare = (val1: number, val2: number): number => ((val1 ?? 0) > (val2 ?? 0) ? 1 : -1);
