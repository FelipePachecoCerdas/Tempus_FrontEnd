import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  
  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_tarea) {
    return this.https.get(`${baseUrl}/id_tarea/${id_tarea}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_tarea, data) {
    return this.https.put(`${baseUrl}/id_tarea/${id_tarea}`, data);
  }

  delete(id_tarea) {
    return this.https.delete(`${baseUrl}/id_tarea/${id_tarea}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByName(nombre_tarea) {
    return this.https.get(`${baseUrl}/nombre_tarea/${nombre_tarea}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
