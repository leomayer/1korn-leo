import { Component, OnInit } from '@angular/core';

import { FoodsoftArticle, FoodsoftArticleContainer, FoodsoftCategory } from './foodsoft-article';
import { FoodsoftArticleService } from './foodsoft-article.service';

import { MessageComponentComponent } from 'src/app/material-design/message-component/message-component.component';
import { MessageData } from 'src/app/material-design/message-component/messageData';
import { StateHolderService } from 'src/app/utils/state-holder.service';
import { getAssetFile } from 'src/app/utils/util_collection';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-foodsoft-article',
	templateUrl: './foodsoft-article.component.html',
	styleUrls: ['./foodsoft-article.component.scss'],
})
export class FoodsoftArticleComponent implements OnInit {
	//	fileName = 'articles_ziege.csv';
	fileName = '';

	reader: FileReader = new FileReader();

	convertData!: FoodsoftArticleContainer;
	constructor(
		private stateHolder: StateHolderService,
		private foodArticleService: FoodsoftArticleService,
		private msgDisplay: MessageComponentComponent,
	) {}

	async ngOnInit(): Promise<void> {
		this.initReaderGeneric();
		if (!environment.production) {
			try {
				await getAssetFile(this.fileName, this.fileName, 'text/csv').then((file) => {
					this.reader.readAsBinaryString(file);
				});
			} catch (e: unknown) {
				if (e instanceof Error) {
					const msg = {} as MessageData;
					msg.title = $localize`:@@fetch-error:Fetch error`;
					if (e.stack === '404') {
						msg.content = $localize`:@@cannot-load-file:Cannot load file` + `: "${this.fileName}"`;
					} else {
						msg.content = $localize`:@@error-while-load:Generic error - see console`;
						console.error(e);
					}
					this.msgDisplay.displayMessage(msg);
				} else {
					console.log(e);
				}
			}
		}
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
		};
	}

	onFileChange(evt: Event) {
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
