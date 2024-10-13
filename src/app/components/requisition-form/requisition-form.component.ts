import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Test } from '../../models/test.model';
import { TestService } from '../../services/test/test.service';
import { RequisitionService } from '../../services/requisition/requisition.service';
import { Requisition } from '../../models/requisition.model';

@Component({
  selector: 'app-requisition-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './requisition-form.component.html',
  styleUrls: ['./requisition-form.component.scss']
})
export class RequisitionFormComponent implements OnInit {
  requisitionForm: FormGroup;
  availableTests: Test[] = [];

  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private requisitionService: RequisitionService
  ) {
    this.requisitionForm = this.fb.group({
      requisitionId: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      timeSampleTaken: ['', Validators.required],
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', [Validators.required, Validators.pattern(/^[MFU]$/)]],
      dateOfBirth: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+27\d{9}$/)]],
      requestedTests: this.fb.array([], Validators.required),
    });
  }

  ngOnInit() {
    this.testService.getTests().subscribe(tests => {
      this.availableTests = tests.filter(test => test.isActive);
    });
  }

  get requestedTests(): FormArray {
    return this.requisitionForm.get('requestedTests') as FormArray;
  }

  addTest(test: Test) {
    if (test.isActive && !this.isTestConflict(test)) {
      this.requestedTests.push(
        this.fb.group({
          testId: [test.testId],
          result: [''],
          comment: ['']
        })
      );
    }
  }

  isTestConflict(newTest: Test): boolean {
    const selectedTestIds = this.requestedTests.controls.map(control => control.get('testId')?.value);
    if (newTest.testId === 6 && selectedTestIds.some(id => [1, 2, 3, 5].includes(id))) {
      return true;
    }
    if ([1, 2, 3, 5].includes(newTest.testId) && selectedTestIds.includes(6)) {
      return true;
    }
    return false;
  }

  onSubmit() {
    if (this.requisitionForm.valid) {
      const requisition: Requisition = {
        requisitionId: this.requisitionForm.value.requisitionId,
        timeSampleTaken: this.requisitionForm.value.timeSampleTaken,
        firstName: this.requisitionForm.value.firstName,
        surname: this.requisitionForm.value.surname,
        gender: this.requisitionForm.value.gender,
        dateOfBirth: this.requisitionForm.value.dateOfBirth,
        mobileNumber: this.requisitionForm.value.mobileNumber,
        requestedTests: this.requisitionForm.value.requestedTests,
      };

      this.requisitionService.saveRequisition(requisition).subscribe(response => {
        this.requisitionForm.reset();
      });
    }
  }
}
