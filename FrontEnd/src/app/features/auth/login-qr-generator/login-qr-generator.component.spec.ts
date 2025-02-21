import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginQRGeneratorComponent } from './login-qr-generator.component';

describe('LoginQRGeneratorComponent', () => {
  let component: LoginQRGeneratorComponent;
  let fixture: ComponentFixture<LoginQRGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginQRGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginQRGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
