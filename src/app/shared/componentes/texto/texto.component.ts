import { Component } from '@angular/core';

@Component({
  selector: 'span[oca-texto]',
  host: {
    'class': 'oca-texto'
  },
  template: '<div class="texto-wrapper"><ng-content></ng-content></div>'
})
export class TextoComponent {

}
