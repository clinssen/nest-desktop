"use strict"

const PouchDB = require('pouchdb');
const NeDB = require('nedb');
PouchDB.plugin(require('pouchdb-adapter-idb'));

var sync = {};

sync.remoteDB = function() {
    var config = app.config.app();
    if (!(config.get('db.remote.host')) || !(config.get('user.name'))) return
    var db_name = config.get('db.name');
    var indexDB = new PouchDB(db_name, {
        adapter: 'idb'
    });

    let {
        host,
        port
    } = app.config.get('db.remote');

    let {
        name,
        password
    } = config.get('user');

    var remoteDB = new PouchDB('http://' + host + ':' + port + '/' + db_name, {
        skip_setup: true,
        auth: {
            username: name,
            password: password
        }
    });

    var db_sync = indexDB.sync(remoteDB, {
        live: true,
        // filter: 'app/by_user',
        // query_params: {
        //     user: name
        // }
    }).on('error', function(err) {
        app.message('Alert', 'Synchronization to the remoted database failed.')
    })
}

sync.localDB = function() {
    app.db.indexDB.query(function(doc) {
        emit([doc.date, doc.user, {
            _id: doc._id,
            name: doc.name,
            data: doc.data,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        }]);
    }).then(function(docs) {
        if (docs.total_rows == 0) return
        docs.rows.map(function(doc) {
            app.db.localDB.findOne({
                _id: doc._id
            }).exec(function(err, docs) {
                if (docs != null) return
                app.db.localDB.insert(doc)
            })
        })
    })
}

sync.defaults = function() {
    app.config.simulation().map(function(simConfigFile) {
        var simConfigName = simConfigFile.split('.')[0]
        var sim = app.config.simulation(simConfigName)
        app.db.localDB.findOne({
            _id: sim._id
        }).exec(function(err, docs) {
            if (docs != null) return
            app.db.localDB.insert(sim)
        })
    })
}

sync.on = function() {
    sync.remoteDB()
    sync.localDB()
    sync.defaults()
}

module.exports = sync;