import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'oca-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.scss']
})
export class ContenedorComponent implements OnInit {
  logoComprimido: boolean = false;
  ngOnInit(): void {
    setTimeout(() => this.logoComprimido = true, 2000);
  }
}
