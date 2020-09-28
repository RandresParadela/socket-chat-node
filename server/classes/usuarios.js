//


class Usuarios {

    constructor() {
        this.personas = [];

    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        };

        this.personas.push(persona);
        return this.personas;

    }

    getPersona(id) {
        // como puede devolver mas de una, el [0] te dice que cojas la primera
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {
        // guardamos la persona que vamos a borrar para devolverla
        let personaBorrada = this.getPersona(id);
        // en personas dejamos todas menos aquella eliminada
        this.personas = this.personas.filter(persona => persona.id != id);
        return personaBorrada;
    }


}


module.exports = {
    Usuarios
}