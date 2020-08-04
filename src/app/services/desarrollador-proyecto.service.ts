import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const baseUrl = 'http://localhost:8080/api/desarrollador_proyecto';
@Injectable({
  providedIn: 'root'
})
export class DesarrolladorProyectoService {

  constructor(private https: HttpClient) { }

  create(data) {
    return this.https.post(baseUrl, data);
  }
  
  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_desarrollador, id_proyecto) {
    return this.https.get(`${baseUrl}/id_proyecto/${id_proyecto}/id_desarrollador/${id_desarrollador}`);
  }
  

  update(id_desarrollador, id_proyecto, data) {
    return this.https.put(`${baseUrl}/id_proyecto/${id_proyecto}/id_desarrollador/${id_desarrollador}`, data);
  }

  delete(id_desarrollador, id_proyecto) {
    return this.https.delete(`${baseUrl}/id_proyecto/${id_proyecto}/id_desarrollador/${id_desarrollador}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByVisibilityLevel(nivel_visibilidad) {
    return this.https.get(`${baseUrl}/nivel_visibilidad/${nivel_visibilidad}`);
  }

  findByProjectId(id_proyecto) {
    return this.https.get(`${baseUrl}/id_proyecto/${id_proyecto}`);
  }

  findByDeveloperId(id_desarrollador) {
    return this.https.get(`${baseUrl}/id_desarrollador/${id_desarrollador}`);
  }
  
  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }

}
