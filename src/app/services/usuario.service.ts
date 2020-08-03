import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private https: HttpClient) { }

  findAll() {
    return this.https.get(baseUrl);
  }

  async findByPk(id_usuario) {
    return this.https.get(`${baseUrl}/id_usuario/${id_usuario}`);
  }

  create(data) {
    return this.https.post(baseUrl, data);
  }

  update(id_usuario, data) {
    return this.https.put(`${baseUrl}/id_usuario/${id_usuario}`, data);
  }

  delete(id_usuario) {
    return this.https.delete(`${baseUrl}/id_usuario/${id_usuario}`);
  }

  deleteAll() {
    return this.https.delete(baseUrl);
  }

  findByName(nombre) {
    return this.https.get(`${baseUrl}/nombre/${nombre}`);
  }

  query(consulta){
    return this.https.post(`${baseUrl}/consulta`,consulta);
  }
}