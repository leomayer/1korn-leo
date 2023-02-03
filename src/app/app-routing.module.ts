import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FoodsoftArticleComponent } from './main-overview/abgleich/foodsoft-article/foodsoft-article.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'csv-import',
		data: { hideInMenuBar: true },
	},

	{ path: 'csv-import', component: FoodsoftArticleComponent },
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
