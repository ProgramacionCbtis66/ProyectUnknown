import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificantesFaltasComponent } from './justificantes-faltas.component';

describe('JustificantesFaltasComponent', () => {
  let component: JustificantesFaltasComponent;
  let fixture: ComponentFixture<JustificantesFaltasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificantesFaltasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificantesFaltasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
