import { Injectable } from '@angular/core';
import { Test } from '../../models/test.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private tests: Test[] = [
    { testId: 1, mnemonic: 'Na', description: 'Sodium', isActive: true },
    { testId: 2, mnemonic: 'K', description: 'Potassium', isActive: true },
    { testId: 3, mnemonic: 'Cr', description: 'Creatinine', isActive: true },
    { testId: 4, mnemonic: 'Ucr', description: 'Urine-Creatinine', isActive: false },
    { testId: 5, mnemonic: 'Ur', description: 'Urea', isActive: true },
    { testId: 6, mnemonic: 'UCE', description: 'Urea+Creatinine+Electrolytes', isActive: true }
  ];

  constructor() { }

  getTests(): Observable<Test[]> {
    return of(this.tests);
  }
}
