// icono.stories.ts
import { Meta, Story, moduleMetadata, componentWrapperDecorator } from '@storybook/angular';
import { APP_INITIALIZER } from '@angular/core';
import { IconoComponent } from './icono.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { listaIconos, nombreIconos, iconos } from './icono.lista';

export default {
  title: 'Design System/Átomos/Ícono',
  component: IconoComponent,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule],
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (iconLibrary: FaIconLibrary) => async () => {
            iconLibrary.addIcons(...listaIconos);
          },
          deps: [FaIconLibrary],
          multi: true,
        },
      ],
    }),
    componentWrapperDecorator((story) =>
      `<div style=" display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #aaa;
                    height: 4em;
                    width: 4em;">
        ${story}
      </div>`
    ),
  ],
  argTypes: {
    tamano: { control: 'select', options: ['pequeño', 'mediano'], defaultValue: 'pequeño' },
    icono: { control: 'select', options: nombreIconos, defaultValue: 'home' },
    color: { control: 'select', options: ['blanco', 'gris-900'], defaultValue: 'gris-900' }
  }
} as Meta;

const Template: Story<IconoComponent> = (args: IconoComponent) => ({ props: args });

export const Icono: Story<IconoComponent> = Template.bind({});
Icono.args = {
  iconos: iconos,
};
Icono.storyName = 'Ícono';