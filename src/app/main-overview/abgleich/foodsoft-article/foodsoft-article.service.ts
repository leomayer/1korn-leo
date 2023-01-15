import { Injectable } from '@angular/core';

import {
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
	useArticleType: FoodsoftArticleGeneric = FoodsoftArticleGerman;

	constructor() {}

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
			ret[key].cValue = val;
		});
		return ret;
	}

	private fillValues(input: FoodsoftArticleGeneric[]): void {
		input.forEach((tmp: FoodsoftArticleGeneric) => {
			tmp.gross.cValue = tmp.net.cValue + (1 + tmp.vat.cValue / 100);
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
