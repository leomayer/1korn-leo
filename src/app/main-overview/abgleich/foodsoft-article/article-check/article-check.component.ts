import { Component, OnDestroy, OnInit } from '@angular/core';

import { FoodsoftArticleContainer } from '../foodsoft-article';

import { Subscription } from 'rxjs';
import { StateHolderService } from 'src/app/utils/state-holder.service';

@Component({
	selector: 'app-article-check',
	templateUrl: './article-check.component.html',
	styleUrls: ['./article-check.component.scss'],
})
export class ArticleCheckComponent implements OnInit, OnDestroy {
	lstOfSubscriptions = new Subscription();

	constructor(private stateHolder: StateHolderService) {}

	ngOnDestroy(): void {
		this.lstOfSubscriptions.unsubscribe();
	}

	ngOnInit(): void {
		this.lstOfSubscriptions.add(
			this.stateHolder.articleFoodsoftCheck.subscribe((container) => this.checkContainer(container)),
		);
	}
	checkContainer(container: FoodsoftArticleContainer) {
		console.log('check');
		this.stateHolder.articleFoodsoftLoaded.next(container);
	}
}
