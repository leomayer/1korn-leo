import { TestBed } from '@angular/core/testing';

import { StateHolderService } from './state-holder.service';

describe('StateHolderService', () => {
	let service: StateHolderService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StateHolderService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
