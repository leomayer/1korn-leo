import { Injectable } from '@angular/core';

import {
	FSTablePos,
	FoodsoftArticleContainer,
	FoodsoftArticleGeneric,
	FoodsoftArticleGerman,
	createFoodArticle,
	createFoodGroupField,
} from './foodsoft-article';

import { compare } from 'src/app/utils/util_collection';

@Injectable({
	providedIn: 'root',
})
export class FoodsoftArticleService {
	private useArticleType: FoodsoftArticleGeneric = FoodsoftArticleGerman;

	constructor() {}

	getUsedArticleType(): FoodsoftArticleGeneric {
		return this.useArticleType;
	}
	getDisplayColumn(useCategory: boolean): string[] {
		let ret = Object.keys(this.useArticleType).map((key) => {
			if (useCategory && this.useArticleType[key].isGroupField) {
				return '';
			} else {
				return key;
			}
		});
		ret = ret.filter((keys) => !!keys.length);
		ret.sort((key1, key2) => {
			if (FSTablePos[key1] < FSTablePos[key2]) {
				return -1;
			} else if (FSTablePos[key1] > FSTablePos[key2]) {
				return 1;
			}
			return 0;
		});
		return ret;
	}

	getListOfArticles4Table(input: FoodsoftArticleContainer): FoodsoftArticleGeneric[] {
		const ret = [] as FoodsoftArticleGeneric[];
		Object.keys(input).forEach((key) => {
			// when a new category starts => insert at the top the (empty) groupField
			ret.push(createFoodGroupField(this.useArticleType, key));
			ret.push(...input[key]);
		});
		return ret;
	}

	convertCSVIntoContainer(data: unknown[][]): FoodsoftArticleContainer {
		const retData = [] as FoodsoftArticleGeneric[];
		if (data?.length) {
			this.fillFirstRow(data[0] as string[]);
			const useData = data.slice(1);
			for (const row of useData) {
				retData.push(this.convertRow2Article(row));
			}
		}
		this.fillValues(retData);
		const sortedData = this.sortFoodsoftArticles(retData);

		return this.convertIntoContainer(sortedData);
	}

	private fillFirstRow(firstRow: string[]): void {
		Object.keys(this.useArticleType).forEach((key) => {
			this.useArticleType[key].cPos = firstRow.indexOf(this.useArticleType[key].cName);
		});
	}

	private convertRow2Article(row: unknown[]): FoodsoftArticleGeneric {
		const ret = createFoodArticle(this.useArticleType);
		Object.keys(this.useArticleType).forEach((key) => {
			const val = row[this.useArticleType[key].cPos];
			if (typeof this.useArticleType[key].cValue === 'boolean') {
				// convert into boolean value
				ret[key].cValue = !!val;
			} else {
				ret[key].cValue = val;
			}
		});
		return ret;
	}

	private fillValues(input: FoodsoftArticleGeneric[]): void {
		input.forEach((tmp: FoodsoftArticleGeneric) => {
			tmp.gross.cValue = Math.round(tmp.net.cValue + (1 + tmp.vat.cValue / 100) * 100) / 100;
		});
	}

	private sortFoodsoftArticles(input: FoodsoftArticleGeneric[]): FoodsoftArticleGeneric[] {
		const groupField = Object.keys(this.useArticleType).find((key) => this.useArticleType[key].isGroupField);
		const firstField = Object.keys(this.useArticleType).find((key) => this.useArticleType[key].sortOrder === 1);
		const secondField = Object.keys(this.useArticleType).find((key) => this.useArticleType[key].sortOrder === 2);
		if (!groupField) {
			throw new Error('Grouping field not defined in data structure; required for proper sorting!!!');
		}

		return input.sort((a, b) => {
			let chk1 = compare(a[groupField], b[groupField]);
			if (!chk1 && firstField) {
				chk1 = compare(a[firstField], b[firstField]);
			}
			if (!chk1 && firstField && secondField) {
				chk1 = compare(a[secondField], b[secondField]);
			}
			return chk1;
		});
	}

	private convertIntoContainer(articles: FoodsoftArticleGeneric[]): FoodsoftArticleContainer {
		const convertedArticles: FoodsoftArticleContainer = {} as FoodsoftArticleContainer;
		articles.forEach((tmp: FoodsoftArticleGeneric) => {
			const catName = tmp.category.cValue;
			const update = convertedArticles[catName] ?? [];
			update.push(tmp);
			convertedArticles[catName] = update;
		});

		return convertedArticles;
	}
}
