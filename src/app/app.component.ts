import { Component } from '@angular/core';
import { DataService } from '@servicios/data.service';

@Component({
  selector: 'oca-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private data: DataService) {
    this.data.init();
  }
}
