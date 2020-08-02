export class Usuario {
    constructor (
        public id_usuario: number,
        public nombre: string,
        public apellidos: string,
        public contrasenna: string,
        public correo_electronico: string,
        public tipo_usuario: string,
        public descripcion_personal: string,
        public compannia: string,
        public foto_perfil: string
    ) {}
    
}