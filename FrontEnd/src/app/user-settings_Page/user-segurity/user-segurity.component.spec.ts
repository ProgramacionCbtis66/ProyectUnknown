import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSegurityComponent } from './user-segurity.component';

describe('UserSegurityComponent', () => {
  let component: UserSegurityComponent;
  let fixture: ComponentFixture<UserSegurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSegurityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSegurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
