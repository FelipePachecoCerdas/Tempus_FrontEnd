import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/periodo_general';


@Injectable({
  providedIn: 'root'
})
export class PeriodoGeneralService {
  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_horario_general,minutos_tiempo_inicial,minutos_tiempo_finalizacion) {
    return this.https.get(`${baseUrl}/id_horario_general/${id_horario_general}/minInicial/${minutos_tiempo_inicial}/minFinal/${minutos_tiempo_finalizacion}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_horario_general,minutos_tiempo_inicial,minutos_tiempo_finalizacion, data) {
    return this.https.put(`${baseUrl}/id_horario_general/${id_horario_general}/minInicial/${minutos_tiempo_inicial}/minFinal/${minutos_tiempo_finalizacion}`, data);
  }

  delete(id_horario_general,minutos_tiempo_inicial,minutos_tiempo_finalizacion) {
    return this.https.delete(`${baseUrl}/id_horario_general/${id_horario_general}/minInicial/${minutos_tiempo_inicial}/minFinal/${minutos_tiempo_finalizacion}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByGeneralScheduleId(id_horario_general) {
    return this.https.get(`${baseUrl}/id_horario_general/${id_horario_general}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
