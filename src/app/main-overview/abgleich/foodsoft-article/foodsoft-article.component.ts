import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FoodsoftArticleContainer, FoodsoftCategory } from './foodsoft-article';

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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodsoftArticleComponent implements OnInit {
	fileName = 'articles_ziege.csv';
	//fileName = '';
	loadSuccess: -1 | 0 | 1 = -1;

	reader: FileReader = new FileReader();

	showCheckResults = true;

	constructor(
		private stateHolder: StateHolderService,
		private msgDisplay: MessageComponentComponent,
		private cd: ChangeDetectorRef,
	) {}

	async ngOnInit(): Promise<void> {
		this.initReaderGeneric();
		if (!environment.production) {
			try {
				await getAssetFile(this.fileName, this.fileName, 'text/csv').then((file) => {
					this.reader.readAsBinaryString(file);
				});
			} catch (e: unknown) {
				this.displayError(e);
			}
		}
	}

	initReaderGeneric() {
		this.reader.onload = (e: ProgressEvent) => {
			this.showCheckResults = true;
			try {
				/* read workbook */
				const bstr: string = (e?.target as FileReader).result as string;

				const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', codepage: 65001 });

				/* grab first sheet */
				const wsname: string = wb.SheetNames[0] as string;
				const ws: XLSX.WorkSheet = wb.Sheets[wsname] as XLSX.WorkSheet;

				/* save data */
				const data: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
				setTimeout(() => this.stateHolder.articleFoodsoftCheck.next(data), 10);
				// submit the array anyway
				this.loadSuccess = 1;
			} catch (e1: unknown) {
				this.loadSuccess = 0;
				this.showChecks(false);
				this.displayError(e1);
			}
			this.cd.detectChanges();
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

	showChecks(show: boolean): void {
		this.showCheckResults = show;
		this.cd.detectChanges();
	}

	displayError(e: unknown) {
		if (e instanceof Error) {
			const msg = {} as MessageData;
			msg.title = $localize`:@@fetch-error:Fetch error`;
			msg.content = $localize`:@@cannot-load-file:Cannot load file` + `: "${this.fileName}"`;
			if (e.stack !== '404') {
				msg.content = msg.content + '\n' + $localize`:@@error-while-load:Generic error - see console`;
				console.error(e);
			}
			this.msgDisplay.displayMessage(msg);
		} else {
			console.log(e);
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
