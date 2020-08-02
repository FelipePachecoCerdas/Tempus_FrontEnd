export class Tarea {
    constructor(
        public id_tarea: number,
        public porcentaje_completitud: number,
        public id_usuario: number,
        public id_actividad_proyecto: number,
        public nombre_tarea: string,
        public descripcion_tarea: string,
        public repeticion: string,
        public notificar: string,
        public modo_notificar: string,
        public modo_tarea: string,
        public repetir_hasta: Date
    ) { }

}