import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeePost } from '../shared/employeePost.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  _firebaseApi = "https://employee-managment-syste-6bdab-default-rtdb.firebaseio.com/employeeList.json";

  constructor(private http: HttpClient) { }

  //Firebase Backend
  postProductFirebase(data: any){
    return this.http.post<any>(this._firebaseApi, data);
  }

  getProductFirebase(){
    return this.http.get<any>(this._firebaseApi);
  }

  putProductFirebase(data:any, id: string){
    return this.http.patch<any>(`https://employee-managment-syste-6bdab-default-rtdb.firebaseio.com/employeeList/${id}.json`, data);
  }

  deleteProductFirebase(id: string){
      return this.http.delete<any>(`https://employee-managment-syste-6bdab-default-rtdb.firebaseio.com/employeeList/${id}.json`)
  }


  //Json-Server Backend
  postProduct(data: any){
    return this.http.post<any>("http://localhost:3000/productList/", data);
  }

  getProduct(){
    return this.http.get<any>("http://localhost:3000/productList/");
  }

  putProduct(data:any, id: number){
    return this.http.put<any>("http://localhost:3000/productList/" + id, data);
  }

  deleteProduct(id:number){
    return this.http.delete<any>("http://localhost:3000/productList/"+id);
  }
}
