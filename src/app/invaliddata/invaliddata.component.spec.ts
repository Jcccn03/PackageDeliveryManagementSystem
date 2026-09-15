import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvaliddataComponent } from './invaliddata.component';

describe('InvaliddataComponent', () => {
  let component: InvaliddataComponent;
  let fixture: ComponentFixture<InvaliddataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvaliddataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvaliddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
