import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsSummaryComponent } from './points-summary.component';

describe('PointsSummaryComponent', () => {
  let component: PointsSummaryComponent;
  let fixture: ComponentFixture<PointsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
