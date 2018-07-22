import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvAccessComponent } from './conv-access.component';

describe('ConvAccessComponent', () => {
  let component: ConvAccessComponent;
  let fixture: ComponentFixture<ConvAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
