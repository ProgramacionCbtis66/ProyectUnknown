import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedDevicesPageComponent } from './connected-devices-page.component';

describe('ConnectedDevicesPageComponent', () => {
  let component: ConnectedDevicesPageComponent;
  let fixture: ComponentFixture<ConnectedDevicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedDevicesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectedDevicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
