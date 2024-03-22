import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

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
  // Se comunica con la API
  public sendPOST(api: string, datos: { [key: string]: string }): Observable<any> {
    const postData: FormData = this.generaPostData(datos);
    return this.http.post<any>(api, postData);
    /*
    const data: any = {
      $metadata: {
        httpStatusCode: 400
      }
    }
    const obs: Observable<any> = new Observable<any>((sus: Subscriber<any>) => {
      setTimeout(() => {
        sus.next(data);
        sus.complete()
      }, 1000);
    });
    return obs;
    //*/
  }
  // Getters
  public getInterfaz(): BehaviorSubject<any> {
    return this.interfaz;
  }
  // Internas
  private generaGetVars(vars: { [key: string]: string }): string {
    const salida: string[] = [];
    Object.keys(vars).forEach((key: string) => salida.push(encodeURIComponent(key) + '=' + encodeURIComponent(vars[key])));
    return salida.join('&');
  }
  private generaPostData(vars: { [key: string]: string }): FormData {
    const postData: FormData = new FormData();
    Object.keys(vars).forEach((key: string) => postData.append(key, vars[key]));
    return postData;
  }
}
