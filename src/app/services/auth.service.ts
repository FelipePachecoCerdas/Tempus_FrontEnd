import { Injectable } from '@angular/core';
import { IniciarSesionPage } from '../iniciar-sesion/iniciar-sesion.page';
import {Usuario} from '../tempus-models/usuario';
import {UsuarioService} from '../services/usuario.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sesion = window.localStorage;
  loggedIn:boolean = false;

  constructor(private usuarioService: UsuarioService) { 
    let user = JSON.parse( this.sesion.getItem("user") ) as Usuario
    if(user){
      this.loggedIn = true
      this.actualUser = user;
    } 
  }
  public cuentaActual='Estudiante';
  public actualUser : Usuario = 
  {
    id_usuario:null,
    nombre : "hola",
    apellidos : "hola",
    correo_electronico : "12345678",
    contrasenna : "12345678",
    tipo_usuario:null,
    descripcion_personal: "hola@gmail.com",
    compannia: "password",
    foto_perfil:null
  };
  login(usuario){
    return new Promise((resolve,rejected)=>{

      this.actualUser = usuario;
      this.sesion.setItem("user",JSON.stringify(usuario));
      if (Object.keys(usuario).length === 0){
        rejected(null);
      };
      resolve(usuario);
  })

  }
}

