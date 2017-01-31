(function () {
	'use strict';
     

	// Does the browser actually support the video element?
	var supportsVideo = !!document.createElement('video').canPlayType;

	if (supportsVideo) {
        
		
		var atributo;
  		var max_atributo;

		var vLength;
		// Obtain handles to main elements
		var videoContainer = document.getElementById('videoContainer');
		var video = document.getElementById('video');
		var videoControls = document.getElementById('video-controls');
		var buttonControl = document.getElementById('control-bar');
		var progress_p = document.getElementById('progress-p');
		var content = document.getElementById('content');
		
		var text_content = document.getElementsByTagName('p');
		// Hide the default controls
		video.controls = false;

		// Display the user defined video controls
		videoControls.setAttribute('data-state', 'visible');

		// Obtain handles to buttons and other elements
		var playpause = document.getElementById('playpause');
		// var stop = document.getElementById('stop');
		var mute = document.getElementById('mute');
		// var volinc = document.getElementById('volinc');
		// var voldec = document.getElementById('voldec');
		var progress = document.getElementById('progress');
		var progressBar = document.getElementById('progress-bar');
		var fullscreen = document.getElementById('fs');

		// If the browser doesn't support the progress element, set its state for some different styling
		var supportsProgress = (document.createElement('progress').max !== undefined);
		if (!supportsProgress) progress.setAttribute('data-state', 'fake');

		// Check if the browser supports the Fullscreen API
		var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
		// If the browser doesn't support the Fulscreen API then hide the fullscreen button
		if (!fullScreenEnabled) {
			fullscreen.style.display = 'none';
		}

	
		// Set the video container's fullscreen state
		var setFullscreenData = function(state) {
			videoContainer.setAttribute('data-fullscreen', !!state);
			// Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
			fullscreen.setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
		}



		// Checks if the document is currently in fullscreen mode
		var isFullScreen = function() {
			return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
		}

		// Fullscreen
		var handleFullscreen = function() {
			// If fullscreen mode is active...	
			if (isFullScreen()) {
					// ...exit fullscreen mode
					// (Note: this can only be called on document)
					if (document.exitFullscreen) document.exitFullscreen();
					else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
					else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
					else if (document.msExitFullscreen) document.msExitFullscreen();
					setFullscreenData(false);
				}
				else {
					// ...otherwise enter fullscreen mode
					// (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
					if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
					else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
					else if (videoContainer.webkitRequestFullScreen) {
						// Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
						// ensures that our custom controls are visible:
						// figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
						// figure[data-fullscreen=true] .controls { z-index:2147483647; }
						video.webkitRequestFullScreen();
					}
					else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
					setFullscreenData(true);
				}
			}

		// Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
		if (document.addEventListener) {
			// Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
			video.addEventListener('loadedmetadata', function() {
				progress.setAttribute('max', video.duration);
			});

			// Changes the button state of certain button's so the correct visuals can be displayed with CSS
			var changeButtonState = function(type) {
				// Play/Pause button
				if (type == 'playpause') {
					if (video.paused || video.ended) {
						playpause.setAttribute('data-state', 'play');
					}
					else {
						playpause.setAttribute('data-state', 'pause');
					}
				}
				// Mute button
				else if (type == 'mute') {
					mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
				}
			}

			// Add event listeners for video specific events
			video.addEventListener('play', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('pause', function() {
				changeButtonState('playpause');
			}, false);
		

			// Add events for all buttons			
			playpause.addEventListener('click', function(e) {
				if (video.paused || video.ended) video.play();
				else video.pause();
			});			

	
			mute.addEventListener('click', function(e) {
				video.muted = !video.muted;
				changeButtonState('mute');
			});
		
			fs.addEventListener('click', function(e) {
				handleFullscreen();
			});

			// As the video is playing, update the progress bar
			video.addEventListener('timeupdate', function() {
				// For mobile browsers, ensure that the progress element's max attribute is set
				if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
			    progress.value = video.currentTime;
				progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
			});

				// Handling the hiding and showing button controls process
			videoContainer.addEventListener('mouseover', function() {
	
				buttonControl.style.visibility='visible';
				progress_p.style.paddingTop = '0';
				content.style.paddingTop = '15px';
			});


		    videoContainer.addEventListener('mouseout', function() {

				buttonControl.style.visibility='hidden';
			    progress_p.style.paddingTop = '15px';
			    content.style.paddingTop = '0';

			});

			// React to the user clicking within the progress bar
			progress.addEventListener('click', function(e) {
				// Also need to take the parent into account here as .controls now has position:relative
				//var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
				var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft + this.offsetParent.offsetParent.offsetLeft)) / this.offsetWidth;
				video.currentTime = (pos * video.duration);
				console.log(video.currentTime);
		     //    console.log("mi pos es " + pos);
			    // console.log("la duración del video es " + video.currentTime);
			});

			video.addEventListener("loadedmetadata", function () {
  			vLength = video.duration.toFixed(1);
  			document.getElementById("vLen").textContent = vLength; // global variable
			}, false);

			//  display the current and remaining times
			video.addEventListener("timeupdate", function () {
  			//  Current time  
  			var vTime = video.currentTime;
  			document.getElementById("curTime").textContent = vTime.toFixed(1);
  			// document.getElementById("vRemaining").textContent = (vLength - vTime).toFixed(1);
  	
  		
  			// Loop for syncing the text with the video speech
  			for (var i = 0; i < text_content.length; i++ ) {
            
	            atributo = Number(text_content[i].getAttribute('data-tmin'));
	            max_atributo = Number(text_content[i].getAttribute('data-tmax'));

	            // highlighting the the text
	            if ( vTime >= atributo && vTime < max_atributo ) {

	            	text_content[i].style.color = "red";

	            	} else {
	            		text_content[i].style.color = "black";
	            	}

            	}

			}, false);

			
	        

			// Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
			document.addEventListener('fullscreenchange', function(e) {
				setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
			});
			document.addEventListener('webkitfullscreenchange', function() {
				setFullscreenData(!!document.webkitIsFullScreen);
			});
			document.addEventListener('mozfullscreenchange', function() {
				setFullscreenData(!!document.mozFullScreen);
			});
			document.addEventListener('msfullscreenchange', function() {
				setFullscreenData(!!document.msFullscreenElement);
			});

		}
	 }


 })();