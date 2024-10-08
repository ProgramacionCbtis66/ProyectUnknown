import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotificationsPageComponent } from './user-notifications-page.component';

describe('UserNotificationsPageComponent', () => {
  let component: UserNotificationsPageComponent;
  let fixture: ComponentFixture<UserNotificationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNotificationsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNotificationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
