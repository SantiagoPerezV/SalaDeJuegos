import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardJuegoGuard } from './guard-juego.guard';

describe('guardJuegoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardJuegoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
