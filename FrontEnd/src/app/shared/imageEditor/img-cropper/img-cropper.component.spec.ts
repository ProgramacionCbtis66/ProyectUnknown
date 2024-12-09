import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCropperComponent } from './img-cropper.component';

describe('ImgCropperComponent', () => {
  let component: ImgCropperComponent;
  let fixture: ComponentFixture<ImgCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgCropperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
