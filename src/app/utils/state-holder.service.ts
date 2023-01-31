import { Injectable } from '@angular/core';

import { FoodsoftArticleContainer } from '../main-overview/abgleich/foodsoft-article/foodsoft-article';

import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class StateHolderService {
	articleFoodsoftLoaded = new Subject<FoodsoftArticleContainer>();
	articleFoodsoftCheck = new ReplaySubject<unknown[][]>(1);

	constructor() {}
}
