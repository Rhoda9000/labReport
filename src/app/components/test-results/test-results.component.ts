import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequisitionService } from '../../services/requisition/requisition.service';
import { Requisition } from '../../models/requisition.model';
import { Request } from '../../models/request.model';
import { TestService } from '../../services/test/test.service';
import { Test } from '../../models/test.model';

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss']
})
export class TestResultsComponent implements OnInit {
  requisitions: Requisition[] = [];
  tests: Test[] = [];
  selectedRequisitionId: string = '';
  testResultsForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private testService: TestService,
    private requisitionService: RequisitionService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadRequisitions();
    this.loadTests();
  }

  initForm(): void {
    this.testResultsForm = this.fb.group({
      requisitionSelect: ['', Validators.required],
      testResults: this.fb.array([])
    });
  }

  loadRequisitions(): void {
    this.requisitionService.getAllRequisitions().subscribe((data: Requisition[]) => {
      this.requisitions = data;
    });
  }

  loadTests(): void {
    this.testService.getTests().subscribe((tests: Test[]) => {
      this.tests = tests;
    });
  }

  get testResultsArray(): FormArray {
    return this.testResultsForm.get('testResults') as FormArray;
  }

  onRequisitionChange(): void {
    this.selectedRequisitionId = this.testResultsForm.get('requisitionSelect')?.value;
    const selectedRequisition = this.requisitions.find(req => req.requisitionId === this.selectedRequisitionId);

    this.successMessage = '';
    this.testResultsArray.clear();

    if (selectedRequisition) {
      selectedRequisition.requestedTests.forEach(test => {
        this.testResultsArray.push(this.fb.group({
          testId: [test.testId],
          result: [test.result || '', Validators.required],
          comment: [test.comment || '', Validators.required]
        }));
      });
    } else {
      this.errorMessage = 'Invalid requisition selected.';
    }
  }

  updateTestResults(): void {
    if (this.testResultsForm.invalid) {
      this.errorMessage = "Please select a requisition.";
      return;
    }

    const testResults: Request[] = this.testResultsArray.value;

    this.requisitionService.updateTestResults(this.selectedRequisitionId, testResults).subscribe(
      (message: string) => {
        this.successMessage = message;
        this.errorMessage = '';
        this.testResultsForm.reset();
        this.selectedRequisitionId = '';
        this.loadRequisitions();
      },
      (error: string) => {
        this.errorMessage = error;
        this.successMessage = '';
      }
    );
  }
}