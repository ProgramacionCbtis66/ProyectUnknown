import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosRegistrosComponent } from './alumnos-registros.component';

describe('AlumnosRegistrosComponent', () => {
  let component: AlumnosRegistrosComponent;
  let fixture: ComponentFixture<AlumnosRegistrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosRegistrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosRegistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
