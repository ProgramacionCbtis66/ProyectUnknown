import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosListadoComponent } from './alumnos-listado.component';

describe('AlumnosListadoComponent', () => {
  let component: AlumnosListadoComponent;
  let fixture: ComponentFixture<AlumnosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
