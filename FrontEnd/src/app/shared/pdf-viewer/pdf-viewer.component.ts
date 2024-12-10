import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent {
  pdfSrc: string = ''; // Aquí se almacenará la URL o el path del PDF.

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result; // Asigna el contenido del PDF al visor.
      };
      reader.readAsArrayBuffer(file);
    }
  }
}
