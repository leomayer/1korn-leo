import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FoodFileColStructure, FoodsoftArticleContainer, FoodsoftArticleGeneric } from '../foodsoft-article';
import { FoodsoftArticleService } from '../foodsoft-article.service';

import { Subscription } from 'rxjs';
import { StateHolderService } from 'src/app/utils/state-holder.service';
import { compare } from 'src/app/utils/util_collection';

@Component({
	selector: 'app-article-list',
	templateUrl: './article-list.component.html',
	styleUrls: ['./article-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent implements OnInit, OnDestroy {
	@ViewChild(MatSort, { static: true }) sort!: MatSort;
	displayedColumns: string[];
	dataSource!: MatTableDataSource<FoodsoftArticleGeneric>;
	objKeys = Object.keys;
	filterText = '';

	lstOfSubscriptions = new Subscription();
	listOfArticles: FoodsoftArticleGeneric[] = [];

	useArticleType: FoodsoftArticleGeneric = {} as FoodsoftArticleGeneric;

	constructor(
		private stateHolder: StateHolderService,
		private foodArticleService: FoodsoftArticleService,

		private cd: ChangeDetectorRef,
	) {
		this.displayedColumns = [];
	}
	ngOnDestroy(): void {
		this.lstOfSubscriptions.unsubscribe();
	}

	ngOnInit(): void {
		this.lstOfSubscriptions.add(
			this.stateHolder.articleFoodsoftLoaded.subscribe((container) => this.loadList(container)),
		);
	}
	loadList(container: FoodsoftArticleContainer): void {
		this.useArticleType = this.foodArticleService.getUsedArticleType();
		this.displayedColumns = this.foodArticleService.getDisplayColumn(true);
		this.listOfArticles = this.foodArticleService.getListOfArticles4Table(container);
		console.log('list', this.listOfArticles);
		this.dataSource = new MatTableDataSource(this.listOfArticles);
		// returns the property of the column definition (matColumnDef) by fetching the content from the row
		//this.dataSource.sortingDataAccessor = (rowItem, property) => rowItem[property];
		// here we override the sortData with our custom sort function
		this.dataSource.sortData = this.sortData();

		this.dataSource.sort = this.sort;
		this.dataSource.filterPredicate = this.filterPredicate;
		this.cd.detectChanges();
	}

	sortData() {
		const sortFunction = (items: FoodsoftArticleGeneric[], sort: MatSort): FoodsoftArticleGeneric[] => {
			if (!sort.active || sort.direction === '') {
				return items;
			}
			return items.sort((a: FoodsoftArticleGeneric, b: FoodsoftArticleGeneric) => {
				return 0;
				/*
				let chk1 = a.Kategorie.localeCompare(b.Kategorie);
				if (!chk1) {
					if (a.Bestellnummer === undefined || b.Bestellnummer === undefined) {
						return 1;
					}
					switch (sort.active) {
						case 'verf':
							chk1 = a.verf === b.verf ? 1 : 0;
							break;
						case 'Name':
							chk1 = a.Name.localeCompare(b.Name);
							break;
						case 'Produzent':
							chk1 = a.Produzent.localeCompare(b.Produzent);
							break;
						case 'Einheit':
							chk1 = a.Einheit.localeCompare(b.Einheit);
							break;
						case 'Notiz':
							chk1 = (a.Notiz ?? '').localeCompare(b.Notiz ?? '');
							break;
						case 'Nettopreis':
							//	chk1 = compare(a.Nettopreis, b.Nettopreis);
							break;
						case 'Brutto':
							//chk1 = compare(a.Brutto, b.Brutto);
							break;
						case 'MwSt':
							//chk1 = compare(a.MwSt, b.MwSt);
							break;
						case 'Bestellnummer':
						// fall through
						default:
							//chk1 = compare(a.Bestellnummer, b.Bestellnummer);
							break;
					}
					return chk1 * (sort.direction === 'asc' ? 1 : -1);
				}
				return chk1;
*/
			});
		};
		return sortFunction;
	}

	isGroup(index: number, article: FoodsoftArticleGeneric): boolean {
		return article.category.isGroupField;
	}

	filterPredicate(data: FoodsoftArticleGeneric, filter: string): boolean {
		return (
			data.id.cValue?.toString().includes(filter) ||
			data.note.cValue?.toLowerCase().includes(filter) ||
			data.name.cValue?.toLowerCase().includes(filter)
		);
	}

	trackByFn(index: number, article: FoodsoftArticleGeneric) {
		return article.id.cValue;
	}

	checkType(cell: FoodFileColStructure<unknown>): string {
		return typeof cell?.cValue;
	}
}
