import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdendetComponent } from './ordendet.component';

describe('OrdendetComponent', () => {
  let component: OrdendetComponent;
  let fixture: ComponentFixture<OrdendetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdendetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdendetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
