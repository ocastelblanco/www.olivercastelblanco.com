export type Locale = 'es-CO' | 'en-US';

export interface Translations {
  nav: {
    home: string;
    projects: string;
    lab: string;
    contact: string;
  };
  topbar: {
    role: string;
  };
  lang: {
    toggle_label: string;
  };
  home: {
    headline: string;
    subheadline: string;
    efficiency_title: string;
    efficiency_body: string;
    architecture_title: string;
    architecture_body: string;
    design_title: string;
    design_body: string;
  };
}
