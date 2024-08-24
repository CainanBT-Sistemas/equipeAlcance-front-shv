import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-whatch-streamer',
  templateUrl: './whatch-streamer.component.html',
  styleUrl: './whatch-streamer.component.scss'
})
export class WhatchStreamerComponent {

  constructor(
    private route: Router,
  ) {
    if (!GlobalService.personLogged()) {
      this.route.navigate([''])
    }
  }
}
