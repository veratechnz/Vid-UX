function Steps(equip, sceneTree){

	this.addModelViewsToUI = function(modelView){

		var nodeElements = $('<li class="areas-list-item" id="' + modelView.id + '"><img class="areas-list-img" src="data:image/png;base64,' + modelView.imgData + '"><p id="area-title">' + modelView.name + '</p></li>');
			
		$(".areas-list-items").append(nodeElements);

		//Center the image
		var itemWidth = $(nodeElements).outerWidth();
	    var imageWidth = $(nodeElements).find('.areas-list-img').width();
	    var offSet = itemWidth/2 - imageWidth/2;
	    
	    $(nodeElements).find('.areas-list-img').css('left', offSet + 'px');

		$(nodeElements).find('.areas-list-img').click(function(){
			var stepID = $(this).parent().attr('id');
		 	equip.activateStep(stepID);

		 	//Visibility may have changed -- update scene tree
		 	for (var i = 0; i < nodeList.length; i++) {
		 		sceneTree.visibilityChanged(nodeList[i]);
		 	};
		});
	}

	this.addStepToUI = function(newStep){

		var nodeElements = $('<li class="areas-list-item" id="' + newStep.id + '"><img class="areas-list-img" src="data:image/png;base64,' + newStep.imgData + '"><img class="areas-list-play-img" src="./img/Play.png"><p id="area-title">' + newStep.name + '</p></li>');
			
		$("#view-states-list-items").append(nodeElements);

		//Center the image
		var itemWidth = $('.side-bar-menu').outerWidth();
	    var imageWidth = $(nodeElements).find('.areas-list-img').width();
	    var offSet = itemWidth/2 - imageWidth/2;
	    
	    $(nodeElements).find('.areas-list-img').css('left', offSet + 'px');

	    //center the play icon
	    var iconWidth = $(nodeElements).find('.areas-list-play-img').width();
	    var offSet = itemWidth/2 - iconWidth/2;
	    
	    $(nodeElements).find('.areas-list-play-img').css('left', offSet + 'px');

		 $(nodeElements).find('.areas-list-img').click(function(){
		 	var stepID = $(this).parent().attr('id');
		 	var step = equip.findStepByID(stepID);
		 	
		 	if(step.isPlaying == "playing"){
		 		equip.pauseCurrentStep();
		 		step.isPlaying = "paused";
		 		console.log("was playing now paused");
		 		$(this).parent().find('.areas-list-play-img').attr('src', './img/Play.png');
		 	}else if (step.isPlaying == "stopped"){
		 		

		 		equip.activateStep(stepID)//oDvl.Scene.ActivateStep(sceneID, stepID, false, false);
		 		
		 		//Visibility may have changed -- update scene tree
			 	for (var i = 0; i < equip.nodeList.length; i++) {
			 		sceneTree.visibilityChanged(equip.nodeList[i]);
			 	};

		 		step.isPlaying = "playing"
		 		console.log("was stopped now playing");
		 		
		 	}else if (step.isPlaying == "paused"){
		 		equip.activateStep(stepID);

		 		//Visibility may have changed -- update scene tree
			 	for (var i = 0; i < equip.nodeList.length; i++) {
			 		sceneTree.visibilityChanged(equip.nodeList[i]);
			 	};

		 		step.isPlaying = "playing"
		 		console.log("was paused now resuming");
		 		//console.log($(nodeElements));
		 		$(this).parent().find('.areas-list-play-img').attr('src', './img/Pause.png');
		 	}

		 	

			
		});
	}	
}

