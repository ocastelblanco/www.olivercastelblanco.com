import { Component } from '@angular/core';
import { IconsModule } from '../../icons/icons.module';
import { DataService } from '@servicios/data.service';

@Component({
  selector: 'oc-inicio',
  standalone: true,
  imports: [IconsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
}
