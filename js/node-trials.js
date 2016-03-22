//Command for creating a new database:

ApplicationDatabase = function(){
	var scope = this;

	var gui = require('nw.gui');
	gui.App.setCrashDumpDir('../data-temp/crash-dumps/');
	var Nedb = require('nedb'),
		fs = require('fs');
		//db = new Nedb({filename: '../data-temp/temp-data-file', autoload: true});


	this.db = {};
	this.db.projects = new Nedb({filename: '../data-temp/projects-db.json', autoload: true});
	this.db.documents = new Nedb({filename: '../data-temp/documents-db.jsob', autoload: true});
	this.db.projectData = new Nedb({filename: '../data-temp/project-data-db.json', autoload: true});

	this.db.projects.ensureIndex({ fieldName: 'somefield', unique: true }, function (err) {
	});

	//obj = JSON.parse(fs.readFileSync('../data-temp/temp-json-data.json', 'utf8'));

	//console.log(obj.meta.fields);


	this.saveNewProject = function(){
		newProj01 = {
						name: "KGP Major Turbine Overhaul Shut",
						model3D: "./resources/models/Turbine_Equipment_Model_001.vds",
						configuration: 	{
											customViews:[]
										}
										

					}		
		scope.db.projects.insert(newProj01, function (err, newDoc) {   // Callback is optional
		  // newDoc is the newly inserted document, including its _id
		  
		  console.log(newDoc);

		});	
	}


	this.findProjectByName = function(searchName, callback){

		var results;

		
		scope.db.projects.find({name:searchName}, function (err, docs) {
			  // If no document is found, docs is equal to []
			  callback(docs)	  
		});
		
		

	}

	this.findProjectByID = function(searchID, callback){

		var results;

		
		scope.db.projects.findOne({_id:searchID}, function (err, docs) {
			  // If no document is found, docs is equal to []
			  callback(docs)	  
		});
		
		

	}

	this.saveCustomView = function(project, viewState, callback){
		var results;

		
		scope.db.projects.update({_id:project}, {$push:{"configuration.customViews": viewState}}, {returnUpdatedDocs:true}, function (err, numAffectex, affectedDocs, upsert) {
			  // If no document is found, docs is equal to []
			  callback(affectedDocs);	  
		});
	}

	this.deleteCustomView = function(project, viewStateID, callback){
		scope.db.projects.update({_id:project}, {$pull:{"configuration.customViews.id": viewStateID}}, {returnUpdatedDocs:true}, function (err, numAffectex, affectedDocs, upsert) {
			  // If no document is found, docs is equal to []
			  callback(affectedDocs);	  
		});


	}
}











