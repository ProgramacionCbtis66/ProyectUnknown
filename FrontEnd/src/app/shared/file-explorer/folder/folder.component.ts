import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '../../file-uploader/file-uploader.component';
import { Folder } from '../file-explorer/file-explorer.component';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [CommonModule, FileUploaderComponent],
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent {
  @Input() folder!: Folder;
  @Output() fileUploaded = new EventEmitter<File>();

  showUploader = false;

  openUploader() {
    this.showUploader = true;
  }

  closeUploader() {
    this.showUploader = false;
  }

  onFileSelected(file: File) {
    this.fileUploaded.emit(file);
  }
}
