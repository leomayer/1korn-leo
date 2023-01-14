export interface FoodsoftCategory {
	[key: string]: FoodsoftArticle[];
}
export interface FoodsoftArticle {
	verf: boolean;
	Bestellnummer: number | undefined; // undefined als Zwischenüberschrift
	Einheit: string;
	Gebindegröße: number; // Wert aus CSV-Tabelle
	Gebinde: number; // Wert, der letztlich verwendet werden kann in Angular
	Herkunft: string;
	Kategorie: string;
	MwSt: number;
	Name: string;
	Notiz: string;
	Nettopreis: number;
	Brutto: number;
	Pfand: number;
	Produzent: string;
}

export interface FoodsoftArticleContainer {
	FoodsoftArticleCategory: FoodsoftArticleGeneric[];
}
export interface FoodsoftArticleCategory {
	category: string;
}

export const FoodsoftArticleGerman: FoodsoftArticleGeneric = {
	/* fields with addtional paramter */
	category: { cName: 'Kategorie', isGroupField: true } as FoodFileColStructure<string>, // Category - grouping identifier
	name: { cName: 'Name', sortOrder: 1 } as FoodFileColStructure<string>,
	id: { cName: 'Bestellnummer', sortOrder: 2 } as FoodFileColStructure<number>, //  Zwischenüberschrift => isGroupingField=true
	gross: { cName: 'Bruttopreis', optional: true } as FoodFileColStructure<number>,
	/* fields with name only */
	available: { cName: 'verf' } as FoodFileColStructure<boolean>, // if the article is available
	producer: { cName: 'Produzent' } as FoodFileColStructure<string>,
	note: { cName: 'Notiz' } as FoodFileColStructure<string>,
	unit: { cName: 'Produzent' } as FoodFileColStructure<string>, //  Wenn Zwischenüberschrift ==> undefined
	quantity: { cName: 'Gebindegröße' } as FoodFileColStructure<number>,
	size: { cName: 'Gebinde' } as FoodFileColStructure<number>,
	origin: { cName: 'Herkunft' } as FoodFileColStructure<string>, // Herkunft
	net: { cName: 'Nettopreis' } as FoodFileColStructure<number>,
	vat: { cName: 'MwSt' } as FoodFileColStructure<number>,
	deposit: { cName: 'Pfand' } as FoodFileColStructure<number>,
};

export interface FoodsoftArticleGeneric {
	id: FoodFileColStructure<number | undefined>;
	available: FoodFileColStructure<boolean>; // if the article is available
	name: FoodFileColStructure<string>;
	producer: FoodFileColStructure<string>;
	note: FoodFileColStructure<string>;
	unit: FoodFileColStructure<string>; //  Wenn Zwischenüberschrift ==> undefined
	quantity: FoodFileColStructure<number>; // Wert aus CSV-Tabelle
	size: FoodFileColStructure<number>;
	origin: FoodFileColStructure<string>; // Herkunft
	category: FoodFileColStructure<string>; // Category - grouping identifier
	net: FoodFileColStructure<number>; // net price
	vat: FoodFileColStructure<number>; // vat
	gross: FoodFileColStructure<number>; // net + vat (as a number easier filtering and sort)
	deposit: FoodFileColStructure<number>; // in €
}

export interface FoodFileColStructure<T> {
	value: T;
	cName: string;
	cPos: number;
	optional: boolean; // flag to decide if the field is required for the import
	isGroupField: boolean; // Marker if field is the one used for grouping (==> automatically sorted!)
	sortOrder: number; // 0 or undefined: field not used, 1: field used as first compare (after grouping field), 2: ... second
}

export const createFoodArticle = (pattern: FoodsoftArticleGeneric): FoodsoftArticleGeneric => {
	const ret = {} as FoodsoftArticleGeneric;
	Object.keys(pattern).forEach((key) => {
		const addField = {} as FoodFileColStructure<unknown>;
		addField.cName = pattern[key].cName;
		addField.cPos = pattern[key].cPos;
		addField.sortOrder = pattern[key].sortOrder;
		ret[key] = addField;
	});
	return ret;
};
export const createFoodGroupField = (pattern: FoodsoftArticleGeneric): FoodsoftArticleGeneric => {
	const ret = createFoodArticle(pattern);
	ret.category.isGroupField = true;
	return ret;
};
