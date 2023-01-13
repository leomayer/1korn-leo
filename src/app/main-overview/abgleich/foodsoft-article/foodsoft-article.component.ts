import { Component, OnInit } from '@angular/core';

import { FoodsoftArticle, FoodsoftArticleGeneric, FoodsoftArticleGerman, FoodsoftCategory } from './foodsoft-article';

import { StateHolderService } from 'src/app/utils/state-holder.service';
import { compare, getAssetFile } from 'src/app/utils/util_collection';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-foodsoft-article',
	templateUrl: './foodsoft-article.component.html',
	styleUrls: ['./foodsoft-article.component.scss'],
})
export class FoodsoftArticleComponent implements OnInit {
	fileName = 'articles_ziege.csv';

	useArticleType = FoodsoftArticleGerman;

	reader: FileReader = new FileReader();
	constructor(private stateHolder: StateHolderService) {}

	async ngOnInit(): Promise<void> {
		this.initReader();
		this.initReaderGeneric();
		await getAssetFile(this.fileName, this.fileName, 'text/csv').then((file) => {
			this.reader.readAsBinaryString(file);
		});
	}

	initReader() {
		this.reader.onload = (e: ProgressEvent) => {
			/* read workbook */
			const bstr: string = (e?.target as FileReader).result as string;

			const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', codepage: 65001 });

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0] as string;
			const ws: XLSX.WorkSheet = wb.Sheets[wsname] as XLSX.WorkSheet;

			/* save data */
			const data: FoodsoftArticle[] = XLSX.utils.sheet_to_json(ws);
			const retData = [] as FoodsoftArticle[];

			if (data?.length && data[0]?.Bestellnummer) {
				const convertData = {} as FoodsoftCategory;
				data.sort((a, b) => {
					let chk1 = a.Kategorie.localeCompare(b.Kategorie);
					if (!chk1) {
						chk1 = a.Name.localeCompare(b.Name);
					}
					if (!chk1) {
						chk1 = (a.Bestellnummer ? a.Bestellnummer : 0) > (b.Bestellnummer ? b.Bestellnummer : 0) ? 1 : -1;
					}

					return chk1;
				});
				data.forEach((tmp: FoodsoftArticle) => {
					tmp.Gebinde = tmp.Gebindegröße;
					tmp.Brutto = tmp.Nettopreis * (1 + tmp.MwSt / 100);
					let update = convertData[tmp.Kategorie];
					if (!update) {
						const initData = {} as FoodsoftArticle;
						initData.Kategorie = tmp.Kategorie;
						update = [initData];
					}
					update.push(tmp);
					convertData[tmp.Kategorie] = update;
				});

				Object.keys(convertData).forEach((key: string) => {
					convertData[key]?.forEach((el) => retData.push(el));
				});
			}
			// submit the array anyway
			this.stateHolder.articleFoodsoftLoaded.next(retData);
		};
	}
	initReaderGeneric() {
		this.reader.onload = (e: ProgressEvent) => {
			/* read workbook */
			const bstr: string = (e?.target as FileReader).result as string;

			const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', codepage: 65001 });

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0] as string;
			const ws: XLSX.WorkSheet = wb.Sheets[wsname] as XLSX.WorkSheet;

			/* save data */
			const data: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
			console.log(data);
			const retData = [] as FoodsoftArticleGeneric[];
			if (data?.length) {
				this.fillFirstRow(data[0] as string[]);
				for (let idx = 1; idx < data.length; idx++) {
					if (data[idx]) {
						retData.push(this.convertRow2Article(data[idx] as unknown[]));
					}
				}
			}
			const sortedData = this.sortFoodsoftArticles(retData);
			console.log('Genric results:', sortedData);
		};
	}

	fillFirstRow(firstRow: string[]): void {
		Object.keys(this.useArticleType).forEach((key) => {
			this.useArticleType[key].cPos = firstRow.indexOf(this.useArticleType[key].cName);
		});
	}

	convertRow2Article(row: unknown[]): FoodsoftArticleGeneric {
		const ret = {} as FoodsoftArticleGeneric;
		Object.keys(this.useArticleType).forEach((key) => {
			const val = row[this.useArticleType[key].cPos];
			// convert val as typeof this.useArticleType[key].cType
			ret[key] = val;
		});
		return ret;
	}

	sortFoodsoftArticles(input: FoodsoftArticleGeneric[]): FoodsoftArticleGeneric[] {
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

	onFileChange(evt: Event) {
		console.log(evt.target);
		if (evt?.target) {
			/* wire up file reader */
			const target = evt.target as HTMLInputElement;
			if (target.files?.length === 0) {
				this.stateHolder.articleFoodsoftLoaded.next([]);
				console.log('No file selected');
				return;
			}
			if (target.files?.length !== 1) {
				throw new Error('Cannot use multiple files');
			}
			const file = target.files[0] as File;
			this.reader.readAsBinaryString(file);
			this.fileName = file.name;
		}
	}

	/**
	 * 
	 * function contains(selector, text1, text2) {
  var elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function(element){
    return RegExp(text1).test(element.textContent) && RegExp(text2).test(element.textContent);
  });
}
	 * contains('tr', /(bersta[.]*)/i, /2022/);
	 * 
	 * 
	 */
}
