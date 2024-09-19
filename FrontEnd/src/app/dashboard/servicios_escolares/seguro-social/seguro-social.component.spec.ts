import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguroSocialComponent } from './seguro-social.component';

describe('SeguroSocialComponent', () => {
  let component: SeguroSocialComponent;
  let fixture: ComponentFixture<SeguroSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguroSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguroSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
