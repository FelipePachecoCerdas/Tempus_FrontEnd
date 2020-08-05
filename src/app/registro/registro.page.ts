import { Component, OnInit } from '@angular/core';
//import { AuthService} from '../services/auth.service'
//import { AlertService} from '../services/alert.service'
import { FormBuilder, FormControl,Validators } from '@angular/forms';
import {Router} from '@angular/router'
import {MenuController, AlertController } from '@ionic/angular'
import {UsuarioService} from '../services/usuario.service'
import { Usuario } from '../tempus-models/usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  RegisterForm:any;
  showPassword=false;
  passwordToggleIcon='eye';
  constructor(private  alertController: AlertController, private menuCtrl:MenuController, private usuarioService: UsuarioService,/*private authService : AuthService,private alertService : AlertService,*/ private formBuilder : FormBuilder, public router: Router) {
    this.menuCtrl.enable(false,'menuContent')
   }

   togglePassword(){
    this.showPassword=!this.showPassword;
    if(this.passwordToggleIcon=='eye'){
      this.passwordToggleIcon='eye-off'
    }else{
      this.passwordToggleIcon='eye'
    }
  }
  

  ngOnInit() {
    this.RegisterForm = 
    this.formBuilder.group({
      'nombre':new FormControl('',Validators.required),
      'apellidos':new FormControl('',Validators.required),
      'correo_electronico':new FormControl('',[Validators.required, Validators.email]), 
      'contrasenna':new FormControl('',Validators.required),
      'compannia':new FormControl(''),
      'descripcion_personal':new FormControl('')
    })
      


  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Correo inválido',
      subHeader: '',
      message: 'Ingresa un nuevo correo electrónico',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async alertaRegistro() {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Cuenta registrada',
      subHeader: '',
      message: 'La cuenta ha sido registrada exitosamente',
      buttons: [{text:'Aceptar',
      handler:()=>{
        this.router.navigate(['/iniciar-sesion']);
      }
    }]
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
    if(verify==null){
      let usuarios:any
      await(await this.usuarioService.findAll()).toPromise().then(
        data=>{
          usuarios=data
      
        }
      )
      let usuario=new Usuario(usuarios[(usuarios.length)-1].id_usuario+1,formValue.nombre ,formValue.apellidos ,formValue.contrasenna 
                              ,formValue.correo_electronico, null,formValue.descripcion_personal ,formValue.compannia , null)
      this.usuarioService.create(usuario).subscribe()
      this.alertaRegistro();
    }else{
      this.presentAlert()
    }
    //this.authService.register(formValue.fName,formValue.lName,formValue.cedula,formValue.telefono, formValue.email,formValue.password);
    
    
  }

}
