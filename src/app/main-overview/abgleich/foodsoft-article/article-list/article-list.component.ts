import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FoodsoftArticle } from '../foodsoft-article';

import { Subscription } from 'rxjs';
import { StateHolderService } from 'src/app/utils/state-holder.service';

@Component({
	selector: 'app-article-list',
	templateUrl: './article-list.component.html',
	styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent implements OnInit, OnDestroy {
	@ViewChild(MatSort, { static: true }) sort!: MatSort;
	displayedColumns: string[];
	dataSource!: MatTableDataSource<FoodsoftArticle>;
	objKeys = Object.keys;
	filterText = '';

	lstOfSubscriptions = new Subscription();

	constructor(private stateHolder: StateHolderService) {
		this.displayedColumns = [
			'verf',
			'Bestellnummer',
			'Name',
			'Produzent',
			'Gebinde',
			'Einheit',
			'Pfand',
			'Notiz',
			'Nettopreis',
			'MwSt',
			'Brutto',
		];
	}
	ngOnDestroy(): void {
		this.lstOfSubscriptions.unsubscribe();
	}

	ngOnInit(): void {
		this.lstOfSubscriptions.add(this.stateHolder.articleFoodsoftLoaded.subscribe((list) => this.loadList(list)));
	}
	loadList(list: FoodsoftArticle[]): void {
		this.dataSource = new MatTableDataSource(list);
		// returns the property of the column definition (matColumnDef) by fetching the content from the row
		//this.dataSource.sortingDataAccessor = (rowItem, property) => rowItem[property];
		// here we override the sortData with our custom sort function
		this.dataSource.sortData = this.sortData();

		this.dataSource.sort = this.sort;
		this.dataSource.filterPredicate = this.filterPredicate;
	}

	updateCheckboxes(colName?: string): void {
		console.log('change colName' + colName);
	}

	sortData() {
		const sortFunction = (items: FoodsoftArticle[], sort: MatSort): FoodsoftArticle[] => {
			if (!sort.active || sort.direction === '') {
				return items;
			}
			return items.sort((a: FoodsoftArticle, b: FoodsoftArticle) => {
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
							chk1 = a.Notiz.localeCompare(b.Notiz);
							break;
						case 'Nettopreis':
							chk1 = this.compare(a.Nettopreis, b.Nettopreis);
							break;
						case 'Brutto':
							chk1 = this.compare(a.Brutto, b.Brutto);
							break;
						case 'MwSt':
							chk1 = this.compare(a.MwSt, b.MwSt);
							break;
						case 'Bestellnummer':
						// fall through
						default:
							chk1 = this.compare(a.Bestellnummer, b.Bestellnummer);
							break;
					}
					return chk1 * (sort.direction === 'asc' ? 1 : -1);
				}
				return chk1;
			});
		};
		return sortFunction;
	}

	compare(val1: number, val2: number): number {
		return (val1 ?? 0) > (val2 ?? 0) ? 1 : -1;
	}

	isGroup(index: number, article: FoodsoftArticle): boolean {
		return !article.Bestellnummer;
	}

	filterPredicate(data: FoodsoftArticle, filter: string): boolean {
		return (
			data.Bestellnummer?.toString().includes(filter) ||
			data.Notiz.toLowerCase().includes(filter) ||
			data.Name.toLowerCase().includes(filter)
		);
	}

	trackByFn(index: number, article: FoodsoftArticle) {
		return article.Bestellnummer;
	}
}
