import { Component, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-img-cropper',
  standalone: true,
  imports: [ImageCropperComponent, CommonModule],
  templateUrl: './img-cropper.component.html',
  styleUrls: ['./img-cropper.component.css']
})
export class ImgCropperComponent {
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  showModal: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  onFileChange(event: Event): void {
    this.imageChangedEvent = event;
    this.showModal = true;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
  }

  saveCroppedImage(): void {
    this.showModal = false;
    this.imageChangedEvent = null;
  }

  cancelCropping(): void {
    this.showModal = false;
    this.imageChangedEvent = null;
  }
}