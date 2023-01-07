import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodsoftArticleComponent } from './foodsoft-article.component';

describe('FoodsoftArticleComponent', () => {
  let component: FoodsoftArticleComponent;
  let fixture: ComponentFixture<FoodsoftArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodsoftArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodsoftArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
