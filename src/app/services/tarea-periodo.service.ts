import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/tarea_periodo';

@Injectable({
  providedIn: 'root'
})
export class TareaPeriodoService {
  
  
  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_tarea,fecha_hora_inicio_original,fecha_hora_final_original) {
    return this.https.get(`${baseUrl}/id_tarea/${id_tarea}/fecha_inicial/${fecha_hora_inicio_original}/fecha_final/${fecha_hora_final_original}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_tarea,fecha_hora_inicio_original,fecha_hora_final_original, data) {
    return this.https.put(`${baseUrl}/id_tarea/${id_tarea}/fecha_inicial/${fecha_hora_inicio_original}/fecha_final/${fecha_hora_final_original}`, data);
  }

  delete(id_tarea,fecha_hora_inicio_original,fecha_hora_final_original) {
    return this.https.delete(`${baseUrl}/id_tarea/${id_tarea}/fecha_inicial/${fecha_hora_inicio_original}/fecha_final/${fecha_hora_final_original}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByTaskId(id_tarea){
    return this.https.delete(`${baseUrl}/id_tarea/${id_tarea}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
