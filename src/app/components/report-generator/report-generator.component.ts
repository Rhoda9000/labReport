import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Requisition } from '../../models/requisition.model';
import { ReportService } from '../../services/report/report.service';
import { RequisitionService } from '../../services/requisition/requisition.service';

@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './report-generator.component.html',
  styleUrl: './report-generator.component.scss'
})
export class ReportGeneratorComponent {
  reportForm!: FormGroup;
  requisitionIds: string[] = [];
  requisitions: Requisition[] = [];

  constructor(
    private fb: FormBuilder,
    private requisitionService: RequisitionService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchRequisitions();
  }

  initForm(): void {
    this.reportForm = this.fb.group({
      requisitionId: ['', Validators.required],
      reportType: ['', Validators.required]
    });
  }

  fetchRequisitions(): void {
    this.requisitionService.getAllRequisitions().subscribe((requisitions) => {
      this.requisitions = requisitions;
      this.requisitionIds = requisitions.map((req) => req.requisitionId);
    });
  }

  onGenerateReport(): void {
    if (this.reportForm.valid) {
      const { requisitionId, reportType } = this.reportForm.value;
      const requisition = this.requisitions.find((req) => req.requisitionId === requisitionId);
      if (requisition) {
        this.reportService.generateReport(requisition, reportType);
      } else {
        alert('Requisition not found');
      }
    } else {
      alert('Please fill out all required fields with valid data.');
    }
    this.reportForm.reset();
  }
}