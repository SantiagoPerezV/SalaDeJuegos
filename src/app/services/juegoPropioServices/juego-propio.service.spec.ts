import { TestBed } from '@angular/core/testing';

import { JuegoPropioService } from './juego-propio.service';

describe('JuegoPropioService', () => {
  let service: JuegoPropioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JuegoPropioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
