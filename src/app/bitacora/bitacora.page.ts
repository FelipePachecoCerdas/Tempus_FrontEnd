import { Component, OnInit } from '@angular/core';
import { ProyectoService } from "../services/proyecto.service";
import { TareaService } from "../services/tarea.service";
import {TareaPeriodoService} from "../services/tarea-periodo.service"
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.page.html',
  styleUrls: ['./bitacora.page.scss'],
})
export class BitacoraPage implements OnInit {
  public tareas:any
  constructor(private tareaService:TareaService, proyectoService:ProyectoService, private authService:AuthService, private tareaPeriodoService: TareaPeriodoService) { }

  async ngOnInit() {
    await this.tareaService.findByUserId(this.authService.actualUser.id_usuario).toPromise().then(
      data=>{
        this.tareas=data
      }
    )
    let periodos:any
    for (let tarea of this.tareas){
      await this.tareaPeriodoService.findByTaskId(tarea.id_tarea).toPromise().then(
        data=>{
          periodos=data
          
        }
      )

      periodos=periodos.sort((n1,n2)=>{
        if (n1.fecha_hora_final_real > n2.fecha_hora_final_real) return -1;
        if (n1.fecha_hora_final_real < n2.fecha_hora_final_real) return 1;
      return 0;
      })
      let fh:any
      if(periodos.length!=0)fh= periodos[0].fecha_hora_final_real
      if(periodos.length!=0) tarea.fecha=fh.substring(8,10)+'-'+ fh.substring(5,7) +'-'+fh.substring(0,4)+' '+fh.substring(11,16)
    }
  }

  calcularCompletitud(){
    
  }

}
