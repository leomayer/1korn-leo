import { Component, OnInit } from '@angular/core';

import { FoodsoftArticle, FoodsoftCategory } from './foodsoft-article';

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
	constructor(private stateHolder: StateHolderService) {}

	async ngOnInit(): Promise<void> {
		const reader: FileReader = new FileReader();
		reader.onload = (e: ProgressEvent) => {
			/* read workbook */
			const bstr: string = (e?.target as FileReader).result as string;
			const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', codepage: 65001 });

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			/* save data */
			const data: FoodsoftArticle[] = XLSX.utils.sheet_to_json(ws);
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
				if (!convertData[tmp.Kategorie]) {
					const initData = {} as FoodsoftArticle;
					initData.Kategorie = tmp.Kategorie;
					convertData[tmp.Kategorie] = [initData];
				}
				convertData[tmp.Kategorie].push(tmp);
			});

			const retData = [] as FoodsoftArticle[];
			Object.keys(convertData).forEach((key: string) => {
				convertData[key].forEach((el) => retData.push(el));
			});
			this.stateHolder.articleFoodsoftLoaded.next(retData);
		};

		await getAssetFile('articles_ziege.csv', 'articles_ziege.csv', 'text/csv').then((file) => {
			reader.readAsBinaryString(file);
		});
	}

	onFileChange(evt: any) {
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>evt.target;
		if (target.files.length !== 1) throw new Error('Cannot use multiple files');

		console.log(target.files[0]);
		this.reader.readAsBinaryString(target.files[0]);
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
