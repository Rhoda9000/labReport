import { Routes } from '@angular/router';
import { RequisitionFormComponent } from './components/requisition-form/requisition-form.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'requisition', component: RequisitionFormComponent },
    { path: '**', redirectTo: '' }
];
