import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss'
})
export class MyScheduleComponent {

  constructor(
    private route: Router,
  ) {
    if (!GlobalService.personLogged()) {
      this.route.navigate([''])
    }
  }
}
