import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedordetComponent } from './proveedordet.component';

describe('ProveedordetComponent', () => {
  let component: ProveedordetComponent;
  let fixture: ComponentFixture<ProveedordetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedordetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedordetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
