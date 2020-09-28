const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {


    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        // el cliente se une a la sala identificada
        client.join(data.sala);

        // el client.id lleva el id del socket
        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // Se disparará al entrar o salir alguien del chat con la relacion de personas en el chat. solo a su sala
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    // ------------------------------------------------------------------
    // Borra una persona. Simplemente con recargar la pagina duplicaria a 
    // la persona por ser un nuevo socket asi, al recargar borra el anterior 
    // que luego se volverá a crear aunque con un nuevo id.
    // ------------------------------------------------------------------

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);


        // client.broadcast.emit('crearMensaje', {
        //     usuario: 'Administrador',
        //     mensaje: `${personaBorrada.nombre} abandonó el chat`
        // });

        // notificamos que un usuario se ha desconectado
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));

        // Se disparará al entrar o salir alguien del chat con la relacion de personas en el chat
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // ------------------------------------------------------------------------
    // escuchamos un mensaje del cliente para enviarlo al grupo
    // ------------------------------------------------------------------------
    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    // ------------------------------------------------------------------------
    // escuchamos mensaje privado
    // ------------------------------------------------------------------------
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    });

});