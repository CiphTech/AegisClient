import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyAccessComponent } from './key-access.component';

describe('KeyAccessComponent', () => {
  let component: KeyAccessComponent;
  let fixture: ComponentFixture<KeyAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
