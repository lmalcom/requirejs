// shim for window.requestAnimationFrame
window.requestAnimationFrame =  window.requestAnimationFrame || 
								window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame;
