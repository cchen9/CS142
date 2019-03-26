"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line
//var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    console.log('/user/list called');
    User.find({}, '_id first_name last_name', function (err, users) {
    /* users is an array of objects */
       if (err) {
         console.error('Doing /user/list error:', err);
         response.status(400).send(JSON.stringify(err));
         return;
       }
       if (users.length === 0){
         response.status(400).send('Missing Users List');
         return;
       }
       console.log("Yay! I found users list");
       response.status(200).end(JSON.stringify(users));
    });
});

/*
 * _id: "57231f1a30e4351f4e9f4bdc", first_name: "John", last_name: "Ousterhout",
           location: "Stanford, CA", description: "<i>CS142!</i>", occupation: "Professor"
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    User.findOne({_id: id}, '_id first_name last_name location description occupation', function(err, user)
    {
      if (err) {
          // Query returned an error.  We pass it back to the browser with an Internal Service
          // Error (500) error code.
          console.error('Doing /user/:id error:', err);
          response.status(400).send(JSON.stringify(err));
          return;
      }
      if (user.length === 0){
        response.status(400).send('Missing the user with id: ' + id);
        return;
      }
      console.log("Yay! I found user with id " + id);
      response.status(200).end(JSON.stringify(user));
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 * * cs142Models.photoOfUserModel - A function that returns the photos belong to
 * the specified user. Called  with an user ID (id), the function returns an object containing:
 *   _id  (string) - The ID of the photo
 *   date_time (date) - he date and time the picture was taken in ISO format.
 *   file_name (string) - The file name in the image directory of the picture.
 *   user_id (string) - The user id of the picture's owner.
 *   comments: {array of objects} - An array of comment objects containing the properties:
 *        _id  (string) - The ID of the comment.
 *        date_time (date) - The date the comment was made in ISO format.
 *        comment (string) - The text of the comment.
 *        user: {object} The user info (see userMode for format) who made the comment
 *        photo_id: (string) - The ID of the photo the comment belongs to.
 */
app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    Photo.find({user_id:id}, '_id date_time file_name user_id comments', function(err, photos) {
      if (err) {
          // Query returned an error.  We pass it back to the browser with an Internal Service
          // Error (500) error code.
          console.error('Doing /photosOfUser/:id error:', err);
          response.status(400).send(JSON.stringify(err));
          return;
      }
      if (photos.length === 0){
        response.status(400).send("Missing photos list for user " + id);
        return;
      }
      var photo_array = [];
      async.each(photos,
                 function (photo, finishedProcessingPhoto)
                 {
                   var comments_for_photo = [];
                   async.each(photo.comments,
                              function (comment, finishedAddingCommentsForPhoto)
                              {
                                  User.findOne({_id: comment.user_id}, '_id first_name last_name',
                                    function(err, user)
                                    {
                                      if (err) {
                                        console.log("Comment has no found user!");
                                        finishedAddingCommentsForPhoto();
                                      }

                                      else if (user.length === 0){
                                        console.log('Missing the user with id: ' + comment.user_id);
                                        finishedAddingCommentsForPhoto();
                                      }

                                      else
                                      {
                                        var user_obj = {_id: user._id, first_name: user.first_name, last_name: user.last_name};
                                        var unpacked_comment = JSON.parse(JSON.stringify(comment));
                                        delete unpacked_comment.user_id;
                                        unpacked_comment.user = user_obj;
                                        comments_for_photo.push(unpacked_comment);
                                        finishedAddingCommentsForPhoto();
                                      }
                                    });
                              },
                              function (err)
                              {
                                if (err)
                                {
                                  console.log("Cannot add comments to photo!");
                                  finishedProcessingPhoto();
                                }
                                else
                                {
                                  var newPhoto = JSON.parse(JSON.stringify(photo));
                                  newPhoto.comments = comments_for_photo;
                                  photo_array.push(newPhoto);
                                  finishedProcessingPhoto();
                                }
                              }
                             );
                 },
                 function (err){
                   if (err) {
                     console.log("Cannot accumulate all photos into array!");
                     return;
                   }
                   if (photo_array.length === 0) {
                     response.status(400).send('Missing Output PhotoArray');
                     return;
                   }
                   response.status(200).end(JSON.stringify(photo_array));
      });
    });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
