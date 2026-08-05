#!/usr/bin/env node
// Bloquea el patrón que causó dos incidentes reales en este repo (ver MEMORY.md
// §19-20, 2026-08-05): un valor de secreto real dejado como fallback no vacío en
// `${env:VAR, 'valor'}` dentro de serverless.yml. El fallback vacío (`''`) sigue
// siendo válido — solo se bloquea cuando alguien deja un valor real ahí.

import { execSync } from 'node:child_process';

const SECRET_NAME_RE = /(TOKEN|SECRET|KEY|PASSWORD|CREDENTIAL)/i;
// ${env:VAR_NAME, 'valor-no-vacio'} — captura el nombre de la var y el fallback.
const ENV_FALLBACK_RE = /\$\{env:([A-Za-z0-9_]+)\s*,\s*'([^']+)'\}/g;

function stagedFiles() {
  const out = execSync('git diff --cached --name-only --diff-filter=ACM', {
    encoding: 'utf8',
  });
  return out.split('\n').filter((f) => /\.(ya?ml)$/i.test(f));
}

const violations = [];

for (const file of stagedFiles()) {
  let content;
  try {
    content = execSync(`git diff --cached -- ${JSON.stringify(file)}`, {
      encoding: 'utf8',
    });
  } catch {
    continue;
  }
  // Solo miramos líneas agregadas (+), no el contexto ni lo que se borró.
  const addedLines = content
    .split('\n')
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'));

  for (const line of addedLines) {
    for (const match of line.matchAll(ENV_FALLBACK_RE)) {
      const [, varName, fallback] = match;
      if (SECRET_NAME_RE.test(varName) && fallback.trim() !== '') {
        violations.push({ file, varName, line: line.slice(1).trim() });
      }
    }
  }
}

if (violations.length > 0) {
  console.error('\n🚨 Commit bloqueado: posible secreto hardcodeado\n');
  for (const v of violations) {
    console.error(`  ${v.file}`);
    console.error(`    ${v.line}`);
    console.error(
      `    -> "${v.varName}" tiene un fallback no vacío en \${env:...}. Si es un\n` +
        `       secreto real, usa \${env:${v.varName}, ''} y exporta el valor en tu\n` +
        `       shell local (\`export ${v.varName}=...\`) antes de desplegar — nunca\n` +
        `       lo escribas en el archivo.\n`,
    );
  }
  process.exit(1);
}

process.exit(0);
