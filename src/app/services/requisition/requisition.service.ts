import { Injectable } from '@angular/core';
import { Requisition } from '../../models/requisition.model';
import { Observable, of } from 'rxjs';
import { Request } from '../../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {

  constructor() { }

  saveRequisition(requisition: Requisition): Observable<string> {
    const requisitions = JSON.parse(localStorage.getItem('requisitions') || '[]');
    requisitions.push(requisition);
    localStorage.setItem('requisitions', JSON.stringify(requisitions));
    return of("Requisition saved successfully");
  }

  doesRequisitionIdExist(requisitionId: string): Observable<boolean> {
    const requisitions: Requisition[] = JSON.parse(localStorage.getItem('requisitions') || '[]');
    const exists = requisitions.some(req => req.requisitionId === requisitionId);
    return of(exists);
  }

  getAllRequisitions(): Observable<Requisition[]> {
    const requisitions: Requisition[] = JSON.parse(localStorage.getItem('requisitions') || '[]');
    return of(requisitions);
  }

  updateTestResults(requisitionId: string, testResults: Request[]): Observable<string> {
    const requisitions: Requisition[] = JSON.parse(localStorage.getItem('requisitions') || '[]');
    const requisitionIndex = requisitions.findIndex(req => req.requisitionId === requisitionId);

    if (requisitionIndex !== -1) {
      requisitions[requisitionIndex].requestedTests.forEach(test => {
        const result = testResults.find(r => r.testId === test.testId);
        if (result) {
          test.result = result.result;
          test.comment = result.comment;
        }
      });
      localStorage.setItem('requisitions', JSON.stringify(requisitions));
      return of("Test results updated successfully");
    }

    return of("Requisition not found");
  }
}
