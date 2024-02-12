import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Datasource } from './datasource';
@Injectable({
  providedIn: 'root',
})
export class DataService {


  private dataSource1: any = [];

  private dataSource:  Datasource = {
    datasets: [
      {
        data: [],
        backgroundColor: ["#ffcd56",
        "#ff6384",
        "#36a2eb",
        "#fd6b19",
        "#83FF33",
        "#F633FF",
        "#FF3333"],
      }
    ],

    labels: []
  };

  private apiUrl:string = "http://localhost:3000/budget";

  fetchDataFromBackend() {
    return this.http.get<any[]>(this.apiUrl);
  }

  setDataSource(data: Datasource): void {
    this.dataSource = data;
  }

  setDataSource1(data: any[]): void {
    this.dataSource1 = data;
  }

  getDataSource(): Datasource {
    return this.dataSource;
  }

  getDataSource1():any[]{
    return this.dataSource1;
  }

  constructor(private http: HttpClient) {

  }



}