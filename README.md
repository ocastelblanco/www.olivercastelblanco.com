<div align="center">

# Oliver Castelblanco

**Principal Solutions Architect & AI Orchestrator — I design systems, encode the constraints, and direct AI agents through the whole lifecycle to put them in production.**

[![Live](https://img.shields.io/badge/live-ocastelblanco.com-C6FF00?style=flat-square&labelColor=111111)](https://ocastelblanco.com)
[![Products in production](https://img.shields.io/badge/products_in_production-6-00E5FF?style=flat-square&labelColor=111111)](#portfolio)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![AWS](https://img.shields.io/badge/AWS-Lambda_·_CloudFront_·_S3_·_SES-232F3E?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com)
[![Serverless](https://img.shields.io/badge/IaC-Serverless_Framework_4-FD5750?style=flat-square&logo=serverless&logoColor=white)](https://serverless.com)
[![AI-generated: primarily produced by an AI model](https://img.shields.io/static/v1?label=&message=AI-generated&color=red&style=flat-square)](https://nasa-ammos.github.io/slim/?search=Badges)
[![SLIM](https://img.shields.io/badge/Best%20Practices%20from-SLIM-blue?style=flat-square)](https://nasa-ammos.github.io/slim/)
[![Español](https://img.shields.io/badge/leer_en-Español-C6FF00?style=flat-square&labelColor=111111)](./README.es.md)

</div>

---

## Executive Summary

> **Six production systems in seven months. Every one specified by a human, built by orchestrated agents, and merged only after human review.**

This repository is the source of [**ocastelblanco.com**](https://ocastelblanco.com), my personal site. It is also the index to my recent work: an education platform, a family of systems for a cultural venue in Bogotá, and this site itself, which I documented while I built it as a case study.

The common thread is not "AI wrote the code." A **solutions architect running agent orchestration** can compress the full lifecycle (requirements, architecture, specification, implementation, security review, deployment and incident response) into a fraction of conventional delivery time, **without giving up review discipline, security or cost control**.

<table>
<tr><td><b>Role</b></td><td>Principal Solutions Architect · AI Orchestrator · Bogotá, Colombia</td></tr>
<tr><td><b>Method</b></td><td>AI-Augmented SDLC: agent orchestration as the <i>primary</i> production method, not an autocomplete</td></tr>
<tr><td><b>Fastest delivery</b></td><td><b>6 calendar days</b> from first commit to production (<a href="#comandante--point-of-sale">Comandante</a>)</td></tr>
<tr><td><b>Measured split</b></td><td><b>20.8% human · 79.2% agent</b> across 149 instrumented tasks (<a href="#babel--inventory--point-of-sale">Babel</a>)</td></tr>
<tr><td><b>Orchestration surface</b></td><td>Up to <b>~60% directed from a phone</b>: dispatch, review and merge while away from a desk</td></tr>
<tr><td><b>Cost posture</b></td><td>From <b>$0 to under $1 USD/month</b> of variable cost per serverless product</td></tr>
<tr><td><b>Human-in-the-loop</b></td><td>100% of merges to <code>main</code>, across every repository, approved by a human</td></tr>
</table>

---

## Portfolio

| Product | What it is | Stack | Status |
| :--- | :--- | :--- | :--- |
| [**ConectaTech**](#conectatech--b2b-education-platform) | B2B education platform for Colombian schools, built on Moodle | AWS EC2 · RDS · Terraform · Angular · PHP | Production · since Feb 2026 |
| [**Comandante**](#comandante--point-of-sale) | Real-time point of sale for a café bar | Angular · Ionic · Firebase | Production · $0/month |
| [**Babel**](#babel--inventory--point-of-sale) | Bookstore inventory, shelving and sales | Angular 22 SSR · Lambda · DynamoDB | Production · 19 days to launch |
| [**Ágora**](#ágora--box-office-ticketing) | Theater box office with QR tickets and online payments | Angular 22 SSR · Lambda · DynamoDB · SES | Production · since Aug 2026 |
| [**letiende.co**](#letiendeco--the-facade) | One domain in front of every Le Tiende service | Angular 22 SSR · CloudFront route proxy | Production · since Sep 2026 |
| [**ocastelblanco.com**](#ocastelblancocom--this-repository) | This site: portfolio + a public log of how it was built | Angular 22 zoneless SSR · Lambda · S3 · CloudFront | Production · since Aug 2026 |
| [**IA Orchestration Skills**](#ia-orchestration-skills--the-method-packaged) | Open-source Agent Skills that package this method for any project | Agent Skills · Node.js · Claude Code | Open source · MIT |

### ConectaTech — B2B education platform

[![Repo](https://img.shields.io/badge/repo-conectatech.co-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/conectatech.co)
[![Live](https://img.shields.io/badge/live-conectatech.co-E8630A?style=flat-square)](https://conectatech.co)

Colombian schools lack the infrastructure to offer structured digital education. ConectaTech sells them **course packages** that they distribute to students through **activation pins**. A school representative manages them from a dedicated portal and never needs technical knowledge.

- **Infrastructure as code** for Moodle 5.2 on AWS (EC2 Graviton, RDS MariaDB, encrypted EBS, CloudFront, CloudWatch alarms, automated snapshots) with Terraform and idempotent provisioning scripts. It is sized to cost between ~$34 and ~$89 USD/month.
- **Markdown → Moodle content pipeline**: one annotated Markdown file becomes sections, delegated subsections, content blocks, GIFT quizzes and interactive diagnostic activities.
- **Custom admin panel** (Angular + PHP REST API on Moodle's internal API) for curricular trees, bulk CSV enrollment, organizations, pins and reporting, which Moodle does not do natively.

### Comandante — point of sale

[![Repo](https://img.shields.io/badge/repo-comandante--letiende-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/comandante-letiende)
[![Live](https://img.shields.io/badge/live-comandante.letiende.co-E8630A?style=flat-square)](https://comandante.letiende.co)

Replaced paper order slips at Le Tiende's café bar. Waiters take orders on a phone and baristas receive them on a tablet in real time. The system also splits taxable consumption from VAT-exempt tips so they can be keyed straight into a card terminal.

- **6 days** from first commit to production · **$0 USD/month** on Firebase's free tier.
- **No backend tier at all**: authorization lives in Firestore Security Rules, evaluated server-side. That removed an attack surface, a hosting bill and a deploy pipeline in one decision.
- **~60% of the system was directed from an Android phone**. Every PR deploys to a preview URL, so verifying a change means opening a link.

### Babel — inventory & point of sale

[![Repo](https://img.shields.io/badge/repo-babel--letiende-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/babel-letiende)
[![Live](https://img.shields.io/badge/live-babel.letiende.co-E8630A?style=flat-square)](https://babel.letiende.co)

A bookstore with over 3,000 books and no system. Babel scans the ISBN, enriches its metadata, and records physical location down to the shelf. It also handles in-store sales, a public SSR catalogue and XLSX financial reporting.

- **19 calendar days, 43 h of measured work, 20.8% of it human.** Every task is one row in a committed CSV, and every aggregate in its README can be audited against the git history.
- **Nearly half of the human effort went into specification.** That is where the architect's leverage is, and it is what makes an agent's output reviewable in minutes.
- **A public post-mortem of a $94 billing incident**: an unverified "this is free" assumption about DynamoDB. It became a mandatory cost pre-flight for every later project.

### Ágora — box office ticketing

[![Repo](https://img.shields.io/badge/repo-agora--letiende-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/agora-letiende)
[![Live](https://img.shields.io/badge/live-agora.letiende.co-E8630A?style=flat-square)](https://agora.letiende.co)

Replaced WhatsApp conversations, hand-checked receipts and paper guest lists at Le Tiende's theater with an end-to-end digital flow: **buy → pay → issue QR ticket → validate at the door**.

- Temporary seat reservations to prevent overselling. Ticketing stages close automatically by date. Door validation gives a clear verdict: valid, already used, nonexistent, or from another event.
- **Online card/PSE payments via Bold**, confirmed only by a signed and reconciled webhook, never by the customer's browser.
- **Under $1 USD/month by design.** It was the first project born under the cost rules written after Babel's incident.

### letiende.co — the facade

[![Repo](https://img.shields.io/badge/repo-letiende.co-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/letiende.co)
[![Live](https://img.shields.io/badge/live-letiende.co-E8630A?style=flat-square)](https://letiende.co)

Le Tiende's services each lived at a different address. This is **not a fourth system**. It is a container that puts the box office and the bookstore catalogue under one domain and one menu **without reimplementing either**: a CloudFront route proxy serves `/cartelera` and `/libros` straight from the Ágora and Babel stacks. The repository owns only the homepage, the institutional pages, the shared navigation and the SEO/AEO layer.

### ocastelblanco.com — this repository

A from-scratch 2026 redesign under an "Industrial Minimalism / Technical Dark Mode" design system. The build is also documented as it happens, as a case study in LLM-driven development.

- **Angular 22, zoneless**: standalone components and Signals, with no Zone.js. SSR runs on AWS Lambda, and static assets are served from S3 behind CloudFront.
- **Two publishing speeds, two deliberate solutions.** *Case Studies* are typed JSON versioned in git. *The Lab* is a micro-blog published from Google Sheets without touching code.
- **Bilingual es-CO / en-US** through a Signals-based translation service with no external i18n library. Technical SEO uses JSON-LD aimed at both search engines and LLMs.
- **Contact form over Amazon SES** with anti-abuse controls and an automatic reply.
- **Every change ships through an environment**: a PR deploys to `preview`, and a human merge deploys to `production`. A pre-commit hook blocks hardcoded secrets after two real near-misses.
- **14 ADRs** in [`MEMORY.md`](./MEMORY.md) record every non-trivial decision, including the production cutover of a live CloudFront distribution.

### IA Orchestration Skills — the method, packaged

[![Repo](https://img.shields.io/badge/repo-ia--orchestration--skills-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/ia-orchestration-skills)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://github.com/ocastelblanco/ia-orchestration-skills/blob/main/LICENSE)

Everything in [How I Work](#how-i-work) is packaged as open-source [Agent Skills](https://github.com/ocastelblanco/ia-orchestration-skills): complete workflows that a coding agent runs the same way, project after project, rather than loose prompts. There are two for now, and they interlock.

- **`project-docs-bootstrap`** builds a project's documentation system (`CLAUDE.md` → `PRD.md` → `tech-specs.md` → OWASP + git flow → `MEMORY.md` → `TODO.md`). Its JIT engine keeps exactly 2 atomic tasks in the backlog, derived by comparing the product goal against the actual state. The same structure runs through every repository above.
- **`ai-effort-tracking`** measures the effort and **real cost** of assisted development: human versus agent time, the **verification tax** (review time, taken from hooks rather than estimated), and tokens and USD per task, across Anthropic, OpenAI, Google, DeepSeek, Qwen and Kimi. It refuses to invent: with no verified rate, the cost stays `null`.

Together they answer what generic LLM observability tools cannot: **what each product goal cost, in money and in human hours.**

---

## How I Work

The same method runs through every repository above. It is **encoded in each repo**, so every session and every model inherits it; nobody has to remember it.

| Lifecycle phase | How it is executed |
| :--- | :--- |
| **Requirements** | Structured interview against the business owner's real constraints, before any architecture |
| **Architecture** | Designed against hard cost and security limits and recorded as ADRs |
| **Specification** | `PRD.md` and `tech-specs.md` kept as living documents. This is where the human 20% goes |
| **Planning** | JIT backlog (`TODO.md`) with a hard WIP limit of **2 atomic tasks**: no stale plans or obsolete estimates |
| **Implementation** | Delegated to executor agents: one task, one branch, one pull request |
| **Verification** | Independent reviewer agents. **The agent that writes code never approves it** |
| **Security** | OWASP Top 10 mapped to each system's *actual* attack surface, written into `CLAUDE.md` as permanent constraints |
| **Git flow** | Agents are structurally forbidden from pushing to `main`, force-pushing or merging any PR |
| **Memory** | `MEMORY.md` collects the non-obvious gotchas found along the way. Each one is debugged once and never argued again |

**Why the workstation became optional.** When CI/CD owns building, deploying and publishing a verifiable URL, what is left for the human is **dispatch, judgment and approval**. All three fit on a phone screen. What the human still has to supply is judgment.

**Cost is an architecture decision.** Every project defaults to pay-per-use services with no provisioned capacity, and a budget alarm is set before the first resource exists. That way a cost incident shows up as a service incident, never as a surprise invoice.

---

## This Repository

### Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Angular 22: standalone components, Signals, zoneless (`provideZonelessChangeDetection()`) |
| Rendering | `@angular/ssr` with client hydration, Express 5 handler on AWS Lambda |
| Language | TypeScript 6, `strict` |
| Styling | SCSS design tokens from [`DESIGN.md`](./DESIGN.md): JetBrains Mono + Inter, 0px radii, 4px baseline |
| Hosting | AWS Lambda (SSR) · S3 + CloudFront (static assets) · API Gateway |
| Email | Amazon SES (contact form + auto-reply) |
| IaC | Serverless Framework 4 |
| CI/CD | GitHub Actions: PR → `preview`, merge to `main` → `production` |
| Testing | Vitest via `@angular/build:unit-test` · `node --test` for Lambda handlers |

### Quick Start

**Requirements:** Node.js ≥ 24.15.0 (see `.nvmrc`) and npm. This repo uses npm only; do not mix package managers.

```bash
git clone https://github.com/ocastelblanco/www.olivercastelblanco.com.git
cd www.olivercastelblanco.com
npm ci
npm start                          # dev server at localhost:4200
```

```bash
npm run build                      # production build (browser + SSR server)
npm run serve:ssr:ocastelblanco    # serve the SSR build locally on :4000
npm test                           # unit tests (Vitest)
npm run test:lambda                # Lambda handler tests
npm run lint                       # ESLint
```

No secret is needed to run the site locally. AWS credentials and tokens exist only as GitHub Actions secrets and are never committed.

### Contributing

Every change reaches `main` only through a human-reviewed pull request ([`CLAUDE.md`](./CLAUDE.md)):

1. Branch from `main` using `feature/*`, `fix/*`, `hotfix/*`, `docs/*` or `refactor/*`.
2. Make the change and confirm that `npm run build` passes.
3. Stage specific files. Never `git add .`.
4. Open a pull request against `main`. It deploys to `preview` for review.

Commits follow Conventional Commits in **Colombian Spanish**. Code identifiers are in English, and site copy is in Spanish and English.

### Project Documentation

| Document | Contents |
| :--- | :--- |
| [`CLAUDE.md`](./CLAUDE.md) | Permanent agent instructions: stack, conventions, OWASP rules, git flow |
| [`PRD.md`](./PRD.md) | Product requirements, audience and roadmap |
| [`tech-specs.md`](./tech-specs.md) | Technical architecture |
| [`MEMORY.md`](./MEMORY.md) | Current state, ADRs and gotchas. **Read first** |
| [`TODO.md`](./TODO.md) | JIT engine: exactly two active atomic tasks |
| [`DESIGN.md`](./DESIGN.md) | "Technical Industrial Minimalism" design system |
| [`docs/arquitectura/`](./docs/arquitectura/) | Content and narrative specifications for the site |
| [`docs/proceso/`](./docs/proceso/) | Log of the AI-assisted design process, plus publishing guides |

---

## License

[Apache 2.0](./LICENSE) © Oliver Castelblanco.

## Contact

[ocastelblanco.com/contacto](https://ocastelblanco.com/contacto) · [@ocastelblanco](https://github.com/ocastelblanco)

---

<div align="center">
<sub>Built in Bogotá, Colombia, by an architect and a team of agents. The architect specified every system here and reviewed every merge.</sub>
</div>
