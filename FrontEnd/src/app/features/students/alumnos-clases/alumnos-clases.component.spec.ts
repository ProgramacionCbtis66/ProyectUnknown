import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosClasesComponent } from './alumnos-clases.component';

describe('AlumnosClasesComponent', () => {
  let component: AlumnosClasesComponent;
  let fixture: ComponentFixture<AlumnosClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosClasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
