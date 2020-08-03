import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/horario_especifico_por_dia';


@Injectable({
  providedIn: 'root'
})
export class HorarioEspecificoPorDiaService {

  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_horario_especifico) {
    return this.https.get(`${baseUrl}/id_horario_especifico/${id_horario_especifico}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_horario_especifico, data) {
    return this.https.put(`${baseUrl}/id_horario_especifico/${id_horario_especifico}`, data);
  }

  delete(id_horario_especifico) {
    return this.https.delete(`${baseUrl}/id_horario_especifico/${id_horario_especifico}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByEffectiveScheduleId(id_horario_efectivo) {
    return this.https.get(`${baseUrl}/id_horario_efectivo/${id_horario_efectivo}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
