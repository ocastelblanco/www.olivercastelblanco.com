export interface Bilingue {
  es: string;
  en: string;
}

export interface CasoDeEstudio {
  slug: string;
  tag: Bilingue;
  metric: Bilingue;
  metricLabel: Bilingue;
  title: string;
  narrative: Bilingue;
  challenge: Bilingue;
  approach: Bilingue;
  impact: {
    es: string[];
    en: string[];
  };
  stack: Bilingue;
  /** Enlace externo opcional — normalmente la URL del repositorio en GitHub. */
  repoUrl?: string;
}
