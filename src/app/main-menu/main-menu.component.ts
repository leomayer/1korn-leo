import { Component, OnInit } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
	constructor(public router: Router) {}

	ngOnInit(): void {}

	showInMenubar(checkRoute: Route): boolean {
		return !checkRoute.data?.['hideInMenuBar'];
	}
}
