import { Request } from './request.model';

export interface Requisition {
    requisitionId: string;
    timeSampleTaken: Date;
    firstName: string;
    surname: string;
    gender: string;
    dateOfBirth: Date;
    mobileNumber: string;
    requestedTests: Request[];
}