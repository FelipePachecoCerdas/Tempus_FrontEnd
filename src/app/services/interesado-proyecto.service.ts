import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const baseUrl = 'http://localhost:8080/api/interesado_proyecto';
@Injectable({
  providedIn: 'root'
})
export class InteresadoProyectoService {

  constructor(private https: HttpClient) { }

  create(data) {
    return this.https.post(baseUrl, data);
  }
  
  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_interesado, id_proyecto) {
    return this.https.get(`${baseUrl}/id_proyecto/${id_proyecto}/id_interesado/${id_interesado}`);
  }
  

  update(id_interesado, id_proyecto, data) {
    return this.https.put(`${baseUrl}/id_proyecto/${id_proyecto}/id_interesado/${id_interesado}`, data);
  }

  delete(id_interesado, id_proyecto) {
    return this.https.delete(`${baseUrl}/id_proyecto/${id_proyecto}/id_interesado/${id_interesado}`);
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

  findByStakeholderId(id_interesado) {
    return this.https.get(`${baseUrl}/id_interesado/${id_interesado}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }

}
