DPA = new Mongo.Collection('dpa');

/*DPA.attachSchema(new SimpleSchema({
    codigo: {
        type: String
    },
    grupo: {
        type: String
    },
    descripcion: {
        type: String
    }
}));*/

if (Meteor.isServer) {

    Meteor.publish('dpa', function () {
        return DPA.find({});
    });

    Meteor.startup(function () {
        DPA._ensureIndex({codigo: 1});
    });

    DPA.allow({
        insert: function (userId, doc) {
            return true;
        },
        update: function (userId, doc, fieldNames, modifier) {
            return true;
        },
        remove: function (userId, doc) {
            return true;
        }
    });
}