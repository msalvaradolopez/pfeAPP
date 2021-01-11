import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilialdetComponent } from './filialdet.component';

describe('FilialdetComponent', () => {
  let component: FilialdetComponent;
  let fixture: ComponentFixture<FilialdetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilialdetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilialdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
