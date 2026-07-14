import { CasoDeEstudio } from './casos.types';

import conectatechJson from '../../../assets/content/casos/conectatech.json';
import comandanteJson from '../../../assets/content/casos/comandante.json';
import ocastelblancoJson from '../../../assets/content/casos/ocastelblanco.json';

/**
 * Registro central de casos de estudio. Para publicar un caso nuevo basta con crear su
 * JSON en `src/assets/content/casos/` y agregarlo aquí — la ruta de detalle
 * (`proyectos/:slug`), el prerender y el listado se derivan de este array
 * (ver `docs/proceso/publicar-casos-de-estudio.md`).
 */
export const CASOS: CasoDeEstudio[] = [conectatechJson, comandanteJson, ocastelblancoJson];
