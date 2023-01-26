import { Injectable } from '@angular/core';

import { FoodsoftArticleContainer } from '../main-overview/abgleich/foodsoft-article/foodsoft-article';

import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class StateHolderService {
	articleFoodsoftLoaded = new Subject<FoodsoftArticleContainer>();
	articleFoodsoftCheck = new Subject<FoodsoftArticleContainer>();

	constructor() {}
}
