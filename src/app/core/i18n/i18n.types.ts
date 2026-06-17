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
  proyectos: {
    ct_tag: string;
    ct_metric: string;
    ct_metric_label: string;
    ct_title: string;
    ct_narrative: string;
    ct_stack: string;
    lt_tag: string;
    lt_metric: string;
    lt_metric_label: string;
    lt_title: string;
    lt_narrative: string;
    lt_stack: string;
  };
}
