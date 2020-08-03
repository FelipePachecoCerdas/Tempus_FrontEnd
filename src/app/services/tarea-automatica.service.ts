import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/tarea_automatica';

@Injectable({
  providedIn: 'root'
})
export class TareaAutomaticaService {

  
  
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

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
