import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FoodsoftArticleContainer, FoodsoftArticleGeneric } from '../foodsoft-article';
import { FoodsoftArticleService } from '../foodsoft-article.service';

import { Subscription } from 'rxjs';
import { StateHolderService } from 'src/app/utils/state-holder.service';

@Component({
	selector: 'app-article-check',
	templateUrl: './article-check.component.html',
	styleUrls: ['./article-check.component.scss'],
})
export class ArticleCheckComponent implements OnInit, OnDestroy {
	lstOfSubscriptions = new Subscription();
	convertData!: FoodsoftArticleContainer;
	missingHeaders: string[] = [];
	data: unknown[][] = [];

	displayedColumns!: string[];
	dataSource!: MatTableDataSource<string>;
	displayFields: FoodsoftArticleGeneric = {} as FoodsoftArticleGeneric;

	constructor(
		private stateHolder: StateHolderService,
		private foodArticleService: FoodsoftArticleService,
		private cd: ChangeDetectorRef,
	) {}

	ngOnDestroy(): void {
		this.lstOfSubscriptions.unsubscribe();
	}

	ngOnInit(): void {
		this.lstOfSubscriptions.add(
			this.stateHolder.articleFoodsoftCheck.subscribe((container) => this.checkContainer(container)),
		);
		this.displayFields = this.foodArticleService.getUsedArticleType();

		this.displayedColumns = Object.keys(this.foodArticleService.getUsedArticleType())
			// return the name of the column - which is expected in the CSV file
			.map((key2) => this.displayFields[key2].cName);

		const displayRows = [] as string[];
		//displayRows.push[...this.displayedColumns];
		this.dataSource = new MatTableDataSource();
	}
	checkContainer(data: unknown[][]) {
		this.data = data;
		this.foodArticleService.fillFirstRow(data[0] as string[]);
		this.missingHeaders = this.checkHeader(this.foodArticleService.getUsedArticleType());
		if (this.missingHeaders.length) {
			console.log('missing columns...');
			// add a simple row
			this.dataSource = new MatTableDataSource(['']);

			this.cd.detectChanges();
		} else {
			this.loadData();
		}
	}

	checkHeader(header: FoodsoftArticleGeneric): string[] {
		return (
			Object.keys(header)
				.filter((key) => header[key].cPos < 0 && !header[key].optional)
				// return the name of the column - which is expected in the CSV file
				.map((key2) => header[key2].cName)
		);
	}

	loadData(): void {
		const convertData = this.foodArticleService.convertCSVIntoContainer(this.data);
		this.stateHolder.articleFoodsoftLoaded.next(convertData);
	}
}
