import { Injectable } from '@angular/core';
import { IniciarSesionPage } from '../iniciar-sesion/iniciar-sesion.page';
import { Usuario } from '../tempus-models/usuario';
import { UsuarioService } from '../services/usuario.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sesion = window.localStorage;
  loggedIn:boolean = false;
  public selectedIndex=0;

  constructor(private usuarioService: UsuarioService) { 
    let user = JSON.parse( this.sesion.getItem("user") ) as Usuario
    let selectedIndex =JSON.parse(this.sesion.getItem("selectedIndex")) as number
    let cuentaActual =this.sesion.getItem("cuentaActual")
    if(user){
      this.loggedIn = true
      this.actualUser = user;
      this.selectedIndex =selectedIndex
      this.cuentaActual=cuentaActual
    } 
  }
  public cuentaActual = 'Estudiante';
  public actualUser: Usuario =
    {
      id_usuario: null,
      nombre: "hola",
      apellidos: "hola",
      correo_electronico: "12345678",
      contrasenna: "12345678",
      tipo_usuario: null,
      descripcion_personal: "hola@gmail.com",
      compannia: "password",
      foto_perfil: null
    };
  login(usuario) {
    return new Promise((resolve, rejected) => {

      this.actualUser = usuario;
      
      this.sesion.setItem("user",JSON.stringify(usuario));
      this.sesion.setItem("cuentaActual","Estudiante")
      if (Object.keys(usuario).length === 0){
        rejected(null);
      };
      resolve(usuario);
    })

  }
  menuIndex(index){
    this.sesion.setItem("selectedIndex",JSON.stringify(index));
  }

  currentAccount(cuenta){
    this.sesion.setItem("cuentaActual",cuenta)
  }
}

