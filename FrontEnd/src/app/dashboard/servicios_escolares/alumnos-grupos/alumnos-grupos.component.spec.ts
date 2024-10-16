import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosGruposComponent } from './alumnos-grupos.component';

describe('AlumnosGruposComponent', () => {
  let component: AlumnosGruposComponent;
  let fixture: ComponentFixture<AlumnosGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosGruposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
