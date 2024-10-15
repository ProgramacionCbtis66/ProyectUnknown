import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosMenuComponent } from './servicios-menu.component';

describe('ServiciosMenuComponent', () => {
  let component: ServiciosMenuComponent;
  let fixture: ComponentFixture<ServiciosMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
