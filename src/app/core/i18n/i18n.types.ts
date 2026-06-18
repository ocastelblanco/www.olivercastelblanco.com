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
  contacto: {
    title: string;
    subtitle: string;
    name_label: string;
    name_placeholder: string;
    email_label: string;
    email_placeholder: string;
    message_label: string;
    message_placeholder: string;
    send_button: string;
    success_title: string;
    success_body: string;
    error_required: string;
    error_email: string;
    error_min: string;
  };
  proyectos: {
    back: string;
    view_case: string;
    challenge_label: string;
    approach_label: string;
    impact_label: string;
    stack_label: string;
    ct_tag: string;
    ct_metric: string;
    ct_metric_label: string;
    ct_title: string;
    ct_narrative: string;
    ct_challenge: string;
    ct_approach: string;
    ct_impact_1: string;
    ct_impact_2: string;
    ct_stack: string;
    lt_tag: string;
    lt_metric: string;
    lt_metric_label: string;
    lt_title: string;
    lt_narrative: string;
    lt_challenge: string;
    lt_approach: string;
    lt_impact_1: string;
    lt_impact_2: string;
    lt_stack: string;
  };
}
