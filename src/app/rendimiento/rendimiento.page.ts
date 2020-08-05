import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
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

@Component({
  selector: 'app-rendimiento',
  templateUrl: './rendimiento.page.html',
  styleUrls: ['./rendimiento.page.scss']
})
export class RendimientoPage implements OnInit {
  proyectosInteresado:[]
  @ViewChild("barCanvas") barCanvas: ElementRef;
  private barChart: Chart;
  constructor(private tareaService:TareaService, private usuarioService:UsuarioService,private proyectoService:ProyectoService, private tareaPeriodoService:TareaPeriodoService
    ,private actividadService:ActividadService, private interesadoProyectoService:InteresadoProyectoService, private desarrolladorProyectoService:DesarrolladorProyectoService,
    private appComponent: AppComponent, private actividadDesarrolladorService: ActividadDesarrolladorService) { }

  ngOnInit() {
    this.usuariosProyectoInteresado(4)
  }

  ngAfterViewInit(){
    this.horasPorUsuarioProyecto()
  }

  async usuariosProyectoInteresado(id_proyecto){
    /*let i_proyectos
    await this.interesadoProyectoService.findByStakeholderId(this.appComponent.user.id_usuario).toPromise().then(
      data => {
        i_proyectos=data
      }
    )*/
    /*let p_proyectos=[]
    for (let i of i_proyectos){
      await (await this.proyectoService.findByPk(i.id_proyecto)).toPromise().then(
        async data => {
          p_proyectos.push(data)
        }
      )
    }*/
    let desarrolladores:any
      await (await this.desarrolladorProyectoService.findByProjectId(id_proyecto)).toPromise().then(
        async data => {
          desarrolladores=(data)
        }
      )
    let a_desarrolladores=[]
    for (let d of desarrolladores){
      await (await this.actividadDesarrolladorService.findByProjectUserId(id_proyecto,d.id_desarrollador)).toPromise().then(
        async data => {
          a_desarrolladores.push(data)
        }
      )
    }
    let usuarios=[]
    for (let d of desarrolladores){
      await (await this.usuarioService.findByPk(d.id_desarrollador)).toPromise().then(
        async data => {
          usuarios.push(data["nombre"]+" "+data["apellidos"][0]+".")
        }
      )
    }

    let i=0, d_tareas=[]
    for (let d of desarrolladores){
      let tareas=[]
      for (let a of a_desarrolladores[i]){
        await (await this.tareaService.findByUserActivityId(d.id_desarrollador,a.id_actividad)).toPromise().then(
          async data => {
            tareas.push(data)
          }
        )
      }
      d_tareas.push(tareas)
      i++;
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
            if(tp.fecha_hora_inicio_real&&tp.fecha_hora_final_real) 
            valor+=Number(tp.fecha_hora_final_real.substring(11,13))-Number(tp.fecha_hora_inicio_real.substring(11,13))
          }
        }
      }
      valores.push(valor)
      
    }
    console.log([usuarios,valores])
    return [usuarios,valores]
  }

  generateColorArray(num) {
    let colorArray=[],colorArray2 = [];
    for (let i = 0; i < num; i++) {
      let x='rgba(' + String(Math.floor(Math.random() *255))+","+String(Math.floor(Math.random() *255))+","+String(Math.floor(Math.random() *255))
      let y=x+",0.2)"
      let z=x+",1)"
      colorArray.push(y);
      colorArray2.push(z);
    }
    return [colorArray,colorArray2]
  }
  async horasPorUsuarioProyecto(){
    let usuarios = await this.usuariosProyectoInteresado(4)
    let colorArray=this.generateColorArray(usuarios.length)
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      
      type: "horizontalBar",
      data: {
        labels: usuarios[0],
        datasets: [
          {
            label: "Número de horas trabajadas",
            data: usuarios[1],
            backgroundColor: colorArray[0],
            borderColor:colorArray[1],
            borderWidth: 1
          }
        ]
      },
      options: {
          maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}

