import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosEntregaHorariosComponent } from './alumnos-entrega-horarios.component';

describe('AlumnosEntregaHorariosComponent', () => {
  let component: AlumnosEntregaHorariosComponent;
  let fixture: ComponentFixture<AlumnosEntregaHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosEntregaHorariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosEntregaHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
