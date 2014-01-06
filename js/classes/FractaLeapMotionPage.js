define(['Page', 'io', 'leapmotion', 'soundmanager', 'processing'], function(Page, io, leap, soundmanager, processing){
	var LeapMotionPage = {}; 
	//Page View 
	LeapMotionPage = Page.extend({ 
        className: Page.prototype.className + ' FractaLeapMotionPage',
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, {}), 
		socket: io.connect('http://' + window.location.hostname + ':8800'), 
		options:{
			rate: 50, 
			animated: true, 
		},		
		controller: null,
		pjs: null,
		kick: null,
		hh: null,
		snare: null,
		clap: null,
        looping: 0,
        curLooping: {},
        main: null,
        snareclap: 1,
        loopSound: function(sound,name){
            var page = this;
            page.curLooping[name] = name;
            if(!page.looping){
                page.main = name;
                page.loopSounds(sound,name);
            }
            page.looping++;
        },
        loopSounds: function(sound,name){
            var page = this;
            if(page.main == name){
                if(page.snareclap>0)
                    page.snareclap--;
                else
                    page.snareclap++;
                sound.play({
                    onfinish: function(){
                        page.loopSounds(page[page.main],page.main);
                        for(var thingy in page.curLooping){
                            if(thingy != name){
                                if((thingy == 'snare' || thingy == 'clap') && !page.snareclap){
                                    continue;
                                }
                                page[thingy].play({
                                    onfinish: function(){
                                        page.loopSounds(page[thingy], thingy);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        },
		initialize: function(options){ 
			var page = this; 
			Page.prototype.initialize.call(this, options); 
			//initialize geolocation and set center there 
            page.controller = new Leap.Controller();
            page.controller.on('connect', function(){
                console.log('connected');
            });
            page.controller.on('ready', function(){
                console.log('readily connected');
            });
            page.controller.on('frame', function(frame){
                if(page.pjs && frame.hands[0]){
                    var leapPos = frame.hands[0].stabilizedPalmPosition;
                    var handPos = page.leapToScene(frame, leapPos);
                    page.socket.emit('leapProcessing',{
                        handPos: handPos
                    });

                    page.pjs.setThings(handPos);
                }
            });
            page.socket.on('leapProcessing',function(data){
                if(page.pjs)
                    page.pjs.setThings(data.handPos);
            });
            page.controller.connect();

                soundManager.setup({
                  url: 'swf/',
                  debugMode: true,
                  onready: function() {
                    // Ready to use; soundManager.createSound() etc. can now be called.
                    page.kick = soundManager.createSound({
                     url: 'sounds/909Kick.wav',
                     stream: false,
                     autoload:true,
                     onplay: function(){
                        page.pjs.kick();
                     }
                    });
                    page.hh = soundManager.createSound({
                     url: 'sounds/909HiHat.wav',
                     stream: false,
                     autoload:true,
                     onplay: function(){
                        page.pjs.hihat();
                     }
                    });
                    page.snare = soundManager.createSound({
                     url: 'sounds/909Snare.wav',
                     stream: false,
                     autoload:true,
                     onplay: function(){
                        page.pjs.snare();
                     }
                    });
                    page.clap = soundManager.createSound({
                     url: 'sounds/909Clap.wav',
                     stream: false,
                     autoload:true
                    });
                  }
                });


			this.socket.on('connect', function(){
                console.log('THE SOCKSERTSKERJLSKJFLSJ');
			}); 
            $(document).on('keypress', function(ev){                
                if(ev.keyCode === 51 || ev.which === 51){
                    page.socket.emit('changePage2', {}); 
                    page.changePage(); 
                }
            })
            this.socket.on('changePage2', function(dat){
                page.changePage(); 
            })
		},
        changePage: function(ev){
            window.location.href = 'http://dataroper.com/demo2'; 
            return this; 
        },
		checkForProcessing: function(){
			var page = this;
			function processingLoaded(){			
				if(!Processing){
					setTimeout(processingLoaded,250);
					return;
				}
			    page.pjs = Processing.getInstanceById('magic');
	            if(!page.pjs){
	            	setTimeout(processingLoaded,250);
	            }
	        }

	        processingLoaded();
		},
		leapToScene: function( frame , leapPos ){
            var page = this;

            var iBox = frame.interactionBox;
            var left = iBox.center[0] - iBox.size[0]/2;
            var top = iBox.center[1] + iBox.size[1]/2;
            var x = leapPos[0] - left;
            var y = leapPos[1] - top;

            x /= iBox.size[0];
            y /= iBox.size[1];
            x *= 0.3;
            x -= 0.15;
            y *= 2;
		    return [ x , -y ];
		},
		template: function(){ 
			var templateString = '<canvas id="magic" width="1024px" height="700px" data-processing-sources="circularity.pde"></canvas>';
            templateString += '<div style="display:none">';
            for(var i = 0; i < 9; i++){
                templateString += '<img src="images/NZ' + i + '.jpg" id="NZ'+i+'" />';
            }
            templateString += '</div>';
            return templateString;
		}, 
		render: function(){
			var page = this; 
			Page.prototype.render.call(this); 
            this.$el.html(this.template()); 
			// this code was autogenerated from PJS
            setTimeout(function(){
                page.runTheProcessing();
            },3000);
			return this; 
		},
        runTheProcessing: function(){
            var page = this;

            var PDE = new Processing.Sketch(function(M){var r=(function(){function ax(){var aD=this;function az(){M.extendClassChain(aD)}aD.x=0;aD.y=0;aD.vx=0;aD.vy=0;aD.ax=0;aD.ay=0;aD.outofbounds=0;aD.myc=0;function aB(){aD.ax=0;aD.ay=0;for(var aH=0;aH<e;aH++){var aJ=aJ(aD.x,aD.y,(L.get(aH)).x,(L.get(aH)).y);if(aJ<0.001*0.001){aD.$self.rebirth()}var aI=v*(L.get(aH)).mass/aJ;var aG=M.atan((aD.y-(L.get(aH)).y)/(aD.x-(L.get(aH)).x));if(aD.x<=(L.get(aH)).x){aG+=M.PI}aD.ax-=aI*M.cos(aG);aD.ay-=aI*M.sin(aG)}aD.vx+=aD.ax;aD.vy+=aD.ay;aD.x+=G*aD.vx;aD.y+=G*aD.vy;var aF=(aD.x+H)*y;var aE=(aD.y+F)*ah;if((aF>0)&&(aF<y)&&(aE>0)&&(aE<ah)){M.stroke(M.red(aD.myc),M.green(aD.myc),M.blue(aD.myc),J*255);M.point(aF,aE)}else{if(aF<-1.5*y||aF>1.5*y||aE<-1.5*ah||aE>1.5*ah){aD.$self.rebirth()}}}M.addMethod(aD,"draw",aB,false);function ay(){aD.x=M.random(-0.5,0.5);aD.y=M.random(-0.5,0.5);if(ar){aD.vx=M.random(-500,500);aD.vy=M.random(-500,500)}else{aD.vx=0;aD.vy=0}aD.ax=0;aD.ay=0;aD.outofbounds=0;var aF=aD.x*aD.x+aD.y*aD.y;var aE=M.parseInt(k[m]*aF)%k[m];if(aE>=k[m]){aE=k[m]-1}else{if(aE<0){aE=0}}aD.myc=i[m][aE]}M.addMethod(aD,"rebirth",ay,false);function aA(){az();aD.$self.rebirth()}function aC(){if(arguments.length===0){aA.apply(aD,arguments)}else{az()}}aC.apply(null,arguments)}return ax})();M.TravelerHenon=r;var A=(function(){function ax(){var aE=this;function az(){M.extendClassChain(aE)}aE.x=0;aE.y=0;aE.mass=0;aE.outofbounds=0;aE.radius=0;aE.myc=0;function aA(){aE.myc=u()}M.addMethod(aE,"newColor",aA,false);function ay(){aE.x=M.random(-10,10);aE.y=M.random(-10,10);var aH=M.min(M.min(M.min(M.abs(aE.x-0.5),M.abs(aE.x+0.5)),M.abs(aE.y-0.5)),M.abs(aE.y+0.5));aE.radius=M.random(0,aH);aE.outofbounds=0;aE.mass=aE.radius*aE.radius;aE.radius*=M.min(y,ah);var aG=aE.x*aE.x+aE.y*aE.y;var aF=M.parseInt(k[m]*aG)%k[m];if(aF>=k[m]){aF=k[m]-1}else{if(aF<0){aF=0}}aE.myc=i[m][aF]}M.addMethod(aE,"rebirth",ay,false);function aC(){M.fill(aE.myc);M.ellipse((aE.x)*y,(aE.y)*ah,aE.radius*Z*at,aE.radius*Z*at)}M.addMethod(aE,"draw",aC,false);function aB(){az();aE.$self.rebirth()}function aD(){if(arguments.length===0){aB.apply(aE,arguments)}else{az()}}aD.apply(null,arguments)}return ax})();M.GravityWell=A;var V=true;var z=255;var aw=0.05;var ar=false;var C=0;var N=0.05;var e=0;var L=new M.ArrayList();var ac=null;var v=0.5;var G=0.000001;var d=0.5;var x=false;var l=0;var ai=0.5;var R=1;var X=true;var P=0;var O=1.02;var y=0;var ah=0;var W=null;var b=0;var ag=0;var D=1;var an=1;var w=1;var J=0.25;var q=50;var al=false;var aj=100;var H=0,F=0;var T=1.4;var ad=M.PI;var j=null;var av=0;var f=true;var ao=0;var ap=9;var p=M.createJavaArray("TravelerHenon",[aj]);var a=1024;var k=[0,0];var i=M.createJavaArray("$p.color",[2,a]);var m=0;var ab=false;var s=0;function Y(){M.size(window.innerWidth,window.innerHeight);M.frameRate(30);M.smooth();n()}M.setup=Y;function S(){g();if(at>1){at-=0.1}}M.draw=S;var at=1;var U=0;var Z=0;function af(ax){N=ax[0];Z=ax[1]}M.setThings=af;function ak(){at=3}M.kick=ak;function I(){U=4}M.hihat=I;function h(){if(m){m--}else{m++}for(var ax=0;ax<L.size();ax++){(L.get(ax)).newColor()}}M.snare=h;function n(){Q();if(!ab){y=M.width;ah=M.height;t();ac=aa();for(var ax=0;ax<aj;ax++){p[ax]=new r();av++}ab=true}M.strokeWeight(2);M.background(s)}M.vizSetup=n;function g(){if(al){M.background(s)}M.pushMatrix();M.translate(y/2,ah/2);M.rotate(C);M.stroke(0,z);if(al){ac.draw()}for(var ax=0;ax<L.size();ax++){(L.get(ax)).draw()}M.popMatrix();am();aq();au();if(U){U--}else{C+=N}B()}M.vizDraw=g;function ae(){al=!(al)}M.switchDrawMode=ae;function o(){V=!V}M.switchOutline=o;function Q(){ao=M.parseInt(M.random(ap));var ax=ao;while(ax==ao){ax=M.parseInt(M.random(ap))}K("images/NZ"+ao+".jpg",0);K("images/NZ"+ax+".jpg",1);H=0.5;F=0.5;f=true}M.renderSlice=Q;function u(){return i[m][M.parseInt(M.random(k[m]))]}M.somecolor=u;function K(az,aE){var ay=null;ay=M.loadImage(az);M.image(ay,0,0);k[aE]=0;for(var ax=0;ax<ay.width;ax++){for(var aD=0;aD<ay.height;aD++){var aC=M.get(ax,aD);var aA=false;for(var aB=0;aB<k[aE];aB++){if(aC==i[aE][aB]){aA=true;break}}if(!aA){if(k[aE]<a){i[aE][k[aE]]=aC;k[aE]++}else{break}}}}}M.takecolor=K;function E(ay,aA,ax,az){return(ay-ax)*(ay-ax)+(aA-az)*(aA-az)}M.distance=E;function aa(){var az=new A();az.x=M.random(-2,2);az.y=M.random(-2,2);var ax=az.x;var aC=az.y;var aA=M.max(M.abs(ax-0.5),M.abs(ax+0.5));var ay=M.max(M.abs(aC-0.5),M.abs(aC+0.5));var aB=aA+ay;az.radius=M.random(aB*y*2*1.414,aB*y*2*1.414);az.myc=s;t();return az}M.GenBigPlanet=aa;function t(){s=u()}M.NewBackground=t;function B(){var ax=1;if(V&&z<255){z=M.__int_cast(M.min(z+ax,255))}if(!V&&z>0){z=M.__int_cast(M.max(z-ax,0))}}M.Outline=B;function am(){for(var ay=0;ay<R;ay++){var az=M.random(0,1);if(az<ai){var ax=new A();L.add(ax)}}}M.PlanetBirth=am;function aq(){for(var ax=0;ax<L.size();ax++){if((L.get(ax)).radius<0.5){L.remove(ax)}}if(ac.radius<0.5){ac=aa()}}M.PlanetDeath=aq;function c(ax,aA){if(aA>0){var az=ax;for(var ay=1;ay<aA;ay++){ax=ax*az}}if(aA<0){var az=1/ax;ax=az;for(var ay=1;ay<-1*aA;ay++){ax=ax*az}}if(aA==0){ax=1}return ax}M.power=c;function au(){for(var ax=0;ax<av;ax++){p[ax].x/=O;p[ax].y/=O}for(var ax=0;ax<L.size();ax++){(L.get(ax)).x/=O;(L.get(ax)).y/=O;(L.get(ax)).radius/=O;(L.get(ax)).mass/=(O*O)}ac.x/=O;ac.y/=O;ac.radius/=O;ac.mass/=(O*O)}M.ScaleDown=au});

    for(var i = 0; i < 9; i++)
        PDE.imageCache.add("images/NZ"+i+".jpg", document.getElementById('NZ'+i));

  var myCanvas = document.getElementById('magic');
  new Processing(myCanvas, PDE);
  page.checkForProcessing();
  page.socket.on('sampleTrigger', function(data){
    if(data.kick) page.kickPlay();
    if(data.snare) page.snarePlay();
    if(data.clap) page.clapPlay();
    if(data.hh) page.hhPlay();
  });
                    $(document).keypress(function(e){
                        if(e.which == 75 || e.which == 107 || e.keyCode == 75 || e.keyCode == 107){
                            page.kickPlay();
                            page.socket.emit('sampleTrigger',{kick:true});
                        }
                        if(e.which == 83 || e.which == 115 || e.keyCode == 83 || e.keyCode == 115){
                            page.snarePlay();
                            page.socket.emit('sampleTrigger',{snare:true});
                        }
                        if(e.which == 67 || e.which == 99 || e.keyCode == 67 || e.keyCode == 99){
                            page.clapPlay();
                            page.socket.emit('sampleTrigger',{clap:true});
                        }
                        if(e.which == 72 || e.which == 104 || e.keyCode == 72 || e.keyCode == 104){
                            page.hhPlay();
                            page.socket.emit('sampleTrigger',{hh:true});
                        }
                        if(e.which == 13 || e.keyCode == 13){
                            page.pjs.switchDrawMode();
                        }
                        if(e.which == 70 || e.which == 102 || e.keyCode == 70 || e.keyCode == 102){
                            page.pjs.switchOutline();
                        }
                    });
        },
        kickPlay: function(){
            var page = this;
                            if(!page.kick.playState)
                                page.loopSound(page.kick,'kick');
                            else{
                                page.looping--;
                                delete page.curLooping.kick;
                                if(page.main == 'kick' && page.looping)
                                    page.main = 'hh';
                                page.kick.stop();
                            }

        },
        snarePlay: function(){
            var page = this;
                            if(!page.snare.playState)
                                page.loopSound(page.snare,'snare');
                            else{
                                page.looping--;
                                delete page.curLooping.snare;
                                page.snare.stop();
                            }

        },
        clapPlay: function(){
            var page = this;
                            if(!page.clap.playState)
                                page.loopSound(page.clap,'clap');
                            else{
                                delete page.curLooping.clap;
                                page.looping--;
                                page.clap.stop();
                            }

        },
        hhPlay: function(){
            var page = this;
                            if(!page.hh.playState)
                                page.loopSound(page.hh,'hh');
                            else{
                                delete page.curLooping.hh;
                                page.looping--;
                                if(page.main == 'hh' && page.looping)
                                    page.main = 'kick';
                                page.hh.stop();
                            }

        }
	});  
	return LeapMotionPage; 
}); 