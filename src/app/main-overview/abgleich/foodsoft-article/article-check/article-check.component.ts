import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FoodsoftArticleContainer, FoodsoftArticleGeneric } from '../foodsoft-article';
import { FoodsoftArticleService } from '../foodsoft-article.service';

import { Subscription } from 'rxjs';
import { StateHolderService } from 'src/app/utils/state-holder.service';

export interface ColumnValid {
	[key: string]: boolean;
}

@Component({
	selector: 'app-article-check',
	templateUrl: './article-check.component.html',
	styleUrls: ['./article-check.component.scss'],
})
export class ArticleCheckComponent implements OnInit, OnDestroy {
	lstOfSubscriptions = new Subscription();
	convertData!: FoodsoftArticleContainer;
	data: unknown[][] = [];

	displayedColumns!: string[];
	dataSource!: MatTableDataSource<ColumnValid>;

	constructor(
		private stateHolder: StateHolderService,
		private foodArticleService: FoodsoftArticleService,
		private cd: ChangeDetectorRef,
	) {}

	ngOnDestroy(): void {
		this.lstOfSubscriptions.unsubscribe();
	}

	ngOnInit(): void {
		this.displayedColumns = [];

		this.dataSource = new MatTableDataSource();
		this.lstOfSubscriptions.add(
			this.stateHolder.articleFoodsoftCheck.subscribe((container) => this.checkContainer(container)),
		);
	}
	checkContainer(data: unknown[][]) {
		this.data = data;
		this.foodArticleService.fillFirstRow(data[0] as string[]);
		if (this.checkHeader(this.foodArticleService.getUsedArticleType())) {
			this.displayedColumns = this.getHeaderRow(this.foodArticleService.getUsedArticleType());
			// add a simple row
			const row = this.getFirstRowHits(this.foodArticleService.getUsedArticleType());
			this.dataSource = new MatTableDataSource([row]);

			this.cd.detectChanges();
		} else {
			this.displayedColumns = [];
			this.loadData();
		}
	}

	checkHeader(header: FoodsoftArticleGeneric): string | undefined {
		return Object.keys(header).find((key) => header[key].cPos < 0 && !header[key].optional);
	}
	// return the name of the column - which is expected in the CSV file
	getHeaderRow(header: FoodsoftArticleGeneric): string[] {
		const sorted = this.foodArticleService.sortStructure(Object.keys(header));
		return sorted.filter((chkKey) => !header[chkKey].optional).map((key) => header[key].cName);
	}
	getFirstRowHits(header: FoodsoftArticleGeneric): ColumnValid {
		const ret = {} as ColumnValid;
		Object.keys(header).forEach((key) => {
			const name = header[key].cName;
			ret[name] = !(header[key].cPos < 0 && !header[key].optional);
		});
		return ret;
	}

	loadData(): void {
		const convertData = this.foodArticleService.convertCSVIntoContainer(this.data);
		this.stateHolder.articleFoodsoftLoaded.next(convertData);
	}
}
