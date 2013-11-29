// shim for navigator.getUserMedia
navigator.getUserMedia	= navigator.getUserMedia
			|| navigator.webkitGetUserMedia
			|| navigator.mozGetUserMedia
			|| navigator.msGetUserMedia
			|| navigator.oGetUserMedia;
