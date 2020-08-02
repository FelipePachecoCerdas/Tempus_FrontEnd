export class TareaPeriodo {
    constructor (
        public id_tarea: number,
        public fecha_hora_inicio_original: Date,
        public fecha_hora_final_original: Date,
        public fecha_hora_inicio_real: Date,
        public fecha_hora_final_real: Date,
        public antelacion_notificacion: number

    ) {}
    
}