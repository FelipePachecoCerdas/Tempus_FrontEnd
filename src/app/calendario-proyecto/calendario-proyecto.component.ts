/*
import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar'
import { ModalController } from '@ionic/angular';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';

@Component({
  selector: 'app-calendario-tareas',
  templateUrl: './calendario-tareas.component.html',
  styleUrls: ['./calendario-tareas.component.scss'],
})
export class CalendarioTareasComponent implements OnInit {

  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  
  optionsCal: CalendarModalOptions = {
    pickMode: 'multi',  showAdjacentMonthDay: true, color: 'primary'
  };  
  constructor(public modalCtrl: ModalController) {
   }

   async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC',
      cssClass: 'my-cal'
    };

  let myCalendar =  await this.modalCtrl.create({
    component: CalendarModal,
    componentProps: { options }
  });
  myCalendar.present();
}

  onChange($event) {
    console.log($event);
  }

  ngOnInit() {
    this.openCalendar();
  }

}
*/

import { Inject, Injectable, PipeTransform } from '@angular/core';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subHours,
  addMinutes,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter, DateFormatterParams,
  CalendarView,
} from 'angular-calendar';
//import { colors } from '../demo-utils/colors';

import { DOCUMENT } from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';


import { Tarea } from '../tempus-models/tarea';
import { TareaPeriodo } from '../tempus-models/tarea_periodo';
import { TareaAutomatica } from '../tempus-models/tarea_automatica';
import { Usuario } from '../tempus-models/usuario';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { ToastController, Platform, ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TareaService } from '../services/tarea.service';
import { TareaPeriodoService } from '../services/tarea-periodo.service';
import { TareaAutomaticaService } from '../services/tarea-automatica.service';
import { EtiquetaService } from '../services/etiqueta.service';
import { EtiquetaTareaService } from '../services/etiqueta-tarea.service';
import { AuthService } from '../services/auth.service';
import { HorarioEfectivoPorDiaService } from '../services/horario-efectivo-por-dia.service';
import { PeriodoGeneralService } from '../services/periodo-general.service';
import { PeriodoEspecificoService } from '../services/periodo-especifico.service';
import { HorarioEspecificoPorDiaService } from '../services/horario-especifico-por-dia.service';
import { HorarioEfectivoPorDia } from '../tempus-models/horario_efectivo_por_dia';
import { HorarioEspecificoPorDia } from '../tempus-models/horario_especifico_por_dia';
import { PeriodoEspecifico } from '../tempus-models/periodo_especifico';
import { PeriodoGeneral } from '../tempus-models/periodo_general';
import { Etiqueta } from '../tempus-models/etiqueta';
import { EtiquetaTarea } from '../tempus-models/etiqueta_tarea';
import { ProyectoService } from '../services/proyecto.service';
import { Proyecto } from '../tempus-models/proyecto';
import { Actividad } from '../tempus-models/actividad';
import { ActividadService } from '../services/actividad.service';

registerLocaleData(localeEs);

/*const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};*/

const actions: CalendarEventAction[] = [
];

function getDate(dias: number, horas: number) {
  return addHours(startOfDay(addDays(new Date(), dias)), horas);
}

function randomColor() {
  while (true) {
    let hex = Math.floor(Math.random() * 16777215).toString(16);
    let r = parseInt(hex[0] + hex[1], 16);
    let g = parseInt(hex[2] + hex[3], 16);
    let b = parseInt(hex[4] + hex[5], 16);
    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    //console.log(luma);

    if (luma > 40) return { primary: "#" + hex, secondary: "#4b5d67" };
  }
}

function nuevoEvento(idTarea, inicio, final, nombre, color) {
  return {
    id: idTarea,
    start: subHours(inicio, 6),
    end: subHours(final, 6),
    title: nombre,
    color: color,
    actions: actions,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    cssClass: "myClass",
    draggable: true,
    allDay: true,
  }
}


function isoStringToDate(isoString) {

  var dateParts = isoString.split(/\D+/);

  var returnDate = new Date();

  returnDate.setUTCFullYear(parseInt(dateParts[0]));

  returnDate.setUTCMonth(parseInt(dateParts[1]) - 1);
  returnDate.setUTCDate(parseInt(dateParts[2]));

  returnDate.setUTCHours(parseInt(dateParts[3]));
  returnDate.setUTCMinutes(parseInt(dateParts[4]));
  returnDate.setUTCSeconds(parseInt(dateParts[5]));
  returnDate.setUTCMilliseconds(parseInt(dateParts[6]));

  var timezoneOffsetHours = 0;

  if (dateParts[7] || dateParts[8]) {
    var timezoneOffsetMinutes = 0;
    if (dateParts[8]) {
      timezoneOffsetMinutes = parseInt(dateParts[8]) / 60;
    }

    timezoneOffsetHours = parseInt(dateParts[7]) + timezoneOffsetMinutes;

    if (isoString.substr(-6, 1) == "+") {
      timezoneOffsetHours *= -1;
    }
  }

  // Get the current hours for the date and add the offset to get the
  // correct time adjusted for timezone.
  returnDate.setHours(returnDate.getHours() + 6);

  // Return the Date object calculated from the string.
  return returnDate;
}

function deepCopy(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}


export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEEEE', locale);
  }

  public monthViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'MMMM y', locale);
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEEEE', locale);
  }

  public weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'dd MMMMM.', locale);
  }

  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'h', locale) +
      ((new DatePipe(locale).transform(date, 'a', locale) == "a. m.") ? " am" : " pm");
  }

  public dayViewHour({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'h', locale) +
      ((new DatePipe(locale).transform(date, 'a', locale) == "a. m.") ? " am" : " pm");
  }
  public dayViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEEE d - MMMM, y', locale);
  }


  /*
    public dayViewHour({ date, locale }: DateFormatterParams): string {console.log(date, locale);
      return new DatePipe(locale).transform(date, 'HH:mm', locale);
    }
      weekViewTitle({ date, locale, weekStartsOn, excludeDays, daysInWeek, }: DateFormatterParams): string;
      weekViewHour({ date, locale }: DateFormatterParams): string;
      dayViewHour({ date, locale }: DateFormatterParams): string;
      dayViewTitle({ date, locale }: DateFormatterParams): string;*/
}
@Injectable()
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, format: any): any {
    return super.transform(value, format);
  }
};

@Component({
  selector: 'app-calendario-proyecto',
  templateUrl: './calendario-proyecto.component.html',
  styleUrls: ['./calendario-proyecto.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,

    }, DateFormatPipe
  ]
})
export class CalendarioProyectoComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('listaPendientesModal', { static: true }) listaPendientesModal: TemplateRef<any>;
  @ViewChild('updateTareaModal', { static: true }) updateTareaModal: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actualUser: Usuario;
  tareas: Tarea[] = [];
  colores = [];
  tareas_periodos: TareaPeriodo[] = [];
  tareas_automaticas: TareaAutomatica[] = [];

  tareaActual: Tarea = new Tarea(undefined, undefined, undefined, undefined, undefined, undefined, "diariamente", undefined, "ambos", undefined, undefined);
  notificar: boolean;
  repetirHasta: string = new Date().toISOString();
  periodosActuales: TareaPeriodo[] = [];
  periodoAct = { inicio: startOfDay(new Date()).toISOString(), final: startOfDay(new Date()).toISOString(), antNotif: 10 };
  periodoAuto = { inicio: "", final: "" };
  tareaAutomatica: TareaAutomatica = new TareaAutomatica(undefined, "", "", undefined, new Date(), new Date(), "", undefined, undefined, 10, "minutos");
  tareaAutomaticaPer = "horas";
  restDias = ['L', 'K', 'M', 'J', 'V', 'S', 'D'];
  configAuto = false;

  tareaActual_upd: Tarea = new Tarea(undefined, undefined, undefined, undefined, undefined, undefined, "ninguno", undefined, "ambos", undefined, undefined);
  notificar_upd: boolean;
  repetirHasta_upd: string = new Date().toISOString();
  periodosActuales_upd: TareaPeriodo[] = [];
  periodoAct_upd = { inicio: startOfDay(new Date()).toISOString(), final: startOfDay(new Date()).toISOString(), antNotif: 10 };
  periodoAuto_upd = { inicio: "", final: "" };
  tareaAutomatica_upd: TareaAutomatica = new TareaAutomatica(undefined, "", "", undefined, new Date(), new Date(), "", undefined, undefined, 10, "minutos");
  tareaAutomaticaPer_upd = "horas";
  restDias_upd = ['L', 'K', 'M', 'J', 'V', 'S', 'D'];
  configAuto_upd = false;

  horas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  tareasPendientes = this.getTareasPendientes();
  tareasSinProcesar = 0;

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  dias_sub = ['L', 'K', 'M', 'J', 'V', 'S', 'D'];
  diaEscogido = 'Lunes';
  periodosPorDia = {
    'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [], 'Domingo': []
  };
  horariosEfectivos: HorarioEfectivoPorDia[] = [];
  horarioEfectivoAux: HorarioEfectivoPorDia;

  horariosEspecificos: HorarioEspecificoPorDia[] = [];
  horarioEspecifico: HorarioEspecificoPorDia;
  fechaEscogida = new Date();
  horarioEspecifico_aux = subHours(new Date(), 6).toISOString();

  periodosGenerales: PeriodoGeneral[] = [];
  periodosGenerales_Aux = [];
  periodoGeneral = {
    id_horario_general: undefined,
    inicio: this.fromMinutosToDate(0).toISOString(),
    final: this.fromMinutosToDate(0).toISOString()
  }

  periodosEspecificos: PeriodoEspecifico[] = [];
  periodosEspecificos_Aux = [];
  periodoEspecifico = {
    id_horario_especifico: undefined,
    inicio: this.fromMinutosToDate(0).toISOString(),
    final: this.fromMinutosToDate(0).toISOString()
  }


  etiquetas: Etiqueta[] = [];
  etiquetasTareas: EtiquetaTarea[];
  etiqueta = new Etiqueta(undefined, "", "#6a64ff");

  /* NEW */

  proyectoActual = new Proyecto(undefined, "", "", undefined);
  proyectos: Proyecto[] = [];


  actividadActual = new Actividad(undefined, undefined, "", "", undefined, undefined);
  actividad_aux = { fechaInicio: new Date().toISOString(), fechaFinal: new Date().toISOString(), proyecto: undefined };

  proyectoEscogido = "";
  desarrolladores = [];
  interesados = [];

  correoDes = "";
  correoInt = "";

  @ViewChild("tabs", { static: false }) tabs: MatTabGroup;

  activeDayIsOpen: boolean = true;
  cero = 0;

  constructor(private modal: NgbModal,
    @Inject(DOCUMENT) private document,
    public toastController: ToastController,
    public platform: Platform,
    public modalCtrl: ModalController,
    public authServive: AuthService,
    public tareaService: TareaService,
    public tareaPeriodoService: TareaPeriodoService,
    public tareaAutomaticaService: TareaAutomaticaService,
    public etiquetaService: EtiquetaService,
    public etiquetaTareaService: EtiquetaTareaService,
    public horarioEfectivoPorDiaService: HorarioEfectivoPorDiaService,
    public horarioEspecificoPorDiaService: HorarioEspecificoPorDiaService,
    public periodoGeneralService: PeriodoGeneralService,
    public periodoEspecificoService: PeriodoEspecificoService,
    public dateFormatPipe: DateFormatPipe,
    public proyectoService: ProyectoService,
    public actividadService: ActividadService,
    public usuarioService: UsuarioService) {
    //this.resetDB();
    this.actividadActual.descripcion_actividad
  }

  private readonly darkThemeClass = 'dark-theme';

  ngOnInit(): void {
    this.document.body.classList.add(this.darkThemeClass);
    //this.tabs.selectedIndex = 1;
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove(this.darkThemeClass);
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.tabs.selectedIndex = 0;
      this.tabs._tabHeader.focusIndex = 0;
      this.tabs._tabHeader._alignInkBarToSelectedTab(); this.tabs.realignInkBar();
    }, 1000);

    if (!true) await this.resetDB();

    this.actualUser = this.authServive.actualUser;
    console.log(this.actualUser);
    await this.getTareas();
    await this.getEtiquetas();
    await this.getProyectos();

    await this.crearEventos();
    this.calcularTareasSinProcesar();
    await this.cambiarDiaEscogido();
    await this.cambiarFechaEscogida();


    if (this.proyectos.length != 0) this.proyectoEscogido = this.proyectos[0].nombre_proyecto;
    await this.getPersonal();
  }

  async agregarDesarrollador() {
    let usuarios_ = await this.usuarioService.findAll().toPromise() as Usuario[];
    let usuario: Usuario = undefined;
    for (let us of usuarios_) if (us.correo_electronico == this.correoDes) usuario = us;

    if (usuario == undefined) {
      await this.tostearPan("¡No se ha encontrado ningún usuario asociado al correo electrónico indicado!");
      return;
    }

    await this.tostearPan("¡Se ha enviado una invitación a " + usuario.nombre + " " + usuario.apellidos + " para ser parte del proyecto " + this.proyectoEscogido + " como desarrollador!");
  }

  async getPersonal() {

    let proyectote: Proyecto;
    for (let proy of (await this.proyectoService.findAll().toPromise() as Proyecto[]))
      if (proy.nombre_proyecto == this.proyectoEscogido) proyectote = proy;

    this.desarrolladores = [];
    this.interesados = [];
    if (proyectote.nombre_proyecto == "Tempus") {
      this.desarrolladores = ["Jeremy Tencio Morales", "Felipe Pacheco Cerdas"];
      this.interesados = ["Jeremy Tencio Morales"];
    }
    if (proyectote.nombre_proyecto == "KAP") {
      this.desarrolladores = [];
      this.interesados = ["Felipe Pacheco Cerdas"];
    }

  }

  borrarDesarrollador(i: number) {
    this.desarrolladores.splice(i, 1);
  }

  borrarInteresado(i: number) {
    this.interesados.splice(i, 1);
  }

  async agregarInteresado() {
    let usuarios_ = await this.usuarioService.findAll().toPromise() as Usuario[];
    let usuario: Usuario = undefined;
    for (let us of usuarios_) if (us.correo_electronico == this.correoInt) usuario = us;

    if (usuario == undefined) {
      await this.tostearPan("¡No se ha encontrado ningún usuario asociado al correo electrónico indicado!");
      return;
    }

    await this.tostearPan("¡Se ha enviado una invitación a " + usuario.nombre + " " + usuario.apellidos + " para ser parte del proyecto " + this.proyectoEscogido + " como interesado!");
  }



  async registrarProyecto() {
    this.proyectoActual.administrador_proyecto = this.actualUser.id_usuario;
    let maxId = 0;
    let proyectos_ = await this.proyectoService.findAll().toPromise() as Proyecto[];
    for (let proy of proyectos_) if (proy.id_proyecto > maxId) maxId = proy.id_proyecto;
    this.proyectoActual.id_proyecto = maxId + 1;

    await this.proyectoService.create(this.proyectoActual).toPromise();
    await this.getProyectos();
    await this.crearEventos();
    await this.tostearPan("¡El proyecto " + this.proyectoActual.nombre_proyecto + " ha sido creado con éxito!");
  }

  async registrarActividad() {
    let idProyecto: number;
    for (let proy of (await this.proyectoService.findAll().toPromise() as Proyecto[]))
      if (proy.nombre_proyecto == this.actividad_aux.proyecto) idProyecto = proy.id_proyecto;

    this.actividadActual.id_proyecto = idProyecto;
    let maxId = 0;
    let actividades_ = await this.actividadService.findAll().toPromise() as Actividad[];
    for (let act of actividades_) if (act.id_actividad > maxId) maxId = act.id_actividad;
    this.actividadActual.id_actividad = maxId + 1;

    await this.actividadService.create({
      ...this.actividadActual,
      fecha_inicio: this.actividad_aux.fechaInicio,
      fecha_finalizacion: this.actividad_aux.fechaFinal,
    }).toPromise();
    await this.getProyectos();
    await this.crearEventos();
    await this.tostearPan("¡La actividad " + this.actividadActual.nombre_actividad + " ha sido creada con éxito!");
  }

  async getProyectos() {
    let proyectos_ = await this.proyectoService.findAll().toPromise() as Proyecto[];
    this.proyectos = [];
    for (let proy of proyectos_) if (proy.administrador_proyecto == this.actualUser.id_usuario) this.proyectos.push(proy);

  }

  async getEtiquetas() {
    let etiquetas_ = await this.etiquetaService.findAll().toPromise() as Etiqueta[];
    this.etiquetas = [];
    for (let etiqueta of etiquetas_) if (etiqueta.id_usuario == this.actualUser.id_usuario) this.etiquetas.push(etiqueta);

    let etiquetasTareas_ = await this.etiquetaTareaService.findAll().toPromise() as EtiquetaTarea[];
    this.etiquetasTareas = [];
    for (let et of etiquetasTareas_) if (et.id_usuario == this.actualUser.id_usuario) this.etiquetasTareas.push(et);

  }

  async agregarEtiqueta() {
    this.etiqueta.id_usuario = this.actualUser.id_usuario;
    await this.etiquetaService.create(this.etiqueta).toPromise();
    await this.getEtiquetas();
  }

  async borrarEtiqueta(i: number) {
    let et = this.etiquetas[i];

    await this.etiquetaService.delete(et.id_usuario, et.nombre_etiqueta).toPromise();
    await this.getEtiquetas();
  }

  periodosDiaEscogido() {
    return this.periodosPorDia[this.diaEscogido];
  }

  fromMinutosToDate(minutos): Date {
    let date: Date = startOfDay(new Date());
    date = addHours(date, Math.floor(minutos / 60));
    date = addMinutes(date, minutos % 60);
    return date;
  }

  async cambiarDiaEscogido() {
    await this.cargarPeriodos();
    for (let he of this.horariosEfectivos) if (this.dias_sub.indexOf(he.dia) == this.dias.indexOf(this.diaEscogido)) this.horarioEfectivoAux = he;

    this.periodosGenerales_Aux = [];
    for (let pg of this.periodosGenerales) {
      if (this.horarioEfectivoAux.id_horario_efectivo == pg.id_horario_general) {
        this.periodosGenerales_Aux.push({
          id_horario_general: pg.id_horario_general,
          inicio: this.fromMinutosToDate(pg.minutos_tiempo_inicial),
          final: this.fromMinutosToDate(pg.minutos_tiempo_finalizacion)
        })
      }
    }
  }

  async cambiarFechaEscogida() {
    await this.cargarPeriodos();

    this.fechaEscogida = isoStringToDate(this.horarioEspecifico_aux);

    let horarioEfectivo: HorarioEfectivoPorDia;

    let diaSemana = ((this.fechaEscogida.getDay() - 1) == -1) ? 6 : (this.fechaEscogida.getDay() - 1);
    for (let he of this.horariosEfectivos) if (this.dias_sub.indexOf(he.dia) == diaSemana) horarioEfectivo = he;

    this.horarioEspecifico = undefined;

    for (let hes of this.horariosEspecificos) {
      let vals = (hes.fecha as unknown as string).split("-");
      let date = new Date();
      date.setFullYear(Number.parseInt(vals[0]));
      date.setDate(Number.parseInt(vals[2]));
      date.setMonth(Number.parseInt(vals[1]) - 1);

      if (hes.id_horario_efectivo == horarioEfectivo.id_horario_efectivo &&
        startOfDay(date).getTime() == startOfDay(this.fechaEscogida).getTime()) {
        this.horarioEspecifico = deepCopy(hes);
      }
    }

    if (this.horarioEspecifico == undefined) {

      let maxIdHES = 0;
      let horariosEspecificos_ = await this.horarioEspecificoPorDiaService.findAll().toPromise() as HorarioEspecificoPorDia[];
      for (let hes of horariosEspecificos_) if (hes.id_horario_especifico > maxIdHES) maxIdHES = hes.id_horario_especifico;

      await this.horarioEspecificoPorDiaService.create({
        id_horario_efectivo: horarioEfectivo.id_horario_efectivo,
        id_horario_especifico: maxIdHES + 1,
        fecha: this.horarioEspecifico_aux
      }).toPromise();

      this.horarioEspecifico = new HorarioEspecificoPorDia(maxIdHES + 1, this.fechaEscogida, horarioEfectivo.id_horario_efectivo);
    }

    await this.cargarPeriodos();

    this.periodosEspecificos_Aux = [];
    for (let pe of this.periodosEspecificos) {
      if (pe.id_horario_especifico == this.horarioEspecifico.id_horario_especifico) {

        this.periodosEspecificos_Aux.push({
          id_horario_especifico: pe.id_horario_especifico,
          inicio: this.fromMinutosToDate(pe.minutos_tiempo_inicial),
          final: this.fromMinutosToDate(pe.minutos_tiempo_finalizacion)
        })
      }
    }


  }

  async cargarPeriodos() {
    this.horariosEfectivos = [];
    this.horariosEspecificos = [];
    this.periodosGenerales = [];
    this.periodosEspecificos = [];

    let horariosEfectivos_ = await this.horarioEfectivoPorDiaService.findAll().toPromise() as HorarioEfectivoPorDia[];
    for (let he of horariosEfectivos_) if (he.id_usuario == this.actualUser.id_usuario) this.horariosEfectivos.push(he);

    let horariosEspecificos_ = await this.horarioEspecificoPorDiaService.findAll().toPromise() as HorarioEspecificoPorDia[];
    for (let he of this.horariosEfectivos) for (let hes of horariosEspecificos_) if (he.id_horario_efectivo == hes.id_horario_efectivo) this.horariosEspecificos.push(hes);

    let periodosGenerales_ = await this.periodoGeneralService.findAll().toPromise() as PeriodoGeneral[];
    for (let he of this.horariosEfectivos) for (let pg of periodosGenerales_) if (he.id_horario_efectivo == pg.id_horario_general) this.periodosGenerales.push(pg);

    let periodosEspecificos_ = await this.periodoEspecificoService.findAll().toPromise() as PeriodoEspecifico[];
    for (let hes of this.horariosEspecificos) for (let pe of periodosEspecificos_) if (hes.id_horario_especifico == pe.id_horario_especifico) this.periodosEspecificos.push(pe);

    if (this.horariosEfectivos.length == 0) {
      let maxIdHE = 0;
      for (let he of horariosEfectivos_) if (he.id_horario_efectivo > maxIdHE) maxIdHE = he.id_horario_efectivo;

      for (let i = 0; i < this.dias.length; i++) {
        let dia = this.dias_sub[i];
        await this.horarioEfectivoPorDiaService.create(new HorarioEfectivoPorDia(maxIdHE + i + 1, dia, this.actualUser.id_usuario)).toPromise();
      }

      horariosEfectivos_ = await this.horarioEfectivoPorDiaService.findAll().toPromise() as HorarioEfectivoPorDia[];
      for (let he of horariosEfectivos_) if (he.id_usuario == this.actualUser.id_usuario) this.horariosEfectivos.push(he);

    }

  }

  fromDaySubToNum(dia_sub) {
    return this.dias_sub.indexOf(dia_sub);
  }

  async resetDB() {
    //await this.usuarioService.deleteAll().toPromise();
    await this.tareaService.deleteAll().toPromise();
    await this.tareaPeriodoService.deleteAll().toPromise();
    await this.tareaAutomaticaService.deleteAll().toPromise();
    await this.etiquetaService.deleteAll().toPromise();
    await this.etiquetaTareaService.deleteAll().toPromise();

    let usuarios_const: Usuario[] = [
      new Usuario(1, "Felipe", "Pacheco Cerdas", "hola", "felipepace09@gmail.com",
        "Estudiante", "Soy único y diferente", undefined, undefined),
      new Usuario(2, "Jeremy", "Tencio Morales", "hola", "jdtm23@gmail.com",
        "Desarrollador", "La vida es profunda", undefined, undefined),
    ]
    //await this.usuarioService.create(usuarios_const[0]).toPromise();
    //await this.usuarioService.create(usuarios_const[1]).toPromise();

    let tareas_const: Tarea[] = [
      new Tarea(0, 0, 1, undefined, "Investigar sobre blockchain",
        "Investigar y documentar fuentes sobre la tecnología de blockchain",
        undefined, "0", "correo electronico", "manual", undefined),
      new Tarea(1, 0, 1, undefined, "Generar documento de investigación",
        "De acuerdo con lo investigado, generar un reporte de investigación",
        undefined, "1", "correo electronico", "manual", undefined),
      new Tarea(2, 0, 1, undefined, "Entrenamiento en Solidity, Truffle y Ganache",
        "Investigar y entrenar sobre el lenguaje de Solidity con el uso del compilador Truffle y la herramienta Ganache",
        undefined, "1", "celular", "automatico", undefined),
      new Tarea(3, 0, 2, undefined, "Entrenamiento en Python y NodeJS",
        "Investigar y entrenar sobre el lenguaje de Python y la tecnologia de NodeJS",
        undefined, "1", "celular", "automatico", undefined),
    ]
    await this.tareaService.create(tareas_const[0]).toPromise();
    await this.tareaService.create(tareas_const[1]).toPromise();
    await this.tareaService.create(tareas_const[2]).toPromise();
    await this.tareaService.create(tareas_const[3]).toPromise();

    let tareas_periodos_const: TareaPeriodo[] = [
      new TareaPeriodo(0, getDate(1, 12), getDate(1, 17), undefined, undefined, 100),
      new TareaPeriodo(0, getDate(2, 7), getDate(2, 11), undefined, undefined, 100),
      new TareaPeriodo(1, getDate(2, 13), getDate(2, 17), undefined, undefined, 100),
    ]
    await this.tareaPeriodoService.create(tareas_periodos_const[0]).toPromise();
    await this.tareaPeriodoService.create(tareas_periodos_const[1]).toPromise();
    await this.tareaPeriodoService.create(tareas_periodos_const[2]).toPromise();

    let tareas_automaticas_const: TareaAutomatica[] = [
      new TareaAutomatica(2, "medio", "alto", 270, new Date(), undefined, "LKJ", undefined, undefined, 10, "minutos"),
      new TareaAutomatica(3, "medio", "alto", 270, new Date(), undefined, "LKJ", undefined, undefined, 10, "minutos")
    ];
    await this.tareaAutomaticaService.create(tareas_automaticas_const[0]).toPromise();
    await this.tareaAutomaticaService.create(tareas_automaticas_const[1]).toPromise();


  }

  async getTareas() {
    //this.usuarios = [];
    this.tareas = [];
    this.tareas_periodos = [];
    this.tareas_automaticas = [];

    //this.usuarios = await this.usuarioService.findAll().toPromise() as Usuario[];

    let allTareas = await this.tareaService.findAll().toPromise() as Tarea[];

    for (let tarea of allTareas)
      if (tarea.id_usuario == this.actualUser.id_usuario) {
        tarea.repetir_hasta = (tarea.repetir_hasta) ? isoStringToDate(tarea.repetir_hasta) : tarea.repetir_hasta;
        this.tareas.push(tarea);
      }
    let allTareasPeriodos = await this.tareaPeriodoService.findAll().toPromise() as TareaPeriodo[];
    for (let tarea of this.tareas)
      for (let tareaPeriodo of allTareasPeriodos)
        if (tarea.id_tarea == tareaPeriodo.id_tarea) {
          tareaPeriodo.fecha_hora_inicio_original = (tareaPeriodo.fecha_hora_inicio_original) ? isoStringToDate(tareaPeriodo.fecha_hora_inicio_original) : tareaPeriodo.fecha_hora_inicio_original;
          tareaPeriodo.fecha_hora_final_original = (tareaPeriodo.fecha_hora_final_original) ? isoStringToDate(tareaPeriodo.fecha_hora_final_original) : tareaPeriodo.fecha_hora_final_original;
          tareaPeriodo.fecha_hora_inicio_real = (tareaPeriodo.fecha_hora_inicio_real) ? isoStringToDate(tareaPeriodo.fecha_hora_inicio_real) : tareaPeriodo.fecha_hora_inicio_real;
          tareaPeriodo.fecha_hora_final_real = (tareaPeriodo.fecha_hora_final_real) ? isoStringToDate(tareaPeriodo.fecha_hora_final_real) : tareaPeriodo.fecha_hora_final_real;

          this.tareas_periodos.push(tareaPeriodo);
        }

    let allTareasAutomaticas = await this.tareaAutomaticaService.findAll().toPromise() as TareaAutomatica[];
    for (let tarea of this.tareas)
      for (let tareaAutomatica of allTareasAutomaticas)
        if (tarea.id_tarea == tareaAutomatica.id_tarea) {
          tareaAutomatica.restriccion_finalizacion = (tareaAutomatica.restriccion_finalizacion) ? isoStringToDate(tareaAutomatica.restriccion_finalizacion) : tareaAutomatica.restriccion_finalizacion;
          this.tareas_automaticas.push(tareaAutomatica);
        }

  }

  getTareasPendientes() {
    let result: Tarea[] = [];
    for (let tareaP of this.tareas_automaticas) {
      for (let tarea of this.tareas) {
        if (tarea.id_usuario == this.actualUser.id_usuario &&
          tarea.id_tarea == tareaP.id_tarea) {
          result.push(tarea);
        }
      }
    }
    return result;
  }

  calcularTareasSinProcesar() {
    this.tareasPendientes = this.getTareasPendientes();
    this.tareasSinProcesar = this.tareasPendientes.length;
  }

  async crearEventos() {
    this.events = [];
    await this.getProyectos();
    let actividades: Actividad[] = [];
    let actividades_ = await this.actividadService.findAll().toPromise() as Actividad[];
    for (let proy of this.proyectos)
      for (let act of actividades_)
        if (act.id_proyecto == proy.id_proyecto) actividades.push(act);


    for (let act of actividades) {
      console.log(act);

      let colorTarea = undefined;
      //for (let color of this.colores) if (color.id_tarea == tarea.id_tarea) colorTarea = color.color_tarea;
      if (colorTarea == undefined) {
        colorTarea = randomColor();
        //this.colores.push({ id_tarea: tarea.id_tarea, color_tarea: colorTarea });
      }


      let vals = (act.fecha_inicio as unknown as string).split("-");
      let date = new Date();
      date.setFullYear(Number.parseInt(vals[0]));
      date.setDate(Number.parseInt(vals[2]));
      date.setMonth(Number.parseInt(vals[1]) - 1);

      let vals2 = (act.fecha_finalizacion as unknown as string).split("-");
      let date2 = new Date();
      date2.setFullYear(Number.parseInt(vals2[0]));
      date2.setDate(Number.parseInt(vals2[2]));
      date2.setMonth(Number.parseInt(vals2[1]) - 1);

      let proyecto: Proyecto;
      for (let proy of this.proyectos) if (act.id_proyecto == proy.id_proyecto) proyecto = proy;

      this.events.push(nuevoEvento(act.id_actividad, date, date2, act.nombre_actividad + " (" + proyecto.nombre_proyecto + ")", colorTarea));

    }

    this.dayClicked({ date: new Date(), events: [] });


  }

  cambiarConfigAuto() {
    this.configAuto = !this.configAuto;
  }

  cambiarConfigAuto_upd() {
    this.configAuto_upd = !this.configAuto_upd;
  }

  async programarTareas() {
    for (let tarea of this.tareasPendientes) {

      let autoTar: TareaAutomatica;
      for (let tareaA of this.tareas_automaticas) {
        if (tareaA.id_tarea == tarea.id_tarea) {
          autoTar = tareaA;
          break;
        }
      }
      console.log(this.tareas_periodos);


      let horas = autoTar.duracion_estimada;
      horas *= (autoTar.duracion_estimada_medida == "dias") ? 24 : 1;
      horas /= (autoTar.duracion_estimada_medida == "minutos") ? 60 : 1;
      horas = Math.floor(horas);

      let date = startOfDay(addDays(new Date(), 1));

      while (horas > 0) {

        console.log(horas);

        let sirve = true;
        for (let tp of this.tareas_periodos)
          if (startOfDay(subHours(tp.fecha_hora_inicio_original, 6)).getDate() == date.getDate() ||
            startOfDay(subHours(tp.fecha_hora_final_original, 6)).getDate() == date.getDate()) {
            console.log(tp);
            sirve = false;
          }



        if (sirve) {

          if (horas < 10) {
            let tareaPeriodo1 = new TareaPeriodo(autoTar.id_tarea, addHours(date, 7), addHours(date, 7 + horas), undefined, undefined, autoTar.antelacion_notificacion);
            await this.tareaPeriodoService.create(tareaPeriodo1).toPromise();

          } else {
            let tareaPeriodo1 = new TareaPeriodo(autoTar.id_tarea, addHours(date, 7), addHours(date, 12), undefined, undefined, autoTar.antelacion_notificacion);
            let tareaPeriodo2 = new TareaPeriodo(autoTar.id_tarea, addHours(date, 13), addHours(date, 17), undefined, undefined, autoTar.antelacion_notificacion);
            await this.tareaPeriodoService.create(tareaPeriodo1).toPromise();
            await this.tareaPeriodoService.create(tareaPeriodo2).toPromise();
          }
          //await this.tareaPeriodoService.create(tareaPeriodo).toPromise();
          horas -= 10;
        }

        date = addDays(date, 1);

      }
      let tareaBD = await (await this.tareaService.findByPk(autoTar.id_tarea)).toPromise() as Tarea;
      tareaBD.modo_tarea = "manual";
      await this.tareaAutomaticaService.delete(autoTar.id_tarea).toPromise();
      await this.tareaService.update(autoTar.id_tarea, tareaBD).toPromise();

      this.calcularTareasSinProcesar();
      await this.getTareas();

    }

    this.modal.dismissAll();
    //this.tareas_automaticas = [];
    await this.getTareas();
    this.calcularTareasSinProcesar();
    await this.crearEventos();

    await this.tostearPan('¡Las tareas automáticas han sido programadas con éxito!');
  }

  async registrarTarea(event) {

    if (this.tareaActual.modo_tarea == undefined) {
      await this.tostearPan('¡Tarea no registrada! Debe indicar algún de programación de la tarea (Manual o Automático).');
      return;
    }
    let maxId = 0;
    let allTareas = await this.tareaService.findAll().toPromise() as Tarea[];
    for (let tarea of allTareas) if (tarea.id_tarea > maxId) maxId = tarea.id_tarea;
    this.tareaActual.id_tarea = maxId + 1;

    this.tareaActual.repetir_hasta = (this.tareaActual.repetir_hasta) ? isoStringToDate(this.repetirHasta) : this.tareaActual.repetir_hasta;
    this.tareaActual.id_usuario = this.actualUser.id_usuario;
    this.tareaActual.notificar = (this.notificar) ? "1" : "0";
    if (this.tareaActual.notificar == "0") this.tareaActual.modo_notificar = undefined;
    if (this.tareaActual.repeticion == "ninguno") { this.tareaActual.repeticion = undefined; this.tareaActual.repetir_hasta = undefined; }

    await this.tareaService.create(this.tareaActual).toPromise();
    //this.tareas.push(deepCopy(this.tareaActual) as Tarea);
    // meter en BD

    if (this.tareaActual.modo_tarea == "manual") {
      for (let periodo of this.periodosActuales) {
        periodo.id_tarea = maxId + 1;
        if (this.tareaActual.notificar == "0") periodo.antelacion_notificacion = undefined;

        await this.tareaPeriodoService.create(periodo).toPromise();
        //this.tareas_periodos.push(deepCopy(periodo) as TareaPeriodo);
        // meter en BD
      }
      await this.getTareas();
      await this.crearEventos();
    } else {
      this.tareaAutomatica.id_tarea = maxId + 1;
      this.tareaAutomatica.restriccion_inicio = (this.periodoAuto.inicio == "") ? undefined : isoStringToDate(this.periodoAuto.inicio);
      this.tareaAutomatica.restriccion_finalizacion = (this.periodoAuto.final == "") ? undefined : isoStringToDate(this.periodoAuto.final);
      this.tareaAutomatica.restriccion_dias = "";
      for (let rest of this.restDias) this.tareaAutomatica.restriccion_dias += rest;
      // guarda los minutos 
      if (this.tareaActual.notificar == "0") this.tareaAutomatica.antelacion_notificacion = undefined;

      await this.tareaAutomaticaService.create(this.tareaAutomatica).toPromise();
      //this.tareas_automaticas.push(deepCopy(this.tareaAutomatica) as TareaAutomatica);
      // meter en BD
      await this.getTareas();
      this.calcularTareasSinProcesar();
    }

    await this.tostearPan('¡La tarea \"' + this.tareaActual.nombre_tarea + '\" ha sido registrada con éxito!');
  }

  async borrarTarea() {
    await this.tareaService.delete(this.tareaActual_upd.id_tarea).toPromise();

    await this.getTareas();
    this.calcularTareasSinProcesar();
    await this.crearEventos();
    this.modal.dismissAll();
    await this.tostearPan('¡La tarea \"' + this.tareaActual_upd.nombre_tarea + '\" ha sido eliminada permanentemente!');

  }

  async actualizarTarea() {

    if (this.tareaActual_upd.modo_tarea == undefined) {
      await this.tostearPan('¡Tarea no actualizada! Debe indicar algún de programación de la tarea (Manual o Automático).');
      return;
    }

    this.tareaActual_upd.repetir_hasta = (this.tareaActual_upd.repetir_hasta) ? isoStringToDate(this.repetirHasta_upd) : this.tareaActual_upd.repetir_hasta;
    this.tareaActual_upd.id_usuario = this.actualUser.id_usuario;
    this.tareaActual_upd.notificar = (this.notificar_upd) ? "1" : "0";
    if (this.tareaActual_upd.notificar == "0") this.tareaActual_upd.modo_notificar = undefined;
    if (this.tareaActual_upd.repeticion == "ninguno") { this.tareaActual_upd.repeticion = undefined; this.tareaActual_upd.repetir_hasta = undefined; }

    let tareaActualOld: Tarea;
    for (let tarea of this.tareas) if (tarea.id_tarea == this.tareaActual_upd.id_tarea) tareaActualOld = tarea;

    await this.tareaService.update(this.tareaActual_upd.id_tarea, this.tareaActual_upd).toPromise();

    if (this.tareaActual_upd.modo_tarea == "manual" && tareaActualOld.modo_tarea == "manual") {
      console.log("MM");

      for (let tareaPeriodo of this.tareas_periodos) {
        if (tareaPeriodo.id_tarea == this.tareaActual_upd.id_tarea) {
          await this.tareaPeriodoService.delete(tareaPeriodo.id_tarea, this.pasarDateIso(tareaPeriodo.fecha_hora_inicio_original), this.pasarDateIso(tareaPeriodo.fecha_hora_final_original)).toPromise();
        }
      }

      for (let tareaPeriodo of this.periodosActuales_upd) {
        await this.tareaPeriodoService.create(tareaPeriodo).toPromise();
      }

    } else if (this.tareaActual_upd.modo_tarea == "manual" && tareaActualOld.modo_tarea == "automatico") {
      console.log("MA");

      await this.tareaAutomaticaService.delete(this.tareaActual_upd.id_tarea).toPromise();
      for (let tareaPeriodo of this.periodosActuales_upd) {
        await this.tareaPeriodoService.create(tareaPeriodo).toPromise();
      }


    } else if (this.tareaActual_upd.modo_tarea == "automatico" && tareaActualOld.modo_tarea == "automatico") {
      console.log("AA");

      this.tareaAutomatica_upd.id_tarea = this.tareaActual_upd.id_tarea;
      this.tareaAutomatica_upd.restriccion_inicio = (this.periodoAuto_upd.inicio == "") ? undefined : isoStringToDate(this.periodoAuto_upd.inicio);
      this.tareaAutomatica_upd.restriccion_finalizacion = (this.periodoAuto_upd.final == "") ? undefined : isoStringToDate(this.periodoAuto_upd.final);
      this.tareaAutomatica_upd.restriccion_dias = "";
      for (let rest of this.restDias_upd) this.tareaAutomatica_upd.restriccion_dias += rest;
      // guarda los minutos 
      if (this.tareaActual_upd.notificar == "0") this.tareaAutomatica_upd.antelacion_notificacion = undefined;

      await this.tareaAutomaticaService.update(this.tareaAutomatica_upd.id_tarea, this.tareaAutomatica_upd).toPromise();

    } else { // automatico y manual
      console.log("AM");

      for (let tareaPeriodo of this.tareas_periodos) {
        if (tareaPeriodo.id_tarea == this.tareaActual_upd.id_tarea) {
          await this.tareaPeriodoService.delete(tareaPeriodo.id_tarea, this.pasarDateIso(tareaPeriodo.fecha_hora_inicio_original), this.pasarDateIso(tareaPeriodo.fecha_hora_final_original)).toPromise();
        }
      }

      this.tareaAutomatica_upd.id_tarea = this.tareaActual_upd.id_tarea;
      this.tareaAutomatica_upd.restriccion_inicio = (this.periodoAuto_upd.inicio == "") ? undefined : isoStringToDate(this.periodoAuto_upd.inicio);
      this.tareaAutomatica_upd.restriccion_finalizacion = (this.periodoAuto_upd.final == "") ? undefined : isoStringToDate(this.periodoAuto_upd.final);
      this.tareaAutomatica_upd.restriccion_dias = "";
      for (let rest of this.restDias_upd) this.tareaAutomatica_upd.restriccion_dias += rest;
      // guarda los minutos 
      if (this.tareaActual_upd.notificar == "0") this.tareaAutomatica_upd.antelacion_notificacion = undefined;

      await this.tareaAutomaticaService.create(this.tareaAutomatica_upd).toPromise();


    }

    await this.getTareas();
    this.calcularTareasSinProcesar();
    await this.crearEventos();
    this.modal.dismissAll();
    await this.tostearPan('¡La tarea \"' + this.tareaActual_upd.nombre_tarea + '\" ha sido actualizada con éxito!');

    //this.tareas.push(deepCopy(this.tareaActual) as Tarea);
    // meter en BD
    return;

    if (this.tareaActual.modo_tarea == "manual") {
      for (let periodo of this.periodosActuales) {
        periodo.id_tarea = 0 + 1;
        if (this.tareaActual.notificar == "0") periodo.antelacion_notificacion = undefined;

        await this.tareaPeriodoService.create(periodo).toPromise();
        //this.tareas_periodos.push(deepCopy(periodo) as TareaPeriodo);
        // meter en BD
      }
      this.events = [];
      await this.getTareas();
      await this.crearEventos();
    } else {
      this.tareaAutomatica.id_tarea = 0 + 1;
      this.tareaAutomatica.restriccion_inicio = (this.periodoAuto.inicio == "") ? undefined : isoStringToDate(this.periodoAuto.inicio);
      this.tareaAutomatica.restriccion_finalizacion = (this.periodoAuto.final == "") ? undefined : isoStringToDate(this.periodoAuto.final);
      this.tareaAutomatica.restriccion_dias = "";
      for (let rest of this.restDias) this.tareaAutomatica.restriccion_dias += rest;
      if (this.tareaAutomatica.duracion_estimada_medida == "horas") this.tareaAutomatica.duracion_estimada *= 60;
      if (this.tareaAutomatica.duracion_estimada_medida == "dias") this.tareaAutomatica.duracion_estimada *= (60 * 24);
      // guarda los minutos 
      if (this.tareaActual.notificar == "0") this.tareaAutomatica.antelacion_notificacion = undefined;

      await this.tareaAutomaticaService.create(this.tareaAutomatica).toPromise();
      //this.tareas_automaticas.push(deepCopy(this.tareaAutomatica) as TareaAutomatica);
      // meter en BD
      await this.getTareas();
      this.calcularTareasSinProcesar();
    }

    await this.tostearPan('¡La tarea \"' + this.tareaActual.nombre_tarea + '\" ha sido registrada con éxito!');


  }

  async tostearPan(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'light',
      duration: 2000
    });
    toast.present();
  }

  agregarPeriodo() {
    this.periodosActuales.push(new TareaPeriodo(undefined, isoStringToDate(this.periodoAct.inicio), isoStringToDate(this.periodoAct.final), undefined, undefined, this.periodoAct.antNotif));
  }

  borrarPeriodo(i) {
    this.periodosActuales.splice(i, 1);
  }

  agregarPeriodo_upd() {
    this.periodosActuales_upd.push(new TareaPeriodo(this.tareaActual_upd.id_tarea, isoStringToDate(this.periodoAct_upd.inicio), isoStringToDate(this.periodoAct_upd.final), undefined, undefined, this.periodoAct_upd.antNotif));
  }

  fromDateToMinutes(date: Date) {
    let minutos = 0;
    minutos += date.getHours() * 60;
    minutos += date.getMinutes();
    return minutos;
  }

  async agregarPeriodo_PG() {
    await this.periodoGeneralService.create(new PeriodoGeneral(this.horarioEfectivoAux.id_horario_efectivo,
      this.fromDateToMinutes(isoStringToDate(this.periodoGeneral.inicio)),
      this.fromDateToMinutes(isoStringToDate(this.periodoGeneral.final))
    )).toPromise();
    await this.cambiarDiaEscogido();
    //this.periodosActuales_upd.push(new TareaPeriodo(this.tareaActual_upd.id_tarea, isoStringToDate(this.periodoAct_upd.inicio), isoStringToDate(this.periodoAct_upd.final), undefined, undefined, this.periodoAct_upd.antNotif));
  }

  async agregarPeriodo_PE() {
    console.log(this.horarioEspecifico);

    await this.periodoEspecificoService.create(new PeriodoEspecifico(this.horarioEspecifico.id_horario_especifico,
      this.fromDateToMinutes(isoStringToDate(this.periodoEspecifico.inicio)),
      this.fromDateToMinutes(isoStringToDate(this.periodoEspecifico.final))
    )).toPromise();
    await this.cambiarFechaEscogida();
    //this.periodosActuales_upd.push(new TareaPeriodo(this.tareaActual_upd.id_tarea, isoStringToDate(this.periodoAct_upd.inicio), isoStringToDate(this.periodoAct_upd.final), undefined, undefined, this.periodoAct_upd.antNotif));
  }

  async borrarPeriodo_PE(i: number) {
    let periodoEspecificoBorrar = this.periodosEspecificos_Aux[i];

    await this.periodoEspecificoService.delete(this.horarioEspecifico.id_horario_especifico,
      this.fromDateToMinutes(periodoEspecificoBorrar.inicio),
      this.fromDateToMinutes(periodoEspecificoBorrar.final)
    ).toPromise();
    await this.cambiarFechaEscogida();
    //this.periodosActuales_upd.push(new TareaPeriodo(this.tareaActual_upd.id_tarea, isoStringToDate(this.periodoAct_upd.inicio), isoStringToDate(this.periodoAct_upd.final), undefined, undefined, this.periodoAct_upd.antNotif));
  }


  async borrarPeriodo_PG(i: number) {
    let periodoGeneralBorrar = this.periodosGenerales_Aux[i];

    await this.periodoGeneralService.delete(this.horarioEfectivoAux.id_horario_efectivo,
      this.fromDateToMinutes(periodoGeneralBorrar.inicio),
      this.fromDateToMinutes(periodoGeneralBorrar.final)
    ).toPromise();
    await this.cambiarDiaEscogido();
    //this.periodosActuales_upd.push(new TareaPeriodo(this.tareaActual_upd.id_tarea, isoStringToDate(this.periodoAct_upd.inicio), isoStringToDate(this.periodoAct_upd.final), undefined, undefined, this.periodoAct_upd.antNotif));

  }

  borrarPeriodo_upd(i) {
    this.periodosActuales_upd.splice(i, 1);
  }

  abrirPendientes() {
    this.modal.open(this.listaPendientesModal, {
      size: 'lg', centered: true
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  pasarDateIso(fecha: Date) {
    return subHours(fecha, 6).toISOString();
  }

  async eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent) {
    let tareaEvento: Tarea;
    let tareaPeriodoEvento;

    for (let tarea of this.tareas) if (tarea.id_tarea == event.id) tareaEvento = tarea;
    //console.log(this.tareas_periodos);
    //console.log(subHours(this.tareas_periodos[3].fecha_hora_inicio_original, 6).toISOString());

    for (let tareaP of this.tareas_periodos) {
      if (tareaP.id_tarea == event.id &&
        tareaP.fecha_hora_inicio_original.getTime() == addHours(event.start, 6).getTime() &&
        tareaP.fecha_hora_final_original.getTime() == addHours(event.end, 6).getTime()) {
        //console.log(tareaP);
        tareaPeriodoEvento = deepCopy(tareaP);
        tareaPeriodoEvento.fecha_hora_inicio_original = this.pasarDateIso(addHours(newStart, 6));
        tareaPeriodoEvento.fecha_hora_final_original = this.pasarDateIso(addHours(newEnd, 6));
        tareaPeriodoEvento.fecha_hora_inicio_real = (tareaPeriodoEvento.fecha_hora_inicio_real)
          ? this.pasarDateIso(tareaPeriodoEvento.fecha_hora_inicio_real) : tareaPeriodoEvento.fecha_hora_inicio_real;
        tareaPeriodoEvento.fecha_hora_final_real = (tareaPeriodoEvento.fecha_hora_final_real)
          ? this.pasarDateIso(tareaPeriodoEvento.fecha_hora_final_real) : tareaPeriodoEvento.fecha_hora_final_real;
        break;
      }
    }

    //console.log(tareaPeriodoEvento, this.pasarDateIso(event.start), this.pasarDateIso(event.end));
    //console.log(await this.tareaPeriodoService.findAll().toPromise());
    //console.log(await this.tareaPeriodoService.findByPk(tareaPeriodoEvento.id_tarea, this.pasarDateIso(event.start), this.pasarDateIso(event.end)).toPromise());
    //return;
    await this.tareaPeriodoService.update(tareaPeriodoEvento.id_tarea, this.pasarDateIso(addHours(event.start, 6)), this.pasarDateIso(addHours(event.end, 6)), tareaPeriodoEvento).toPromise();
    await this.getTareas();
    await this.crearEventos();
    this.calcularTareasSinProcesar();

    await this.tostearPan('¡El periodo de la tarea \"' + tareaEvento.nombre_tarea + '\" ha sido desplazado con éxito!');

    /*
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        // AQUI HACER ALGO
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    //this.handleEvent('Dropped or resized', event);
    */
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //console.log(event);
    if (action != 'Clicked') return;

    this.modal.open(this.updateTareaModal, { size: 'lg', centered: true, windowClass: 'modalWTF', backdropClass: 'modalWTF' });
    this.cargarTareaUpdate(event);

    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  abrirUpdatePendiente(indiceTarea: number) {
    console.log(this.tareas_periodos);
    this.modal.open(this.updateTareaModal, { size: 'lg', centered: true, windowClass: 'modalWTF', backdropClass: 'modalWTF' });


    let tareaEvento: Tarea = this.tareasPendientes[indiceTarea];

    //for (let tarea of this.tareas) if (tarea.id_tarea == indiceTarea) tareaEvento = tarea;
    //console.log(this.tareas_periodos);
    //console.log(subHours(this.tareas_periodos[3].fecha_hora_inicio_original, 6).toISOString());

    this.tareaActual_upd = deepCopy(tareaEvento);
    this.tareaActual_upd.repeticion = (this.tareaActual_upd.repeticion) ? this.tareaActual_upd.repeticion : "ninguno";
    this.notificar_upd = this.tareaActual_upd.notificar == "1";
    this.repetirHasta_upd = (this.tareaActual_upd.repetir_hasta) ? this.tareaActual_upd.repetir_hasta.toISOString() : undefined;
    this.periodosActuales_upd = [];
    this.periodoAct_upd = { inicio: startOfDay(new Date()).toISOString(), final: startOfDay(new Date()).toISOString(), antNotif: 10 };
    this.periodoAuto_upd = { inicio: "", final: "" };
    this.tareaAutomatica_upd = new TareaAutomatica(undefined, "muy alto", "muy alto", 1, new Date(), new Date(), "", undefined, undefined, 10, "horas");
    this.tareaAutomaticaPer_upd = "horas";
    this.restDias_upd = ['L', 'K', 'M', 'J', 'V', 'S', 'D'];
    this.configAuto_upd = false;



    if (tareaEvento.modo_tarea == "manual") {

      for (let tareaP of this.tareas_periodos) {
        if (tareaP.id_tarea == tareaEvento.id_tarea) {
          let tareaPeriodo = deepCopy(tareaP) as TareaPeriodo;
          tareaPeriodo.fecha_hora_inicio_original = subHours(tareaPeriodo.fecha_hora_inicio_original, 6);
          tareaPeriodo.fecha_hora_final_original = subHours(tareaPeriodo.fecha_hora_final_original, 6);
          tareaPeriodo.fecha_hora_inicio_real = (tareaPeriodo.fecha_hora_inicio_real) ? subHours(tareaPeriodo.fecha_hora_inicio_real, 6) : tareaPeriodo.fecha_hora_inicio_real;
          tareaPeriodo.fecha_hora_final_real = (tareaPeriodo.fecha_hora_final_real) ? subHours(tareaPeriodo.fecha_hora_final_real, 6) : tareaPeriodo.fecha_hora_inicio_real;
          console.log(tareaPeriodo);

          this.periodosActuales_upd.push(tareaPeriodo);
        }
      }

    } else {

      for (let tareaA of this.tareas_automaticas) {
        if (tareaA.id_tarea == tareaEvento.id_tarea) {
          this.tareaAutomatica_upd = deepCopy(tareaA);
          this.tareaAutomaticaPer_upd = this.tareaAutomatica_upd.duracion_estimada_medida;
          this.restDias_upd = [];
          for (let dia of this.tareaAutomatica_upd.restriccion_dias) this.restDias_upd.push(dia);
          break;
        }
      }

    }

  }

  cargarTareaUpdate(event: CalendarEvent) {

    let tareaEvento: Tarea;
    let tareaPeriodoEvento;

    for (let tarea of this.tareas) if (tarea.id_tarea == event.id) tareaEvento = tarea;
    //console.log(this.tareas_periodos);
    //console.log(subHours(this.tareas_periodos[3].fecha_hora_inicio_original, 6).toISOString());

    this.tareaActual_upd = deepCopy(tareaEvento);
    this.tareaActual_upd.repeticion = (this.tareaActual_upd.repeticion) ? this.tareaActual_upd.repeticion : "ninguno";
    this.notificar_upd = this.tareaActual_upd.notificar == "1";
    this.repetirHasta_upd = (this.tareaActual_upd.repetir_hasta) ? this.tareaActual_upd.repetir_hasta.toISOString() : undefined;
    this.periodosActuales_upd = [];
    this.periodoAct_upd = { inicio: startOfDay(new Date()).toISOString(), final: startOfDay(new Date()).toISOString(), antNotif: 10 };
    this.periodoAuto_upd = { inicio: "", final: "" };
    this.tareaAutomatica_upd = new TareaAutomatica(undefined, "muy alto", "muy alto", 1, new Date(), new Date(), "", undefined, undefined, 10, "horas");
    this.tareaAutomaticaPer_upd = "horas";
    this.restDias_upd = ['L', 'K', 'M', 'J', 'V', 'S', 'D'];
    this.configAuto_upd = false;

    for (let tareaP of this.tareas_periodos) {
      if (tareaP.id_tarea == event.id /*&&
            tareaP.fecha_hora_inicio_original.getTime() == addHours(event.start, 6).getTime() &&
            tareaP.fecha_hora_final_original.getTime() == addHours(event.end, 6).getTime()*/) {

        let tareaPeriodo = deepCopy(tareaP) as TareaPeriodo;
        tareaPeriodo.fecha_hora_inicio_original = subHours(tareaPeriodo.fecha_hora_inicio_original, 6);
        tareaPeriodo.fecha_hora_final_original = subHours(tareaPeriodo.fecha_hora_final_original, 6);
        tareaPeriodo.fecha_hora_inicio_real = (tareaPeriodo.fecha_hora_inicio_real) ? subHours(tareaPeriodo.fecha_hora_inicio_real, 6) : tareaPeriodo.fecha_hora_inicio_real;
        tareaPeriodo.fecha_hora_final_real = (tareaPeriodo.fecha_hora_final_real) ? subHours(tareaPeriodo.fecha_hora_final_real, 6) : tareaPeriodo.fecha_hora_inicio_real;
        console.log(tareaPeriodo);

        this.periodosActuales_upd.push(tareaPeriodo);
      }
    }

    if (tareaEvento.modo_tarea == "manual") {
      /*
            for (let tareaP of this.tareas_periodos) {
              if (tareaP.id_tarea == event.id) {
                this.periodosActuales_upd.push(tareaP);
              }
            }*/

    } else {

      for (let tareaA of this.tareas_automaticas) {
        if (tareaA.id_tarea == event.id) {
          this.tareaAutomatica_upd = tareaA;
          break;
        }
      }

    }


  }

  cambiarModo_upd() {
    this.tareaActual_upd.modo_tarea = (this.tareaActual_upd.modo_tarea == "manual") ? "automatico" : "manual";
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  printHola() { console.log("Hola"); }
  updateUpdateModal() {
    console.log("OtraCOsa"); this.modal.hasOpenModals
  }

}




/*  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

    {
    label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    a11yLabel: 'Edit',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.handleEvent('Edited', event);
    },
  },
  {
    label: '<i class="fas fa-fw fa-trash-alt"></i>',
    a11yLabel: 'Delete',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.handleEvent('Deleted', event);
    },
  },


  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: randomColor(),
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }


  */