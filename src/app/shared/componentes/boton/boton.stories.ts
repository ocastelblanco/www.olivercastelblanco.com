// boton.stories.ts
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BotonComponent } from './boton.component';
import { IconoComponent } from '../icono/icono.component';
import * as IconoStories from '../icono/icono.stories';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export default {
  title: 'Design System/Átomos/Botón',
  component: BotonComponent,
  subcomponents: { IconoComponent },
  decorators: [
    moduleMetadata({
      declarations: [BotonComponent, IconoComponent],
      imports: [CommonModule, FontAwesomeModule],
    }),
  ],
  argTypes: {
    contenido: { control: 'select', options: ['texto', 'icono+texto', 'icono'], defaultValue: 'texto' },
    estado: { control: 'select', options: ['activo', 'over', 'press'], defaultValue: 'activo' },
    tipo: { control: 'select', options: ['primario', 'acento'], defaultValue: 'primario' }
  }
} as Meta;

const Template: Story<BotonComponent> = (args: BotonComponent) => ({
  props: args,
});

export const Texto: Story<BotonComponent> = Template.bind({});
Texto.args = {
  label: 'Aceptar',
  contenido: 'texto',
};

export const IconoTexto: Story<BotonComponent> = Template.bind({});
IconoTexto.args = {
  ...Texto.args,
  icono: { ...IconoStories.Icono.args },
  contenido: 'icono+texto',
};
IconoTexto.storyName = 'Ícono + Texto';

export const Icono: Story<BotonComponent> = Template.bind({});
Icono.args = {
  ...IconoTexto.args,
  contenido: 'icono',
};
Icono.storyName = 'Ícono';