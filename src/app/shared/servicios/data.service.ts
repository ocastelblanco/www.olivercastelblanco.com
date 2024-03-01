import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private rutaInterfaz: string = 'assets/data/interfaz.json';
  private interfaz: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) { }
  // Inicializa todos los datos
  public init(): void {
    this.http.get(this.rutaInterfaz, { responseType: 'json' }).subscribe((_interfaz: any) => this.interfaz.next(_interfaz));
  }
  // Getters
  public getInterfaz(): BehaviorSubject<any> {
    return this.interfaz;
  }
}
