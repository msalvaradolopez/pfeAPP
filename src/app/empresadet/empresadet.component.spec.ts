import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresadetComponent } from './empresadet.component';

describe('EmpresadetComponent', () => {
  let component: EmpresadetComponent;
  let fixture: ComponentFixture<EmpresadetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresadetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresadetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
