import { Component, OnInit } from '@angular/core';
import { ProyectoService } from "../services/proyecto.service";
import { TareaService } from "../services/tarea.service";
import {TareaPeriodoService} from "../services/tarea-periodo.service"
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { InteresadoProyectoService } from '../services/interesado-proyecto.service';
import { DesarrolladorProyectoService } from '../services/desarrollador-proyecto.service';
import { ActividadService } from '../services/actividad.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.page.html',
  styleUrls: ['./bitacora.page.scss'],
})
export class BitacoraPage implements OnInit {
  public tareas:any
  proyectosInteresado=[];proyectosDesarrollador=[];proyectosAdministrador=[]
  constructor(private navCtrl:NavController ,private actividadService:ActividadService, private desarrolladorProyectoService:DesarrolladorProyectoService, private interesadoProyectoService: InteresadoProyectoService, private tareaService:TareaService,private proyectoService:ProyectoService, private authService:AuthService, private tareaPeriodoService: TareaPeriodoService, private appComponent:AppComponent) { 
    if(authService.actualUser.id_usuario==null) this.navCtrl.navigateRoot('/inicio');
  }

  async ngOnInit() {
    //if(this.authService.actualUser.id_usuario==null) this.navCtrl.navigateRoot('/inicio');
    let p_proyectos:any
    
    await this.interesadoProyectoService.findByStakeholderId(this.appComponent.user.id_usuario).toPromise().then(data=>{ p_proyectos=data })
    for (let i of p_proyectos){await (await this.proyectoService.findByPk(i.id_proyecto)).toPromise().then(async data => {this.proyectosInteresado.push(data)} )}
      await this.proyectoService.findByProjectAdministratorId(this.appComponent.user.id_usuario).toPromise().then(data=>{ p_proyectos=data;
      for (let p of p_proyectos)this.proyectosAdministrador.push(p)  })
      await this.desarrolladorProyectoService.findByDeveloperId(this.appComponent.user.id_usuario).toPromise().then(data=>{ p_proyectos=data })
      for (let i of p_proyectos){await (await this.proyectoService.findByPk(i.id_proyecto)).toPromise().then(async data => {this.proyectosDesarrollador.push(data)} )} 
  }

  async ngAfterViewInit(){
    if(this.authService.cuentaActual=='Estudiante') this.tareasEstudiante()
  }

  calcularCompletitud(){
    
  }

  async tareasGeneralesDesarrollador(){
    let tareas2,tareas3=[]
    await this.tareaService.findByUserId(this.authService.actualUser.id_usuario).toPromise().then(
      data=>{tareas2=data})
    let periodos:any
    for (let tarea of tareas2){
      await this.tareaPeriodoService.findByTaskId(tarea.id_tarea).toPromise().then(
        data=>{periodos=data})

      periodos=await this.sortPeriodos(periodos)
      let fh:any
      if(periodos.length!=0){fh= await periodos[0].fecha_hora_final_real;
        tarea.fecha=await fh.substring(8,10)+'-'+ fh.substring(5,7) +'-'+fh.substring(0,4)+' '+fh.substring(11,16)
       tareas3.push(tarea)} 
    }
    this.tareas=tareas3
  }

  async tareasEstudiante(){
    let tareas2,tareas3=[]
    await this.tareaService.findByUserId(this.authService.actualUser.id_usuario).toPromise().then(
      data=>{tareas2=data; })
      console.log(this.tareas)
    let periodos:any
    for (let tarea of tareas2){
      await this.tareaPeriodoService.findByTaskId(tarea.id_tarea).toPromise().then(
        data=>{periodos=data})
      periodos=await this.sortPeriodos(periodos)
      let fh:any
      if(periodos.length!=0&&!tarea.id_actividad_proyecto){fh= await periodos[0].fecha_hora_final_real;
         tarea.fecha=await fh.substring(8,10)+'-'+ fh.substring(5,7) +'-'+fh.substring(0,4)+' '+fh.substring(11,16)
        tareas3.push(tarea)} 
      
    }
    this.tareas=tareas3
  }

  async tareasProyectoDesarrollador(id_proyecto){
    let actividades:any
    await this.actividadService.findByProjectId(id_proyecto).toPromise().then(
      data=>{
        actividades=data
      }
    )
   let tareas2=[],tareas3=[]
    for (let a of actividades){
    await this.tareaService.findByUserActivityId(this.authService.actualUser.id_usuario,a.id_actividad).toPromise().then(
      
      data=>{tareas2.push(data)
      })}
    let periodos:any
    for (let actividad of tareas2){
      for(let tarea of actividad){
      await this.tareaPeriodoService.findByTaskId(tarea.id_tarea).toPromise().then(
        data=>{periodos=data})

      periodos=await this.sortPeriodos(periodos)
      let fh:any
      if(periodos.length!=0){fh= await periodos[0].fecha_hora_final_real;
        tarea.fecha=await fh.substring(8,10)+'-'+ fh.substring(5,7) +'-'+fh.substring(0,4)+' '+fh.substring(11,16)
       tareas3.push(tarea)} 
    }
  }
  
  this.tareas=tareas3
  }

  async menu(opcion){
    this.tareasProyecto(opcion.target.value)

  }
  
  async tareasProyecto(id_proyecto){
    let actividades:any
    await this.actividadService.findByProjectId(id_proyecto).toPromise().then(
      data=>{
        actividades=data
      }
    )
   let tareas2=[],tareas3=[]
    for (let a of actividades){
    await this.tareaService.findByActivityId(a.id_actividad).toPromise().then(
      data=>{tareas2.push(data)
      })}
    let periodos:any
    for (let actividad of tareas2){
      for(let tarea of actividad){
      await this.tareaPeriodoService.findByTaskId(tarea.id_tarea).toPromise().then(
        data=>{periodos=data})

      periodos=await this.sortPeriodos(periodos)
      let fh:any
      if(periodos.length!=0){fh= await periodos[0].fecha_hora_final_real;
        tarea.fecha=await fh.substring(8,10)+'-'+ fh.substring(5,7) +'-'+fh.substring(0,4)+' '+fh.substring(11,16)
       tareas3.push(tarea)} 
    }
  }
  
  this.tareas=tareas3
  }

  async menuDesarrollador(opcion){
    if(opcion.target.value=='General'){this.tareasGeneralesDesarrollador()}
    else{this.tareasProyectoDesarrollador(opcion.target.value)}
  }
  sortPeriodos(periodos){
    return periodos.sort((n1,n2)=>{
      if (n1.fecha_hora_final_real > n2.fecha_hora_final_real) return -1;
      if (n1.fecha_hora_final_real < n2.fecha_hora_final_real) return 1;
      return 0;
    })
  }
  

}
