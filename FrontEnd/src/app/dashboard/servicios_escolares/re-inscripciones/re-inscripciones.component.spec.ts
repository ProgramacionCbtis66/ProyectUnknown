import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReInscripcionesComponent } from './re-inscripciones.component';

describe('ReInscripcionesComponent', () => {
  let component: ReInscripcionesComponent;
  let fixture: ComponentFixture<ReInscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReInscripcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
