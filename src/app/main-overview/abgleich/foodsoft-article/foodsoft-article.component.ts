import { Component, OnInit } from '@angular/core';

import { FoodsoftArticle, FoodsoftArticleContainer, FoodsoftCategory } from './foodsoft-article';
import { FoodsoftArticleService } from './foodsoft-article.service';

import { StateHolderService } from 'src/app/utils/state-holder.service';
import { getAssetFile } from 'src/app/utils/util_collection';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-foodsoft-article',
	templateUrl: './foodsoft-article.component.html',
	styleUrls: ['./foodsoft-article.component.scss'],
})
export class FoodsoftArticleComponent implements OnInit {
	fileName = 'articles_ziege.csv';

	reader: FileReader = new FileReader();

	convertData!: FoodsoftArticleContainer;
	constructor(private stateHolder: StateHolderService, private foodArticleService: FoodsoftArticleService) {}

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
			//	this.stateHolder.articleFoodsoftLoaded.next(retData);
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
			const convertData = this.foodArticleService.convertCSVIntoContainer(data);
			this.convertData = convertData;
			// submit the array anyway
			this.stateHolder.articleFoodsoftLoaded.next(convertData);

			console.log('Genric results:', convertData);
		};
	}

	onFileChange(evt: Event) {
		console.log(evt.target);
		if (evt?.target) {
			/* wire up file reader */
			const target = evt.target as HTMLInputElement;
			if (target.files?.length === 0) {
				this.stateHolder.articleFoodsoftLoaded.next({} as FoodsoftArticleContainer);
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
