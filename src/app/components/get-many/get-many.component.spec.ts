import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetManyComponent } from './get-many.component';

describe('GetManyComponent', () => {
  let component: GetManyComponent;
  let fixture: ComponentFixture<GetManyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetManyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetManyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
