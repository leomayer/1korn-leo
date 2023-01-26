import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeAt from '@angular/common/locales/de-AT';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ArticleCheckComponent } from './main-overview/abgleich/foodsoft-article/article-check/article-check.component';
import { ArticleListComponent } from './main-overview/abgleich/foodsoft-article/article-list/article-list.component';
import { FoodsoftArticleComponent } from './main-overview/abgleich/foodsoft-article/foodsoft-article.component';
import { MainOverviewComponent } from './main-overview/main-overview.component';
import { MaterialDesignModule } from './material-design/material-design.module';

registerLocaleData(localeDe); // de-DE
registerLocaleData(localeDeAt); // de-AT

@NgModule({
	declarations: [
		AppComponent,
		MainOverviewComponent,
		MainMenuComponent,
		FoodsoftArticleComponent,
		ArticleListComponent,
		ArticleCheckComponent,
	],
	imports: [MaterialDesignModule, BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
