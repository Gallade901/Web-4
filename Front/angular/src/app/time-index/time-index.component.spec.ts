import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIndexComponent } from './time-index.component';

describe('TimeIndexComponent', () => {
  let component: TimeIndexComponent;
  let fixture: ComponentFixture<TimeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
