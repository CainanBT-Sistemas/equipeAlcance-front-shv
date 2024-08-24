import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStreamComponent } from './my-stream.component';

describe('MyStreamComponent', () => {
  let component: MyStreamComponent;
  let fixture: ComponentFixture<MyStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyStreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
