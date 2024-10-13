import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Requisition } from '../../models/requisition.model';
import { TestService } from '../test/test.service';
import { jsPDFDocument } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private testMap: { [key: number]: string } = {};

  constructor(private testService: TestService) {
    this.loadTestDescriptions();
  }

  private loadTestDescriptions(): void {
    this.testService.getTests().subscribe(
      (tests) => {
        tests.forEach((test) => {
          this.testMap[test.testId] = test.description;
        });
      },
      (error) => {
        console.error('Failed to load test descriptions:', error);
      }
    );
  }

  generateReport(requisition: Requisition, reportType: string): Promise<string> {
    if (reportType === 'json') {
      return this.generateJSONReport(requisition);
    } else if (reportType === 'pdf') {
      return this.generatePDFReport(requisition);
    }
    return Promise.reject('Invalid report type');
  }

  private async generateJSONReport(requisition: Requisition): Promise<string> {
    const jsonData = JSON.stringify(requisition, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Check if the showSaveFilePicker API is supported within current browsser
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `Requisition_${requisition.requisitionId}.json`,
        types: [
          {
            description: 'JSON Files',
            accept: {
              'application/json': ['.json'],
            },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback for browsers that do not support showSaveFilePicker
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Requisition_${requisition.requisitionId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    return `${requisition.requisitionId} report saved successfully.`;
  }

  private async generatePDFReport(requisition: Requisition): Promise<string> {
    const doc = new jsPDF();

    this.addPDFHeader(doc);
    this.addPatientInfo(doc, requisition);
    this.addRequestedTests(doc, requisition);

    // Use the output method to get the PDF as a blob
    const pdfBlob = await doc.output('blob');

    // Check if the showSaveFilePicker API is supported within current browsser
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `Requisition_${requisition.requisitionId}_${this.formatDate(requisition.timeSampleTaken)}.pdf`,
        types: [
          {
            description: 'PDF Files',
            accept: {
              'application/pdf': ['.pdf'],
            },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(pdfBlob);
      await writable.close();
    } else {
      // Fallback for browsers that do not support showSaveFilePicker
      doc.save(`Requisition_${requisition.requisitionId}_${this.formatDate(requisition.timeSampleTaken)}.pdf`);
    }
    return `${requisition.requisitionId} report saved successfully.`;
  }

  private addPDFHeader(doc: jsPDFDocument): void {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Lab Report', 105, 20, { align: 'center' });
  }

  private addPatientInfo(doc: jsPDFDocument, requisition: Requisition): void {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Requisition ID: ${requisition.requisitionId}`, 10, 40);
    doc.text(`Sample Taken: ${this.formatDate(requisition.timeSampleTaken)}`, 10, 50);
    doc.text(`Patient Name: ${requisition.firstName} ${requisition.surname}`, 10, 60);
    doc.text(`Gender: ${requisition.gender}`, 10, 70);
    doc.text(`Date of Birth: ${this.formatDate(requisition.dateOfBirth)}`, 10, 80);
    doc.text(`Mobile Number: ${requisition.mobileNumber}`, 10, 90);
    doc.line(10, 100, 200, 100);
  }

  private addRequestedTests(doc: jsPDFDocument, requisition: Requisition): void {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Requested Tests', 10, 110);

    const testData = requisition.requestedTests.map((request) => {
      const testDescription = this.testMap[request.testId] || 'Unknown Test';
      return [
        testDescription,
        request.result || 'Pending',
        request.comment || 'N/A'
      ];
    });

    (doc as jsPDFDocument).autoTable({
      head: [['Test Description', 'Result', 'Comment']],
      body: testData,
      startY: 120,
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] },
      theme: 'grid',
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
