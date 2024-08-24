import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativoPageComponent } from './administrativo-page.component';

describe('AdministrativoPageComponent', () => {
  let component: AdministrativoPageComponent;
  let fixture: ComponentFixture<AdministrativoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministrativoPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministrativoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
