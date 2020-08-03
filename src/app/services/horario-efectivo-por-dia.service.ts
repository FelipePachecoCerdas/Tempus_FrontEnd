import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/horario_efectivo_por_dia';

@Injectable({
  providedIn: 'root'
})
export class HorarioEfectivoPorDiaService {

  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_horario_efectivo) {
    return this.https.get(`${baseUrl}/id_horario_efectivo/${id_horario_efectivo}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_horario_efectivo, data) {
    return this.https.put(`${baseUrl}/id_horario_efectivo/${id_horario_efectivo}`, data);
  }

  delete(id_horario_efectivo) {
    return this.https.delete(`${baseUrl}/id_horario_efectivo/${id_horario_efectivo}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByUserId(id_usuario) {
    return this.https.get(`${baseUrl}/id_usuario/${id_usuario}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
