import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//:Injectable, bir clas'ın IoC'e katılması ve injectable olmasını sağlar.Dependency Injection mekanizmasını 
//kullanarak servisin referansını alabiliriz.
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  public controllerUrl:string=`${environment.apiUrl}/categories`;

//: Generic,bir class'ın metodun içerisind ekullanılacak tipi tipleri belirlemek için kullanılır.
  constructor(private httpClient:HttpClient) { }
  
  getList(): Observable<Category[]>{
return this.httpClient.get<Category[]>(this.controllerUrl);
  }
  getById(id:number):Observable<Category>{
    return this.httpClient.get<Category>(`${this.controllerUrl}/${id}`)
  }
}
