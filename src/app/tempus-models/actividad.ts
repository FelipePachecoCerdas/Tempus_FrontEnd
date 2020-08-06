export class Actividad {
    constructor(
        public id_actividad: number,
        public id_proyecto: number,
        public nombre_actividad: string,
        public descripcion_actividad: string,
        public fecha_inicio: Date,
        public fecha_finalizacion: Date
    ) { }

}