import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatchStreamerComponent } from './whatch-streamer.component';

describe('WhatchStreamerComponent', () => {
  let component: WhatchStreamerComponent;
  let fixture: ComponentFixture<WhatchStreamerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhatchStreamerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhatchStreamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
