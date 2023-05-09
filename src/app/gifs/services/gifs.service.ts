import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = 'WEPL1KuIFvGk82u9sywW1pE2pCREc96G';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {

    this.loadLocalStorage();
  }



  get tagsHistory() {

    return [...this._tagsHistory];
  }




  // validaciones del historial de busquedas

  private organizeHistory(tag: string){

    // 1. Lo paso a minusculas todo
    tag = tag.toLowerCase();

    // 2. compruebo si el nuevo tags pertenece o no al historial
    if (this._tagsHistory.includes(tag)){

      // 3. si pertenece al historial hago una copia de todos los tags menos el que coincide con mi busqueda actual
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    // 4. Agrego el tag al principio del arreglo
    this._tagsHistory.unshift(tag);

    // 5. Delimito la longitud del historial a 10
    this._tagsHistory = this._tagsHistory.splice(0, 10);

    // 6. Guardo la información de _tagsHistory en el localStorage
    this.saveLocalStorage();
  }


  // -----------------------------------------------------------------
  // Metodo para guardar informacion en el localStorage

  private saveLocalStorage(): void {

    localStorage.setItem("history", JSON.stringify(this._tagsHistory));
  }


  // -----------------------------------------------------------------
  // Metodo para leer informacion del localStorage

  private loadLocalStorage(): void {

    const lS = localStorage.getItem("history");

    if (lS) {
      this._tagsHistory = JSON.parse(lS);
    }

    if (this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);

  }



  // ------------------------------------------------------------------


  searchTag( tag: string): void {

    // si tag es "" no hago nada
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)


    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe( resp => {

        this.gifList = resp.data;

      })



  }

}
