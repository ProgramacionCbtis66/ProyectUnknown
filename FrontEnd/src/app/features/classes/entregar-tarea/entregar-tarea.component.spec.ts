import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregarTareaComponent } from './entregar-tarea.component';

describe('EntregarTareaComponent', () => {
  let component: EntregarTareaComponent;
  let fixture: ComponentFixture<EntregarTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregarTareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregarTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
