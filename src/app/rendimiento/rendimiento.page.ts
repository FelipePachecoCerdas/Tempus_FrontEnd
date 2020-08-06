import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { Chart } from "chart.js";
import {TareaService} from '../services/tarea.service'
import {ProyectoService} from '../services/proyecto.service'
import {UsuarioService} from '../services/usuario.service'
import {TareaPeriodoService} from '../services/tarea-periodo.service'
import {ActividadService} from '../services/actividad.service'
import {InteresadoProyectoService} from '../services/interesado-proyecto.service'
import {DesarrolladorProyectoService} from '../services/desarrollador-proyecto.service'
import {ActividadDesarrolladorService} from '../services/actividad-desarrollador.service'
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rendimiento',
  templateUrl: './rendimiento.page.html',
  styleUrls: ['./rendimiento.page.scss']
})
export class RendimientoPage implements OnInit {
  proyectosInteresado=[]; usuariosHorasInteresado=[]; coloresHorasInteresado=[]; @ViewChild("barCanvas") barCanvas: ElementRef;  barChart: Chart;
  actividadesTareasInteresado=[]; coloresAT_Interesado=[]; @ViewChild("barCanvas2") barCanvas2: ElementRef;  barChart2: Chart;
  desarrolladoresTareasInteresado=[]; coloresAD_Interesado=[]; @ViewChild("barCanvas3") barCanvas3: ElementRef;  barChart3: Chart;
  infoTareasI=[]; coloresIT_Interesado=[]; @ViewChild("barCanvas7") barCanvas7: ElementRef;  barChart7: Chart;

  proyectosAdministrador=[]; usuariosHorasAdministrador=[]; coloresHorasAdministrador=[]; @ViewChild("barCanvas4") barCanvas4: ElementRef;  barChart4: Chart;
  actividadesTareasAdministrador=[]; coloresAT_Administrador=[]; @ViewChild("barCanvas5") barCanvas5: ElementRef;  barChart5: Chart;
  desarrolladoresTareasAdministrador=[]; coloresAD_Administrador=[]; @ViewChild("barCanvas6") barCanvas6: ElementRef;  barChart6: Chart;
  infoTareasA=[]; coloresIT_Administrador=[]; @ViewChild("barCanvas8") barCanvas8: ElementRef;  barChart8: Chart;

  infoTareasE=[]; coloresIT_Estudiante=[]; @ViewChild("barCanvas9") barCanvas9: ElementRef;  barChart9: Chart;
  tareasE=[]; tareasAtrasadasE=[]; tareasAdelantadasE=[];

  proyectosDesarrollador=[];infoTareasD=[]; coloresIT_Desarrollador=[]; @ViewChild("barCanvas10") barCanvas10: ElementRef;  barChart10: Chart;


  constructor(private tareaService:TareaService, private usuarioService:UsuarioService,private proyectoService:ProyectoService, private tareaPeriodoService:TareaPeriodoService
    ,private actividadService:ActividadService, private interesadoProyectoService:InteresadoProyectoService, private desarrolladorProyectoService:DesarrolladorProyectoService,
    private appComponent: AppComponent, private actividadDesarrolladorService: ActividadDesarrolladorService, private renderer:Renderer2, private authService:AuthService,
    private navCtrl:NavController) { 
    }


  async ngOnInit() {
    //this.usuariosProyectoInteresado(4)
    if(this.authService.actualUser.id_usuario==null) this.navCtrl.navigateRoot('/inicio');
    let p_proyectos:any
    await this.interesadoProyectoService.findByStakeholderId(this.appComponent.user.id_usuario).toPromise().then(data=>{ p_proyectos=data })
    for (let i of p_proyectos){await (await this.proyectoService.findByPk(i.id_proyecto)).toPromise().then(async data => {this.proyectosInteresado.push(data)} )}
      await this.proyectoService.findByProjectAdministratorId(this.appComponent.user.id_usuario).toPromise().then(data=>{ p_proyectos=data;
      for (let p of p_proyectos)this.proyectosAdministrador.push(p)  })
      await this.desarrolladorProyectoService.findByDeveloperId(this.appComponent.user.id_usuario).toPromise().then(data=>{ p_proyectos=data })
      for (let i of p_proyectos){await (await this.proyectoService.findByPk(i.id_proyecto)).toPromise().then(async data => {this.proyectosDesarrollador.push(data)} )} 
    }
  

  async  ngAfterViewInit(){
    this.tareasEstudiante()
      if(this.appComponent.cuentaActual=="Estudiante"){await this.infoTareasEstudiante()}
      window.onresize = async ()=> {
        if(this.appComponent.cuentaActual=="Estudiante"){
          if(window.innerWidth>=700){
            if(this.barChart9){this.barChart9.destroy();
              this.barChart9 =await this.grafico(this.barCanvas9,this.infoTareasE,this.coloresIT_Estudiante,"doughnut","Progreso de Tareas")
            this.renderer.setStyle(this.barCanvas9.nativeElement,"height" ,"400px")}
          }else{
            {this.barChart9.destroy();
              this.barChart9 =await this.grafico(this.barCanvas9,this.infoTareasE,this.coloresIT_Estudiante,"doughnut","Progreso de Tareas")
            this.renderer.setStyle(this.barCanvas9.nativeElement,"height" ,"350px")}
          }
        }
        if(this.appComponent.cuentaActual=="Desarrollador"){
          if(window.innerWidth>=700){
            if(this.barChart10){this.barChart10.destroy();
              this.barChart10 =await this.grafico(this.barCanvas10,this.infoTareasD,this.coloresIT_Desarrollador,"doughnut","Progreso de Tareas")
            this.renderer.setStyle(this.barCanvas10.nativeElement,"height" ,"400px")}
          }else{
            {this.barChart10.destroy();
              this.barChart10 =await this.grafico(this.barCanvas10,this.infoTareasD,this.coloresIT_Desarrollador,"doughnut","Progreso de Tareas")
            this.renderer.setStyle(this.barCanvas10.nativeElement,"height" ,"350px")}
          }
        }
        if(this.appComponent.cuentaActual=="Interesado"){
          if(window.innerWidth>=700){
          if(this.barChart&& this.barChart.config.type!='bar'){
          this.barChart.destroy();
          this.barChart =await this.grafico(this.barCanvas,this.usuariosHorasInteresado,this.coloresHorasInteresado,window.innerWidth>=700?"bar":"horizontalBar","Cantidad de horas trabajadas");
          this.renderer.setStyle(this.barCanvas.nativeElement,"height" ,"400px")
          }
          if(this.barChart2){
          this.barChart2.destroy();
          this.barChart2 =await this.grafico(this.barCanvas2,this.actividadesTareasInteresado,this.coloresAT_Interesado,"pie","Cantidad de taras por Actividad")
        this.renderer.setStyle(this.barCanvas2.nativeElement,"height" ,"400px")}
        if(this.barChart3){this.barChart3.destroy();  this.barChart3 = await this.grafico(this.barCanvas3,this.desarrolladoresTareasInteresado,this.coloresAD_Interesado,"doughnut","Cantidad de taras por Desarrollador");
      this.renderer.setStyle(this.barCanvas3.nativeElement,"height" ,"400px")}
      if(this.barChart7){this.barChart7.destroy();  this.barChart7 = await this.grafico(this.barCanvas7,this.infoTareasI,this.coloresIT_Interesado,"doughnut","Progreso de Tareas");
      this.renderer.setStyle(this.barCanvas7.nativeElement,"height" ,"400px")}
          
      else{
        if(this.barChart && this.barChart.config.type!='horizontalBar'){this.barChart.destroy();this.barChart =await this.grafico(this.barCanvas,this.usuariosHorasInteresado,this.coloresHorasInteresado,window.innerWidth>=700?"bar":"horizontalBar","Cantidad de horas trabajadas")}
        if(this.barChart2){this.barChart2.destroy();this.barChart2 =await this.grafico(this.barCanvas2,this.actividadesTareasInteresado,this.coloresAT_Interesado,"pie","Cantidad de taras por Actividad")
        this.renderer.setStyle(this.barCanvas2.nativeElement,"height" ,"350px")}
        if(this.barChart3){this.barChart3.destroy();  this.barChart3 = await this.grafico(this.barCanvas3,this.desarrolladoresTareasInteresado,this.coloresAD_Interesado,"doughnut","Cantidad de taras por Desarrollador");
      this.renderer.setStyle(this.barCanvas3.nativeElement,"height" ,"350px")}
      if(this.barChart7){this.barChart7.destroy();  this.barChart7 = await this.grafico(this.barCanvas7,this.infoTareasI,this.coloresIT_Interesado,"doughnut","Progreso de Tareas");
      this.renderer.setStyle(this.barCanvas7.nativeElement,"height" ,"350px")}
      }}}
      if(this.appComponent.cuentaActual=="Administrador"){
        if(window.innerWidth>=700){
        if(this.barChart4&& this.barChart4.config.type!='bar'){
        this.barChart4.destroy();
        this.barChart4 =await this.grafico(this.barCanvas4,this.usuariosHorasAdministrador,this.coloresHorasAdministrador,window.innerWidth>=700?"bar":"horizontalBar","Cantidad de horas trabajadas")
        this.renderer.setStyle(this.barCanvas4.nativeElement,"height" ,"400px")
        }
        if(this.barChart5){
        this.barChart5.destroy();
        this.barChart5 = await this.grafico(this.barCanvas5,this.actividadesTareasAdministrador,this.coloresAT_Administrador,"pie","Cantidad de taras por Actividad")
      this.renderer.setStyle(this.barCanvas5.nativeElement,"height" ,"400px")}
      if(this.barChart6){this.barChart6.destroy(); this.barChart6 = await this.grafico(this.barCanvas6,this.desarrolladoresTareasAdministrador,this.coloresAD_Administrador,"doughnut","Cantidad de taras por Desarrollador");
      this.renderer.setStyle(this.barCanvas6.nativeElement,"height" ,"400px")}
        
    else{
      if(this.barChart4 && this.barChart4.config.type!='horizontalBar'){this.barChart4 =await this.grafico(this.barCanvas4,this.usuariosHorasAdministrador,this.coloresHorasAdministrador,window.innerWidth>=700?"bar":"horizontalBar","Cantidad de horas trabajadas")}
      if(this.barChart5){this.barChart5.destroy(); this.barChart5 = await this.grafico(this.barCanvas5,this.actividadesTareasAdministrador,this.coloresAT_Administrador,"pie","Cantidad de taras por Actividad")
      this.renderer.setStyle(this.barCanvas5.nativeElement,"height" ,"350px")}
      if(this.barChart6){this.barChart6.destroy(); this.barChart6 = await this.grafico(this.barCanvas6,this.desarrolladoresTareasAdministrador,this.coloresAD_Administrador,"doughnut","Cantidad de taras por Desarrollador");
      this.renderer.setStyle(this.barCanvas6.nativeElement,"height" ,"350px")}
    }}}
    }
  }

  async horasTInteresado(proyecto){
    this.usuariosHorasInteresado=await this.usuariosProyecto(proyecto.target.value)
    this.coloresHorasInteresado=await this.generateColorArray((this.usuariosHorasInteresado!=[]?this.usuariosHorasInteresado[0].length:1))
    document.getElementById("TPIcontent").style.display='block'
    if(this.barChart)this.barChart.destroy()
    this.barChart =await this.grafico(this.barCanvas,this.usuariosHorasInteresado,this.coloresHorasInteresado,window.innerWidth>=700?"bar":"horizontalBar","Cantidad de horas trabajadas")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas.nativeElement,"height" ,"350px")
  } 

  async tareasAInteresado(proyecto){
    this.actividadesTareasInteresado=await this.tareasActividad(proyecto.target.value)
    this.coloresAT_Interesado=await this.generateColorArray((this.actividadesTareasInteresado!=[]?this.actividadesTareasInteresado[0].length:1))
    document.getElementById("TPIcontent2").style.display='block'
    if(this.barChart2)this.barChart2.destroy()
    this.barChart2 = await this.grafico(this.barCanvas2,this.actividadesTareasInteresado,this.coloresAT_Interesado,"pie","Cantidad de taras por Actividad")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas2.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas2.nativeElement,"height" ,"350px")
  } 

  async tareasDInteresado(proyecto){
    this.desarrolladoresTareasInteresado=await this.tareasDesarrrollador(proyecto.target.value)
    this.coloresAD_Interesado=await this.generateColorArray((this.desarrolladoresTareasInteresado!=[]?this.desarrolladoresTareasInteresado[0].length:1))
    document.getElementById("TPIcontent3").style.display='block'
    if(this.barChart3)this.barChart3.destroy()
    this.barChart3 = await this.grafico(this.barCanvas3,this.desarrolladoresTareasInteresado,this.coloresAD_Interesado,"doughnut","Cantidad de taras por Desarrollador")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas3.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas3.nativeElement,"height" ,"350px")
  } 

  async infoTareasInteresado(proyecto){
    this.infoTareasI=await this.infoTareas(proyecto.target.value)
    this.coloresIT_Interesado=await this.generateColorArray((this.infoTareasI!=[]?this.infoTareasI[0].length:1))
    document.getElementById("TPIcontent3").style.display='block'
    if(this.barChart7)this.barChart7.destroy()
    this.barChart7 = await this.grafico(this.barCanvas7,this.infoTareasI,this.coloresIT_Interesado,"doughnut","Progreso de Tareas")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas7.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas7.nativeElement,"height" ,"350px")
  } 

  async horasTAdministrador(proyecto){
    this.usuariosHorasAdministrador=await this.usuariosProyecto(proyecto.target.value)
    this.coloresHorasAdministrador=await this.generateColorArray((this.usuariosHorasAdministrador!=[]?this.usuariosHorasAdministrador[0].length:1))
    document.getElementById("TPIcontent").style.display='block'
    if(this.barChart4)this.barChart4.destroy()
    this.barChart4 =await this.grafico(this.barCanvas4,this.usuariosHorasAdministrador,this.coloresHorasAdministrador,window.innerWidth>=700?"bar":"horizontalBar","Cantidad de horas trabajadas")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas4.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas4.nativeElement,"height" ,"350px")
  } 

  async tareasAAdministrador(proyecto){
    this.actividadesTareasAdministrador=await this.tareasActividad(proyecto.target.value)
    this.coloresAT_Administrador=await this.generateColorArray((this.actividadesTareasAdministrador!=[]?this.actividadesTareasAdministrador[0].length:1))
    document.getElementById("TPIcontent2").style.display='block'
    if(this.barChart5)this.barChart5.destroy()
    this.barChart5 = await this.grafico(this.barCanvas5,this.actividadesTareasAdministrador,this.coloresAT_Administrador,"pie","Cantidad de taras por Actividad")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas5.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas5.nativeElement,"height" ,"350px")
  } 

  async tareasDAdministrador(proyecto){
    this.desarrolladoresTareasAdministrador=await this.tareasDesarrrollador(proyecto.target.value)
    this.coloresAD_Administrador=await this.generateColorArray((this.desarrolladoresTareasAdministrador!=[]?this.desarrolladoresTareasAdministrador[0].length:1))
    document.getElementById("TPIcontent3").style.display='block'
    if(this.barChart6)this.barChart6.destroy()
    this.barChart6 = await this.grafico(this.barCanvas6,this.desarrolladoresTareasAdministrador,this.coloresAD_Administrador,"doughnut","Cantidad de taras por Desarrollador")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas6.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas6.nativeElement,"height" ,"350px")
  } 

  async infoTareasAdministrador(proyecto){
    this.infoTareasA=await this.infoTareas(proyecto.target.value)
    this.coloresIT_Administrador=await this.generateColorArray((this.infoTareasA!=[]?this.infoTareasA[0].length:1))
    document.getElementById("TPIcontent3").style.display='block'
    if(this.barChart8)this.barChart8.destroy()
    this.barChart8 = await this.grafico(this.barCanvas8,this.infoTareasA,this.coloresIT_Administrador,"doughnut","Progreso de Tareas")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas8.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas8.nativeElement,"height" ,"350px")
  } 

  async menuInfoTareasD(opcion){
    if(opcion.target.value=='General'){this.infoTareasDesarrolladorGenerales()}
    else{this.infoTareasDesarrolladorProyectos(opcion.target.value)}
  }

  async infoTareasEstudiante(){
    this.infoTareasE=await this.infoTareasEst()
    this.coloresIT_Estudiante=await this.generateColorArray((this.infoTareasE!=[]?this.infoTareasE[0].length:1))
    if(this.barChart9)this.barChart9.destroy()
    this.barChart9 = await this.grafico(this.barCanvas9,this.infoTareasE,this.coloresIT_Estudiante,"doughnut","Progreso de Tareas")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas9.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas9.nativeElement,"height" ,"350px")
  } 

  async infoTareasDesarrolladorGenerales(){
    this.infoTareasD=await this.infoTareasDesarrolladorG()
    this.coloresIT_Desarrollador=await this.generateColorArray((this.infoTareasD!=[]?this.infoTareasD[0].length:1))
    if(this.barChart10)this.barChart10.destroy()
    this.barChart10 = await this.grafico(this.barCanvas10,this.infoTareasD,this.coloresIT_Desarrollador,"doughnut","Progreso de Tareas")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas10.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas10.nativeElement,"height" ,"350px")
  } 

  async infoTareasDesarrolladorProyectos(id_proyecto){
    this.infoTareasD=await this.infoTareasDesarrollador(id_proyecto)
    this.coloresIT_Desarrollador=await this.generateColorArray((this.infoTareasD!=[]?this.infoTareasD[0].length:1))
    if(this.barChart10)this.barChart10.destroy()
    this.barChart10 = await this.grafico(this.barCanvas10,this.infoTareasD,this.coloresIT_Desarrollador,"doughnut","Progreso de Tareas")
    window.innerWidth>700?this.renderer.setStyle(this.barCanvas10.nativeElement,"height" ,"400px"):this.renderer.setStyle(this.barCanvas10.nativeElement,"height" ,"350px")
  } 


  async usuariosProyecto(id_proyecto){
    let desarrolladores:any
      await (await this.desarrolladorProyectoService.findByProjectId(id_proyecto)).toPromise().then(
        async data => { desarrolladores=(data) } )
    let a_desarrolladores=[]
    for (let d of desarrolladores){
      await (await this.actividadDesarrolladorService.findByProjectUserId(id_proyecto,d.id_desarrollador)).toPromise().then(
        async data => { a_desarrolladores.push(data)})
    }
    let usuarios=[]
    for (let d of desarrolladores){
      await (await this.usuarioService.findByPk(d.id_desarrollador)).toPromise().then(
        async data => {usuarios.push(data["nombre"]+" "+data["apellidos"][0]+".")})
    }
    let i=0, d_tareas=[]
    for (let d of desarrolladores){
      let tareas=[]
      for (let a of a_desarrolladores[i]){
        await (await this.tareaService.findByUserActivityId(d.id_desarrollador,a.id_actividad)).toPromise().then(
          async data => {tareas.push(data)} )
      }
      d_tareas.push(tareas); i++;
    }
    let valores=[]
    for (let d of d_tareas){ 
      let valor=0
      for (let a of d){
        for(let t of a){ 
          let tps:any
          await (await this.tareaPeriodoService.findByTaskId(t.id_tarea)).toPromise().then(
            async data => { tps=data })
          if(tps)for (let tp of tps ){
            if(tp.fecha_hora_inicio_real&&tp.fecha_hora_final_real) valor+=Number(tp.fecha_hora_final_real.substring(11,13))-Number(tp.fecha_hora_inicio_real.substring(11,13))
          }
        }
      }
      valores.push(valor)
    }
    return [usuarios,valores]
  }

  async tareasActividad(id_proyecto){
    let actividades:any
      await (await this.actividadService.findByProjectId(id_proyecto)).toPromise().then(
        async data => { actividades=(data)
    })
    let cantidadTareas=[], actividadesNombre=[]
    for (let a of actividades){
        let tareas:any,valor=0
        await (await this.tareaService.findByActivityId(a.id_actividad)).toPromise().then(
          async data =>  { tareas=data }) 
          if(tareas)for (let t of tareas ){
            valor++
          }
          cantidadTareas.push(valor)
          actividadesNombre.push(a.nombre_actividad)
      }
      
    return [actividadesNombre,cantidadTareas]
  }

  async tareasDesarrrollador(id_proyecto){
    let desarrolladores:any
      await (await this.desarrolladorProyectoService.findByProjectId(id_proyecto)).toPromise().then(
        async data => { desarrolladores=(data) } )
    let a_desarrolladores=[]
    for (let d of desarrolladores){
      await (await this.actividadDesarrolladorService.findByProjectUserId(id_proyecto,d.id_desarrollador)).toPromise().then(
        async data => { a_desarrolladores.push(data)})
    }
    let usuarios=[]
    for (let d of desarrolladores){
      await (await this.usuarioService.findByPk(d.id_desarrollador)).toPromise().then(
        async data => {usuarios.push(data["nombre"]+" "+data["apellidos"][0]+".")})
    }
    let i=0, valores=[]
    for (let d of desarrolladores){
      let valor=0,tareas:any
      for (let a of a_desarrolladores[i]){
        await (await this.tareaService.findByUserActivityId(d.id_desarrollador,a.id_actividad)).toPromise().then(
          async data =>  { tareas=data }) 
          if(tareas)for (let t of tareas ){
            valor++
          }
      }
      valores.push(valor)
      i++;
    }
    return [usuarios,valores]
  }

  async infoTareas(id_proyecto){
    let actividades:any
      await (await this.actividadService.findByProjectId(id_proyecto)).toPromise().then(
        async data => { actividades=(data)
    })
    let cantidadTareas=[], actividadesNombre=[]
    let tc=0,te=0,ts=0
    for (let a of actividades){
        let tareas:any
        await (await this.tareaService.findByActivityId(a.id_actividad)).toPromise().then(
          async data =>  { tareas=data }) 
          if(tareas)for (let t of tareas ){
              let periodos:any
              let valor=0
            await (await this.tareaPeriodoService.findByTaskId(t.id_tarea)).toPromise().then(
              async data =>  { periodos=data }) 
              if(periodos!=[]){for(let p of periodos){
                  if(p.fecha_hora_inicio_real){valor+=0.5}
                  if(p.fecha_hora_final_real){valor+=0.5}
                }
              }
              if(valor==0){ts++}else if(valor==periodos.length){tc++}else{te++}
          }
          actividadesNombre.push(a.nombre_actividad)
      }
      
    return [["Tareas completadas","Tareas en progreso","Tareas sin realizar"],[tc,te,ts]]
  }

  async infoTareasEst(){
      let tareas:any 
      await (await this.tareaService.findByUserId(this.appComponent.user.id_usuario)).toPromise().then(
        data=>{
          tareas=data
        }
      )
      let tareas2=[]
      for (let t of tareas){
        if(!t.id_actividad_proyecto)tareas2.push(t)
      }
      let tc=0,te=0,ts=0
      for (let t of tareas2){
        let periodos:any
        let valor=0
      await (await this.tareaPeriodoService.findByTaskId(t.id_tarea)).toPromise().then(
        async data =>  { periodos=data }) 
        if(periodos!=[]){for(let p of periodos){
            if(p.fecha_hora_inicio_real){valor+=0.5}
            if(p.fecha_hora_final_real){valor+=0.5}
          }
        }
        if(valor==0){ts++}else if(valor==periodos.length){tc++}else{te++}
      }

        
      return [["Tareas completadas","Tareas en progreso","Tareas sin realizar"],[tc,te,ts]]
  }

  

  async infoTareasDesarrolladorG(){
    let tareas:any 
    await (await this.tareaService.findByUserId(this.appComponent.user.id_usuario)).toPromise().then(
      data=>{
        tareas=data
      }
    )
    let tc=0,te=0,ts=0
    for (let t of tareas){
      let periodos:any
      let valor=0
    await (await this.tareaPeriodoService.findByTaskId(t.id_tarea)).toPromise().then(
      async data =>  { periodos=data }) 
      {for(let p of periodos){
          if(p.fecha_hora_inicio_real){valor+=0.5}
          if(p.fecha_hora_final_real){valor+=0.5}
        }
      }
      if(valor==0){ts++}else if(valor==periodos.length){tc++}else{te++}
    } 
    return [["Tareas completadas","Tareas en progreso","Tareas sin realizar"],[tc,te,ts]]
}

async infoTareasDesarrollador(id_proyecto){
  let actividades:any
    await (await this.actividadService.findByProjectId(id_proyecto)).toPromise().then(
      async data => { actividades=(data)
  })
  let cantidadTareas=[], actividadesNombre=[]
  let tc=0,te=0,ts=0
  for (let a of actividades){
      let tareas:any
      await (await this.tareaService.findByUserActivityId(this.appComponent.user.id_usuario,a.id_actividad)).toPromise().then(
        async data =>  { tareas=data }) 
        if(tareas)for (let t of tareas ){
            let periodos:any
            let valor=0
          await (await this.tareaPeriodoService.findByTaskId(t.id_tarea)).toPromise().then(
            async data =>  { periodos=data }) 
            if(periodos!=[]){for(let p of periodos){
                if(p.fecha_hora_inicio_real){valor+=0.5}
                if(p.fecha_hora_final_real){valor+=0.5}
              }
            }
            if(valor==0){ts++}else if(valor==periodos.length){tc++}else{te++}
        }
        actividadesNombre.push(a.nombre_actividad)
    }
    
  return [["Tareas completadas","Tareas en progreso","Tareas sin realizar"],[tc,te,ts]]
}

  async tareasEstudiante(){
    let tareas2,tareas3=[]
    await this.tareaService.findByUserId(this.authService.actualUser.id_usuario).toPromise().then(
      data=>{tareas2=data; })
      console.log(this.tareasE)
    let periodosF:any,periodosI:any
    for (let tarea of tareas2){
      await this.tareaPeriodoService.findByTaskId(tarea.id_tarea).toPromise().then(
        data=>{periodosF=data})
      periodosF=await this.sortPeriodosFinal(periodosF)
      periodosI=await this.sortPeriodosInicial(periodosF)
      let fh:any, fh1:any
      if(periodosF.length!=0&&!tarea.id_actividad_proyecto){
        let periodo
        if(periodosF[0].fecha_hora_final_real<periodosI[0].fecha_hora_inicio_real){
          periodo=periodosI[0]
          if(periodo.fecha_hora_inicio_real!=periodo.fecha_hora_inicio_original){
            fh=periodo.fecha_hora_inicio_real
            fh1=periodo.fecha_hora_inicio_original
            let dias=(365*(Number(fh1.substring(0,4))-Number(fh.substring(0,4)))+30*(Number(fh1.substring(5,7))-Number(fh.substring(5,7)))
            +(Number(fh1.substring(8,10))-Number(fh.substring(8,10))))
            let horas=(Number(fh1.substring(11,13))-Number(fh.substring(11,13)))
            if(dias<0){
              if(horas>0){dias++;horas=24-(horas);this.tareasAtrasadasE.push([tarea.nombre_tarea,String(dias*-1)+" días"+" y "+String(horas)+" horas"])} 
              else{this.tareasAtrasadasE.push([tarea.nombre_tarea,String(dias*-1)+" días"+" y "+String(horas*-1)+" horas"])}
            }else if(dias>0){
              if(horas>=0) this.tareasAdelantadasE.push([tarea.nombre_tarea,String(dias)+" días"+" y "+String(horas)+" horas"])
              if(horas<0){dias--;horas=24-(-1*horas);this.tareasAdelantadasE.push([tarea.nombre_tarea,String(dias)+" días"+" y "+String(horas)+" horas"])}
            }else{
              if(horas>0) this.tareasAdelantadasE.push([tarea.nombre_tarea,String(dias)+" días"+" y "+String(horas)+" horas"])
              if(horas<0)this.tareasAtrasadasE.push([tarea.nombre_tarea,String(dias*-1)+" días"+" y "+String(horas*-1)+" horas"])
            }
          }
        } 
        else {
          periodo=periodosF[0]
          if(periodo.fecha_hora_final_real!=periodo.fecha_hora_final_original){
            fh=periodo.fecha_hora_final_real
            fh1=periodo.fecha_hora_final_original
            let dias=(365*(Number(fh1.substring(0,4))-Number(fh.substring(0,4)))+30*(Number(fh1.substring(5,7))-Number(fh.substring(5,7)))
            +(Number(fh1.substring(8,10))-Number(fh.substring(8,10))))
            let horas=(Number(fh1.substring(11,13))-Number(fh.substring(11,13)))
            if(dias<0){
              if(horas>0){dias++;horas=24-(horas);this.tareasAtrasadasE.push([tarea.nombre_tarea,String(dias*-1)+" días"+" y "+String(horas)+" horas"])} 
              else{this.tareasAtrasadasE.push([tarea.nombre_tarea,String(dias*-1)+" días"+" y "+String(horas*-1)+" horas"])}
            }else if(dias>0){
              if(horas>=0) this.tareasAdelantadasE.push([tarea.nombre_tarea,String(dias)+" días"+" y "+String(horas)+" horas"])
              if(horas<0){dias--;horas=24-(-1*horas);this.tareasAdelantadasE.push([tarea.nombre_tarea,String(dias)+" días"+" y "+String(horas)+" horas"])}
            }else{
              if(horas>0) this.tareasAdelantadasE.push([tarea.nombre_tarea,String(dias)+" días"+" y "+String(horas)+" horas"])
              if(horas<0)this.tareasAtrasadasE.push([tarea.nombre_tarea,String(dias*-1)+" días"+" y "+String(horas*-1)+" horas"])
            }
          }
        }
      } 
      
    }
    this.tareasE=tareas3
  }
  sortPeriodosFinal(periodos){
    return periodos.sort((n1,n2)=>{
      if (n1.fecha_hora_final_real > n2.fecha_hora_final_real) return -1;
      if (n1.fecha_hora_final_real < n2.fecha_hora_final_real) return 1;
      return 0;
    })
  }
  sortPeriodosInicial(periodos){
    return periodos.sort((n1,n2)=>{
      if (n1.fecha_hora_inicio_real > n2.fecha_hora_inicio_real) return -1;
      if (n1.fecha_hora_inicio_real < n2.fecha_hora_inicio_real) return 1;
      return 0;
    })
  }
  generateColorArray(num) {
    let colorArray=[],colorArray2 = [];
    for (let i = 0; i < num; i++) {
      let x='rgba(' + String(Math.floor(Math.random() *255))+","+String(Math.floor(Math.random() *255))+","+String(Math.floor(Math.random() *255))
      let y=x+",0.2)", z=x+",1)"
      colorArray.push(y); colorArray2.push(z);
    }
    return [colorArray,colorArray2]
  }
  grafico(canvas,arrayElementos,arrayColores,tipo,labelName){
    return new Chart(canvas.nativeElement, {
      type: tipo ,
      data: {
        labels: arrayElementos[0],
        datasets: [{label: labelName, data: arrayElementos[1],  backgroundColor: arrayColores[0],borderColor:arrayColores[1],borderWidth: 1 }]
      },
      options: { maintainAspectRatio: false, scales: {yAxes: [{ ticks: { beginAtZero: true }}]}}
    });
  }
}

