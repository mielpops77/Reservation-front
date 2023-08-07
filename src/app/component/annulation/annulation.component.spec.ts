import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulationComponent } from './annulation.component';

describe('AnnulationComponent', () => {
  let component: AnnulationComponent;
  let fixture: ComponentFixture<AnnulationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnulationComponent]
    });
    fixture = TestBed.createComponent(AnnulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
