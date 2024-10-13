import { Routes } from '@angular/router';
import { RequisitionFormComponent } from './components/requisition-form/requisition-form.component';
import { HomeComponent } from './components/home/home.component';
import { TestResultsComponent } from './components/test-results/test-results.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'requisition', component: RequisitionFormComponent },
    { path: 'test-results', component: TestResultsComponent },
    { path: '**', redirectTo: '' }
];
