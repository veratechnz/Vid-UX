// Custom JS
var videoTools = {

	videoData: {
		timeStamps: []
	},

	initObj: function(){
		// Initialize video object
		var aVideoObj = videojs('firstVideo', {
			//Video element options on start up. 
			 autoplay: false
		});
		this.vidObject = aVideoObj;
		this.controls();
	},

	initDom: function(){
		var videoA, videoB, videoC, data;
		var timeArray;
		var accessObj, nextButton, backButton;

		// Initialize video click event to activate play pause on 
		$( "#videoPlay" ).click(function() {
		 	videoTools.playPause();
		});
		// Video Panel Data and Time stamps. Sent to first property 'videoData:'
		//Here are the time values 
		videoA = document.getElementById('videoSelectA');
		videoA.data = 57;
		videoB = document.getElementById('videoSelectB');
		videoB.data = 99;
		videoC = document.getElementById('videoSelectC');
		videoC.data = 190;

		// Assign time data to videoTools videoData property
		// Assign time data to videoTools videoData property
		timeArray = this.videoData.timeStamps;
		//Here are the TimeValues
		timeArray.push(57, 99, 190);


		// Init Dom for the next Buttons
		accessObj = this.videoData;
		accessObj.next = nextButton;
		accessObj.back = backButton;
		
		nextButton = document.getElementById('videoNext');
		backButton = document.getElementById('videoBack');

		//Next & back button event listeners
		nextButton.onclick = function(){
			videoTools.skipButton(this);
		};
		backButton.onclick = function(){
			videoTools.skipButton(this);
		};

	},

	playPause: function(){
		if (this.vidObject.paused()) {
		  this.vidObject.play();
		}
		else {
		 this.vidObject.pause();
		}
	},

	controls: function(){
		var thePlayer, progress, controlDiv;
		// Assign video object to new local variable
		thePlayer = this.vidObject;

		controlDiv = document.getElementById('videoControls');
		// Control Bar
		thePlayer.addChild('ProgressControl');
	},

	//UI color and icon for hover and click of left video images. 
	previewClick: function(){
		var player, timeStamp, icon, parent, children;
		player = this.vidObject;
		// Captures the click event for all child elements within the div
		$('#videoSelectA, #videoSelectB, #videoSelectC').on('click', function(){
			$('.videos-div i').removeClass('red-it show-it');
			//Add class to create red border
			$('#videoSelectA, #videoSelectB, #videoSelectC'	).removeClass('select-border');
			$(this).addClass('select-border')
			.find('i')
			.addClass('red-it show-it');
			
			//Adding timestamp data to the dom node // id element of the clicked element.				
			timeStamp = this.data;
			player.play();
			player.currentTime(timeStamp);
		});
		// document.getElementsByClassName('parent')[0];
	},

	skipButton: function(trigger){
		var player = this.vidObject;
		var duration = player.currentTime();
		var times = this.videoData.timeStamps;
		//forwardButton
		if (trigger.id === 'videoNext') {
			//Calculate time marker
			var calcForward = {
				test: function (){
					var result;
					if (duration === 0) {
						result = times[0];
					} else if (duration < times[0]) {
						result = times[0];
					} else if (duration >= times[0] && duration < times[1]) {
						result = times[1];
					} else {
						result = times[2];
					} 
					return result;
				} //test function ends		
			}; //calc object ends
			var setTimeForward = calcForward.test(); 
			player.currentTime(setTimeForward);
		} 

		else if (trigger.id === 'videoBack') {

			//Calculate time marker
			var calcBack = {
				test: function (){
					var result;
					if (duration >= 0 && duration <= times[0]) {
						result = 0;
					} else if (duration > times[0] && duration <= times[1]) {
						result = times[0];
					} else if (duration > times[1] && duration <= times[2]) {
						result = times[1];
					} else {
						result = times[2];
					} 
					return result;
				} //test function ends		
			}; //calc object ends
			var setTimeBack = calcBack.test(); 
			player.currentTime(setTimeBack);
		} //Next button if statement ends

	} //Skip button method ends


}; //videoObject Ends


window.onload = function() {

	videoTools.initObj();
	videoTools.initDom();
	videoTools.previewClick();

	//Initialize get control button events.
	// console.log(videoTools.videoData.A[1]);

}; //window.onload ends
