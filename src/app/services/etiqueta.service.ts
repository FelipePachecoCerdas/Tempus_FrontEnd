import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/etiqueta';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {

  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_usuario,nombre_etiqueta) {
    return this.https.get(`${baseUrl}/id_usuario/${id_usuario}/nombre_etiqueta/${nombre_etiqueta}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_usuario,nombre_etiqueta, data) {
    return this.https.put(`${baseUrl}/id_usuario/${id_usuario}/nombre_etiqueta/${nombre_etiqueta}`, data);
  }

  delete(id_usuario,nombre_etiqueta) {
    return this.https.delete(`${baseUrl}/id_usuario/${id_usuario}/nombre_etiqueta/${nombre_etiqueta}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByName(nombre_etiqueta) {
    return this.https.get(`${baseUrl}/nombre_etiqueta/${nombre_etiqueta}`);
  }

  findByUserId(id_usuario){
    return this.https.get(`${baseUrl}/id_usuario/${id_usuario}`); 
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}
