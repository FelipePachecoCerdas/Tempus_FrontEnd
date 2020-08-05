
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,Validators } from '@angular/forms';
import {Router} from '@angular/router'
import { AppComponent} from '../app.component';
import {MenuController, AlertController} from '@ionic/angular'
import {UsuarioService} from '../services/usuario.service'
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {
  loginForm:any;
  showPassword=false;
  passwordToggleIcon='eye';

  constructor(private authService:AuthService, private alertcontroller:AlertController,private menuCtrl: MenuController,private appComponent : AppComponent,private usuarioService: UsuarioService,/* private authService : AuthService,private alertService : AlertService,*/private formBuilder : FormBuilder, public router: Router) {

    this.menuCtrl.enable(false,'menuContent')
   }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({'email':new FormControl('',[Validators.required, Validators.email]), 'contrasenna':new FormControl('',Validators.required)})
  }
  async presentAlert() {
    const alert = await this.alertcontroller.create({
      cssClass: 'alerta',
      header: 'Datos inválidos',
      subHeader: '',
      message: 'El correo electrónico y/o la contraseña son incorrectos',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async onSubmitLogin(formValue){
    let usuario:any
    await(await this.usuarioService.findByEmail(formValue.email)).toPromise().then(
      data=>{
        usuario=data
      }
    )
    if(usuario && formValue.contrasenna==usuario.contrasenna){
        this.authService.login(usuario).then(
          res =>{
            this.appComponent.user= this.authService.actualUser;
            this.router.navigate(['/calendario-tareas'])

    
        })
        this.appComponent.selectedIndex=0
        this.appComponent.cuentaActual="Estudiante"
        this.authService.menuIndex(0)
        
    }else{
      this.presentAlert()
    }
    /*this.authService.login(formValue.email,formValue.password).then(
      res =>{
        this.appComponent.user.name = this.authService.actualUser.first_name + " " + this.authService.actualUser.last_name;
        this.router.navigate(['/usermenu'])

    }).catch(err => this.alertService.presentAlert("Error al iniciar sesión","Email o contraseña incorrectos"));*/
    
  }
  togglePassword(){
    this.showPassword=!this.showPassword;
    if(this.passwordToggleIcon=='eye'){
      this.passwordToggleIcon='eye-off'
    }else{
      this.passwordToggleIcon='eye'
    }
  }




}
