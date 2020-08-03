import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/actividad';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_actividad) {
    return this.https.get(`${baseUrl}/id_actividad/${id_actividad}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_actividad, data) {
    return this.https.put(`${baseUrl}/id_actividad/${id_actividad}`, data);
  }

  delete(id_actividad) {
    return this.https.delete(`${baseUrl}/id_actividad/${id_actividad}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByName(nombre_actividad) {
    return this.https.get(`${baseUrl}/nombre_actividad/${nombre_actividad}`);
  }

  findByProjectId(id_proyecto) {
    return this.https.get(`${baseUrl}/id_proyecto/${id_proyecto}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
