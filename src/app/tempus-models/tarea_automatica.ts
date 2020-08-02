export class TareaAutomatica {
    constructor(
        public id_tarea: number,
        public nivel_dificultad: string,
        public nivel_prioridad: string,
        public duracion_estimada: number,
        public restriccion_inicio: Date,
        public restriccion_finalizacion: Date,
        public restriccion_dias: string,
        public max_horas_dia: number,
        public min_horas_dia: number,
        public antelacion_notificacion: number,
    ) { }

}