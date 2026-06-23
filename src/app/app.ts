import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@shared/shell/sidebar/sidebar';
import { Topbar } from '@shared/shell/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ocastelblanco');

  constructor() {
    const doc = inject(DOCUMENT);
    this.addJsonLd(doc);
  }

  private addJsonLd(doc: Document): void {
    const person = doc.createElement('script');
    person.type = 'application/ld+json';
    person.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Oliver Castelblanco',
      jobTitle: 'Solutions Architect & AI Orchestrator',
      url: 'https://ocastelblanco.com',
      sameAs: [
        'https://github.com/ocastelblanco',
        'https://linkedin.com/in/ocastelblanco',
      ],
    });
    doc.head.appendChild(person);

    const website = doc.createElement('script');
    website.type = 'application/ld+json';
    website.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Oliver Castelblanco',
      url: 'https://ocastelblanco.com',
    });
    doc.head.appendChild(website);
  }
}
