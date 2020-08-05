import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,Validators } from '@angular/forms';
import {Router} from '@angular/router'
import {MenuController, AlertController } from '@ionic/angular'
import {UsuarioService} from '../services/usuario.service'
import { Usuario } from '../tempus-models/usuario';
import {AppComponent} from '../app.component'
import { AuthService } from '../services/auth.service';
import {DesarrolladorProyectoService} from '../services/desarrollador-proyecto.service'
import {InteresadoProyectoService} from '../services/interesado-proyecto.service'
import {ProyectoService} from '../services/proyecto.service'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  RegisterForm:any;
  showPassword=false;
  passwordToggleIcon='eye';
  proyectos_admi:any;
  proyectos_interesado:any
  proyectos_desarrollador:any
  constructor(private authService:AuthService, private proyectoService:ProyectoService, private desarrolladorProyectoService:DesarrolladorProyectoService
    ,private appComponent: AppComponent,private  alertController: AlertController, private menuCtrl:MenuController,
    private interesadoProyectoService: InteresadoProyectoService, private usuarioService: UsuarioService
    ,/*private authService : AuthService,private alertService : AlertService,*/ private formBuilder : FormBuilder, public router: Router) {
   }

  togglePassword(){
    this.showPassword=!this.showPassword;
    if(this.passwordToggleIcon=='eye'){
      this.passwordToggleIcon='eye-off'
    }else{ 
      this.passwordToggleIcon='eye'
    }
  }


  async alertaAdministrador(id_proyecto) {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Eliminar proyecto',
      subHeader: '',
      message: '¿Está seguro que desea salirse del proyecto?',
      buttons: [{text:'Cancelar'},{text:'Aceptar',
      handler: async()=>{
        await this.proyectoService.delete(id_proyecto).toPromise();
        this.proyectos_admi= await this.getProyectosAdministrador();
        this.proyectos_interesado= await this.getProyectosInteresado();
        this.proyectos_desarrollador= await this.getProyectosDesarrollador();
      }}]
    });

    await alert.present();
  }

  async alertaInteresado(id_proyecto) {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Eliminar proyecto',
      subHeader: '',
      message: '¿Está seguro que desea salirse del proyecto?',
      buttons: [{text:'Cancelar'},{text:'Aceptar',
      handler: async()=>{
        await this.interesadoProyectoService.delete(this.appComponent.user.id_usuario,id_proyecto).toPromise();
        this.proyectos_interesado= await this.getProyectosInteresado();
        
      }}]
    });

    await alert.present();
  }
  async administradorProyecto(proyectos){
    let ap:any
    for (let proyecto of proyectos){
    await (await this.usuarioService.findByPk(proyecto.administrador_proyecto)).toPromise().then(
      data=>{
        ap=data["nombre"]
      }
    )
    proyecto.ap=ap
    }
  }
  async alertaDesarrollador(id_proyecto) {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Eliminar proyecto',
      subHeader: '',
      message: '¿Está seguro que desea salirse del proyecto?',
      buttons: [{text:'Cancelar'},{text:'Aceptar',
      handler: async()=>{
        await this.desarrolladorProyectoService.delete(this.appComponent.user.id_usuario,id_proyecto).toPromise();
        this.proyectos_desarrollador= await this.getProyectosDesarrollador();
      }}]
    });

    await alert.present();
  }
  
  
  

  async ngOnInit() {
    this.RegisterForm = 
    this.formBuilder.group({
      'nombre':new FormControl(this.appComponent.user.nombre,Validators.required),
      'apellidos':new FormControl(this.appComponent.user.apellidos,Validators.required),
      'correo_electronico':new FormControl(this.appComponent.user.correo_electronico,[Validators.required, Validators.email]), 
      'contrasenna':new FormControl(this.appComponent.user.contrasenna,Validators.required),
      'compannia':new FormControl(this.appComponent.user.compannia),
      'descripcion_personal':new FormControl(this.appComponent.user.descripcion_personal)
    })
    this.proyectos_admi=await this.getProyectosAdministrador()
    this.proyectos_interesado= await this.getProyectosInteresado()
    this.proyectos_desarrollador = await this.getProyectosDesarrollador()
  }

  async getProyectosAdministrador(){
    let proyectos:any
    await (this.proyectoService.findByProjectAdministratorId(this.appComponent.user.id_usuario)).toPromise().then(
      data=>{
        proyectos=data
      }
    )
    await this.administradorProyecto(proyectos)
    return proyectos
  }

  async getProyectosInteresado(){
    let proyectos:any
    await (this.interesadoProyectoService.findByStakeholderId(this.appComponent.user.id_usuario)).toPromise().then(
      data=>{
        proyectos=data
      }
    )
    let proyectos_2=[]
    for (let proyecto of proyectos){
      await (await this.proyectoService.findByPk(proyecto.id_proyecto)).toPromise().then(
        data=>{
          proyectos_2.push(data)
        })
    }
    await this.administradorProyecto(proyectos_2)
    return proyectos_2 
  }

  async getProyectosDesarrollador(){
    let proyectos:any
    await (this.desarrolladorProyectoService.findByDeveloperId(this.appComponent.user.id_usuario)).toPromise().then(
      data=>{
        proyectos=data
      }
    )
    let proyectos_2=[]
    for (let proyecto of proyectos){
      await (await this.proyectoService.findByPk(proyecto.id_proyecto)).toPromise().then(
        data=>{
          proyectos_2.push(data)
        })
    }
    this.administradorProyecto(proyectos_2)
    return await proyectos_2
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Correo inválido',
      subHeader: '',
      message: 'Ingresa un nuevo correo electrónico que ya estaba registrado',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async alertaRegistro() {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Información personal actualizada',
      subHeader: '',
      message: 'Los datos han sido actualizados exitosamente',
      buttons: [{text:'Aceptar'}]
    });

    await alert.present();
  }
  async onSubmitRegister(formValue){
    
    let verify:any
    await(await this.usuarioService.findByEmail(formValue.correo_electronico)).toPromise().then(
      data=>{
        verify=data
      }
    )
    if(verify==null||verify.correo_electronico==formValue.correo_electronico){
      let usuarios:any
      await(await this.usuarioService.findAll()).toPromise().then(
        data=>{
          usuarios=data
      
        }
      )
      let usuario=new Usuario(this.appComponent.user.id_usuario,formValue.nombre ,formValue.apellidos ,formValue.contrasenna 
                              ,formValue.correo_electronico, null,formValue.descripcion_personal ,formValue.compannia , null)

      this.usuarioService.update(usuario.id_usuario,usuario).toPromise()

      this.authService.login(usuario).then(
        res =>{
          this.appComponent.user= this.authService.actualUser;
  
      })
      this.alertaRegistro();
    }else{
      this.presentAlert()
    }
    //this.authService.register(formValue.fName,formValue.lName,formValue.cedula,formValue.telefono, formValue.email,formValue.password);
    
    
  }

}
