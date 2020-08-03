import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/etiqueta_tarea';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaTareaService {


  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_usuario,nombre_etiqueta,id_tarea) {
    return this.https.get(`${baseUrl}/id_usuario/${id_usuario}/nombre_etiqueta/${nombre_etiqueta}/id_tarea/${id_tarea}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_usuario,nombre_etiqueta,id_tarea, data) {
    return this.https.put(`${baseUrl}/id_usuario/${id_usuario}/nombre_etiqueta/${nombre_etiqueta}/id_tarea/${id_tarea}`, data);
  }

  delete(id_usuario,nombre_etiqueta,id_tarea) {
    return this.https.delete(`${baseUrl}/id_usuario/${id_usuario}/nombre_etiqueta/${nombre_etiqueta}/id_tarea/${id_tarea}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByUserId(id_usuario){
    return this.https.get(`${baseUrl}/id_usuario/${id_usuario}`); 
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
