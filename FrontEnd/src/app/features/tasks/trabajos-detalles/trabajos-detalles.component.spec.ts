import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosDetallesComponent } from './trabajos-detalles.component';

describe('TrabajosDetallesComponent', () => {
  let component: TrabajosDetallesComponent;
  let fixture: ComponentFixture<TrabajosDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrabajosDetallesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabajosDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
