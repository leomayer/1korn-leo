import { TestBed } from '@angular/core/testing';

import { FoodsoftArticleService } from './foodsoft-article.service';

describe('FoodsoftArticleService', () => {
	let service: FoodsoftArticleService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FoodsoftArticleService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
