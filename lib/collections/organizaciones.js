Organizaciones = new Mongo.Collection('organizaciones');

Organizaciones.attachSchema(new SimpleSchema({
    createdAt: {
        type: String,
        autoValue: function() {
            var currentDate = new Date();
            var date;
            date = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth()+1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2);
            if (this.isInsert) {
                return date;
            } else if (this.isUpsert) {
                return {$setOnInsert: date};
            } else {
                this.unset();
            }
        },
        autoform: {
            type: 'hidden',
            label: false
        }
    },
    provincia: {
        type: String,
        label: 'Provincia',
        autoform: {
            type: 'select',
            firstOption: '',
            options: function () {
                return DPA.find({grupo: 'Provincia'}).map(function (dpa) {
                    return {label: dpa.descripcion, value: dpa.codigo};
                });
            }
        }
    },
    canton: {
        type: String,
        label: 'Cantón',
        autoform: {
            type: 'select',
            firstOption: '',
            options: function () {
                var codigoProvincia = AutoForm.getFieldValue('provincia');
                var cantones = new RegExp('^' + codigoProvincia + '[\\d]{2}$');
                return DPA.find({codigo: {$regex: cantones}}).map(function (dpa) {
                    return {label: dpa.descripcion, value: dpa.codigo};
                });
            }
        }
    },
    parroquia: {
        type: String,
        label: 'Parroquia',
        autoform: {
            type: 'select',
            firstOption: '',
            options: function () {
                $('#provincia').change(function() {
                    $('#parroquia option[value!=""]').remove();
                });
                var codigoCanton = AutoForm.getFieldValue('canton');
                var parroquias = new RegExp('^' + codigoCanton + '[\\d]{2}$');
                return DPA.find({codigo: {$regex: parroquias}}).map(function (dpa) {
                    return {label: dpa.descripcion, value: dpa.codigo};
                });
            }
        }
    },
    sectores: {
        type: String,
        label: 'Sector/es'
    },
    nombreGrupo: {
        type: String,
        label: 'Nombre del grupo',
        max: 1024
    },
    representante: {
        type: String,
        label: 'Representante'
    },
    correo: {
        type: String,
        label: 'Correo electrónico',
        regEx: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    telefonoFijo: {
        type: String,
        label: 'Teléfono fijo'
    },
    telefonoCelular: {
        type: String,
        label: 'Teléfono celular'
    },
    personeriaJuridica: {
        type: String,
        label: 'Personería jurídica',
        autoform: {
            type: 'select-radio-inline',
            defaultValue: 'En trámite',
            options: function () {
                return [
                    {label: 'Si', value: 'Si'},
                    {label: 'No', value: 'No'},
                    {label: 'En trámite', value: 'En trámite'}
                ];
            }
        }
    },
    tiempoVidaGrupo: {
        type: String,
        label: 'Tiempo de vida del grupo'
    },
    numeroMiembros: {
        type: Number,
        label: 'Número de miembros',
        min: 1
    },
    diaPreferidoReuniones: {
        type: String,
        label: 'Día preferido para reuniones/talleres',
        autoform: {
            type: 'select-radio-inline',
            defaultValue: 'Ninguno',
            options: function () {
                return [
                    {label: 'Lunes', value: 'Lunes'},
                    {label: 'Martes', value: 'Martes'},
                    {label: 'Miércoles', value: 'Miércoles'},
                    {label: 'Jueves', value: 'Jueves'},
                    {label: 'Viernes', value: 'Viernes'},
                    {label: 'Sábado', value: 'Sábado'},
                    {label: 'Domingo', value: 'Domingo'},
                    {label: 'Ninguno', value: 'Ninguno'}
                ];
            }
        }
    },
    conocimientosGenerales: {
        type: Number,
        label: 'Conocimientos de los principios generales de la agroecología',
        min: 1,
        max: 10
    },
    decisionPolitica: {
        type: Number,
        label: 'Decisión política',
        min: 1,
        max: 10
    },
    disenioFinca: {
        type: Number,
        label: 'Diseño de finca',
        min: 1,
        max: 10
    },
    capacidadesTecnicas: {
        type: Number,
        label: 'Capacidades técnicas',
        min: 1,
        max: 10
    },
    capacidadTecnicaGrupo: {
        type: Number,
        label: 'Capacidad técnica instalada en el grupo',
        min: 1,
        max: 10
    },
    capacidadOrganizacional: {
        type: Number,
        label: 'Capacidad organizacional',
        min: 1,
        max: 10
    },
    mecanismoApoyoInterno: {
        type: Number,
        label: 'Mecanismo de apoyo interno',
        min: 1,
        max: 10
    },
    promotores: {
        type: Number,
        label: 'Promotores',
        min: 1,
        max: 10
    },
    manejoNormas: {
        type: Number,
        label: 'Manejo de normas',
        min: 1,
        max: 10
    },
    veedores: {
        type: Number,
        label: 'Veedores',
        min: 1,
        max: 10
    },
    comiteEtica: {
        type: Number,
        label: 'Comité de ética',
        min: 1,
        max: 10
    },
    createdBy: {
        type: String,
        autoValue: function(){
            if (this.isInsert){
                return Meteor.userId();
            } else if (this.isUpsert) {
                return {$setOnInsert: Meteor.userId()};
            } else {
                this.unset();
            }
        },
        autoform: {
            type: 'hidden',
            label: false
        }
    }
}));

if (Meteor.isServer) {

    Meteor.publish('organizaciones', function () {
        if (Roles.userIsInRole(this.userId, 'administrador')) {
            return Organizaciones.find({});
        } else if (Roles.userIsInRole(this.userId, 'tecnico')) {
            return Organizaciones.find({createdBy: this.userId});
        } else {
            // user not authorized. do not publish secrets
            this.stop();
            return;
        }
    });

    Meteor.publish('organizacionSelected', function (organizacionIds) {
      return Organizaciones.find({_id: {$in: organizacionIds}});
    });

    Organizaciones.allow({
        insert: function (userId, doc) {
            return userId;
        },
        update: function (userId, doc, fields, modifier) {
            // can only change your own documents
            return doc.userId === userId;
        },
        remove: function (userId, doc) {
            // can only remove your own documents
            return doc.userId === userId;
        }
    });
}