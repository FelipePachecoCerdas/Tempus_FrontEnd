import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private https: HttpClient) { }
  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_proyecto) {
    return this.https.get(`${baseUrl}/id_proyecto/${id_proyecto}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_proyecto, data) {
    return this.https.put(`${baseUrl}/id_proyecto/${id_proyecto}`, data);
  }

  delete(id_proyecto) {
    return this.https.delete(`${baseUrl}/id_proyecto/${id_proyecto}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByName(nombre_proyecto) {
    return this.https.get(`${baseUrl}/nombre_proyecto/${nombre_proyecto}`);
  }

  findByProjectAdministratorId(administrador_proyecto) {
    return this.https.get(`${baseUrl}/administrador_proyecto/${administrador_proyecto}`);
  }

  query(consulta) {
    return this.https.post(`${baseUrl}/consulta`, consulta);
  }
}

