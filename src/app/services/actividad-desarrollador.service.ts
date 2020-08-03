import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/actividad_desarrollador';

@Injectable({
  providedIn: 'root'
})
export class ActividadDesarrolladorService {

  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_actividad,id_desarrollador) {
    return this.https.get(`${baseUrl}/id_actividad/${id_actividad}/id_desarrollador/${id_desarrollador}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_actividad,id_desarrollador, data) {
    return this.https.put(`${baseUrl}/id_actividad/${id_actividad}/id_desarrollador/${id_desarrollador}`, data);
  }

  delete(id_actividad,id_desarrollador) {
    return this.https.delete(`${baseUrl}/id_actividad/${id_actividad}/id_desarrollador/${id_desarrollador}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByProjectId(id_proyecto) {
    return this.https.get(`${baseUrl}/id_proyecto/${id_proyecto}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}

