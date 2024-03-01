import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'span[oca-texto]',
  host: {
    'class': 'oca-texto'
  },
  template: '<div class="texto-wrapper"><ng-content></ng-content></div>'
})
export class TextoComponent implements OnInit {
  @Input() texto!: string;
  ngOnInit(): void {
    console.log(this.texto);
  }
}
