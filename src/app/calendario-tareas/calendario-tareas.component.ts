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

import { Inject, Injectable } from '@angular/core';
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
    start: inicio,
    end: final,
    title: nombre,
    color: color,
    actions: actions,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    cssClass: "myClass",
    draggable: true,
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


@Component({
  selector: 'app-calendario-tareas',
  templateUrl: './calendario-tareas.component.html',
  styleUrls: ['./calendario-tareas.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ]
})
export class CalendarioTareasComponent {
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



  usuarios: Usuario[] = [];
  actualUser: Usuario;
  tareas: Tarea[] = []
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

  tareaActual_old: Tarea = new Tarea(undefined, undefined, undefined, undefined, undefined, undefined, "ninguno", undefined, "ambos", undefined, undefined);
  notificar_old: boolean;
  repetirHasta_old: string = new Date().toISOString();
  periodosActuales_old: TareaPeriodo[] = [];
  periodoAct_old = { inicio: startOfDay(new Date()).toISOString(), final: startOfDay(new Date()).toISOString(), antNotif: 10 };
  periodoAuto_old = { inicio: "", final: "" };
  tareaAutomatica_old: TareaAutomatica = new TareaAutomatica(undefined, "", "", undefined, new Date(), new Date(), "", undefined, undefined, 10, "minutos");
  tareaAutomaticaPer_old = "horas";
  restDias_old = ['L', 'K', 'M', 'J', 'V', 'S', 'D'];
  configAuto_old = false;

  horas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  tareasPendientes = this.getTareasPendientes();
  tareasSinProcesar = 0;

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];


  @ViewChild("tabs", { static: false }) tabs: MatTabGroup;

  activeDayIsOpen: boolean = true;
  cero = 0;

  constructor(private modal: NgbModal,
    @Inject(DOCUMENT) private document,
    public toastController: ToastController,
    public platform: Platform,
    public modalCtrl: ModalController,
    public usuarioService: UsuarioService,
    public tareaService: TareaService,
    public tareaPeriodoService: TareaPeriodoService,
    public tareaAutomaticaService: TareaAutomaticaService,
    public etiquetaService: EtiquetaService,
    public etiquetaTareaService: EtiquetaTareaService) {
    //this.resetDB();
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
      console.log("REALINEANDO");
      this.tabs.selectedIndex = 0;
      this.tabs._tabHeader.focusIndex = 0;
      this.tabs._tabHeader._alignInkBarToSelectedTab(); this.tabs.realignInkBar();
    }, 1000);

    if (!true) await this.resetDB();
    await this.getTareas();

    this.crearEventos();
    this.calcularTareasSinProcesar();
  }

  async resetDB() {
    await this.usuarioService.deleteAll().toPromise();
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
    await this.usuarioService.create(usuarios_const[0]).toPromise();
    await this.usuarioService.create(usuarios_const[1]).toPromise();

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
    this.usuarios = [];
    this.tareas = [];
    this.tareas_periodos = [];
    this.tareas_automaticas = [];

    this.usuarios = await this.usuarioService.findAll().toPromise() as Usuario[];
    this.actualUser = this.usuarios[0];


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

  crearEventos() {
    this.events = [];
    for (let tarea of this.tareas) {
      let colorTarea = randomColor();
      for (let periodo of this.tareas_periodos) {
        if (tarea.id_tarea == periodo.id_tarea) {
          this.events.push(nuevoEvento(tarea.id_tarea, periodo.fecha_hora_inicio_original, periodo.fecha_hora_final_original, tarea.nombre_tarea, colorTarea));
        }
      }
    }
  }

  cambiarConfigAuto() {
    this.configAuto = !this.configAuto;

  }

  async programarTareas() {
    for (let tarea of this.tareasPendientes) {
      let infoAutomatica;
      for (let tareaA of this.tareas_automaticas) {
        if (tareaA.id_tarea == tarea.id_tarea) {
          infoAutomatica = tareaA;
          break;
        }
      }
      console.log(tarea, infoAutomatica);

      // AQUI VA EL MIEDO 
      // BORRAR AUTOMATICA DE LA BD
      // METER PERIODOS EN LA BD
    }
    this.modal.dismissAll();
    this.tareas_automaticas = [];
    this.calcularTareasSinProcesar();

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

    this.tareaActual.repetir_hasta = isoStringToDate(this.repetirHasta);
    this.tareaActual.id_usuario = this.actualUser.id_usuario;
    this.tareaActual.notificar = (this.notificar) ? "1" : "0";
    if (this.tareaActual.notificar == "0") this.tareaActual.modo_notificar = undefined;
    if (this.tareaActual.repeticion != "ninguno") { this.tareaActual.repeticion = undefined; this.tareaActual.repetir_hasta = undefined; }

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
      this.events = [];
      await this.getTareas();
      this.crearEventos();
    } else {
      this.tareaAutomatica.id_tarea = maxId + 1;
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
        tareaP.fecha_hora_inicio_original == event.start &&
        tareaP.fecha_hora_final_original == event.end) {
        //console.log(tareaP);
        tareaPeriodoEvento = tareaP;
        tareaPeriodoEvento.fecha_hora_inicio_original = this.pasarDateIso(newStart);
        tareaPeriodoEvento.fecha_hora_final_original = this.pasarDateIso(newEnd);
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
    await this.tareaPeriodoService.update(tareaPeriodoEvento.id_tarea, this.pasarDateIso(event.start), this.pasarDateIso(event.end), tareaPeriodoEvento).toPromise();
    await this.getTareas();
    this.crearEventos();
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
    console.log(event);
    if (action != 'Clicked') return;

    let modalUpdateAbierto: NgbModalRef = this.modal.open(this.updateTareaModal, { size: 'lg', centered: true, windowClass: 'modalWTF', backdropClass: 'modalWTF' });

    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
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