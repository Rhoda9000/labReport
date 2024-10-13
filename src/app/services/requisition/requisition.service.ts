import { Injectable } from '@angular/core';
import { Requisition } from '../../models/requisition.model';
import { Observable, of } from 'rxjs';

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
}
