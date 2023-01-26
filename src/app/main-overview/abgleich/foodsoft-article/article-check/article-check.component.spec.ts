import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCheckComponent } from './article-check.component';

describe('ArticleCheckComponent', () => {
	let component: ArticleCheckComponent;
	let fixture: ComponentFixture<ArticleCheckComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ArticleCheckComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ArticleCheckComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
