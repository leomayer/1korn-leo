import { FoodFileColStructure } from '../main-overview/abgleich/foodsoft-article/foodsoft-article';

export const getAssetFile = async (pathInAssetFolder: string, name: string, type: string): Promise<File> => {
	const response = await fetch(`../assets/${pathInAssetFolder}`);
	const data = await response.blob();
	const metadata = {
		type,
	};
	return new File([data], name, metadata);
};

export const compare = (field1: FoodFileColStructure<unknown>, field2: FoodFileColStructure<unknown>): number => {
	const val1 = field1.cValue;
	const val2 = field2.cValue;
	if (typeof val1 === 'string' || typeof val2 === 'string') {
		return ((val1 as string) ?? '').localeCompare((val2 as string) ?? '');
	} else {
		if ((val1 ?? 0) > (val2 ?? 0)) {
			return 1;
		} else if ((val1 ?? 0) < (val2 ?? 0)) {
			return -1;
		}
		return 0;
	}
};
