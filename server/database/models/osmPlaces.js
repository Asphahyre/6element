'use strict';

var sql = require('sql');
sql.setDialect('postgres');

var databaseP = require('../management/databaseClientP');
var osmPlaces = require('../management/declarations.js').osmplaces;

var assignColors = require('../../assignColors.js');

module.exports = {

    // ------------- BASICS ---------------

    create: function(osmPlacesData){
        if(!Array.isArray(osmPlacesData))
            osmPlacesData = [osmPlacesData];
        
        return databaseP.then(function (db) {

            return Promise.all(osmPlacesData.map(function(data){
                if (data){
                    var query = osmPlaces
                    .insert(data)
                    .returning('*')
                    .toQuery();

                    // console.log('osmPlaces create query', query);

                    return new Promise(function (resolve, reject) {
                        db.query(query, function (err, result) {
                            if (err) {
                                console.log('ERROR in createByChunk', query, err.stack);
                                reject(err);
                            }
                            else resolve(result.rows);
                        });
                    });
                }
                else return Promise.reject(new Error('OSM Place data is undefined'));
                
            }));
        })
        .catch(function(err){
            console.error('ERROR in createByChunk', err);
        });
    },

    count: function () {
        return databaseP.then(function (db) {
            var query = osmPlaces
                .select(osmPlaces.count().as('count'))
                .toQuery();

            // console.log('osmPlaces count query', query);

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) {
                        console.error('ERROR in count', query, err);
                        reject(err);
                    }
                    else resolve(Number(result.rows[0].count));
                });
            });
        });
    },


    // ------------- GETTERS ---------------

    getKNearest: function(coords, k){
        return databaseP.then(function (db) {
            
            var strDistance = 'st_distance_sphere(osmPlaces.geom, st_makepoint(' + coords.lon + ', ' + coords.lat + ')) ';
            var strDistanceAS = strDistance + 'AS distance';
            var query = osmPlaces
                .select(osmPlaces.star(), strDistanceAS)
                .from(osmPlaces)
                .where(strDistance + '< 50000 and type = \'centre\'')
                .order('distance')
                .limit(k)
                .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(assignColors(result.rows));
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getKNearest', err);
        }); 
    },
    
    getWithin: function(coords, bbox, subCategories, limit){
        return databaseP.then(function (db) {
            
            var strDistance = 'st_distance_sphere(osmPlaces.geom, st_makepoint(' + coords.lon + ', ' + coords.lat + ')) AS distance';
            var query = osmPlaces
                .select(osmPlaces.star(), strDistance)
                .from(osmPlaces)
                .where('osmPlaces.geom && ST_MakeEnvelope(' + bbox.minLon + ', ' + bbox.minLat + ', ' + bbox.maxLon + ', ' + bbox.maxLat + ', 4326)')
                .order('distance')
                .limit(limit)
                .toQuery();
   
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(assignColors(result.rows));
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getWithin', err);
        }); 
    },

    updateBinsById: function(id, bins){
        return databaseP.then(function (db) {
            
            var query = osmPlaces
            .update({'bins': bins})
            .where(osmPlaces.id.equals(id))
            .returning(osmPlaces.bins)
            .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in update Bins', err);
        });
    },

    // ------------- BINS ---------------

    getAllBins: function(){
        return databaseP.then(function (db) {
            
            var query = osmPlaces
                .select(osmPlaces.bins, osmPlaces.osm_id)
                .from(osmPlaces)
                .toQuery();
   
            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);

                    else resolve(result.rows);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in getAllBins', err);
        }); 
    },

    updateBins: function(osmId, bins){
        return databaseP.then(function (db) {
            
            var query = osmPlaces
            .update({'bins': bins})
            .where(osmPlaces.osm_id.equals(osmId))
            .returning(osmPlaces.bins)
            .toQuery();

            return new Promise(function (resolve, reject) {
                db.query(query, function (err, result) {
                    if (err) reject(err);
                    else resolve(result.rows[0]);
                });
            });
        })
        .catch(function(err){
            console.log('ERROR in update Bins', err);
        });
    }
};
