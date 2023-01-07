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
