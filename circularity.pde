/* @pjs preload="Images/NZ0.jpg,Images/NZ1.jpg,Images/NZ2.jpg,Images/NZ3.jpg,Images/NZ4.jpg,Images/NZ5.jpg,Images/NZ6.jpg,Images/NZ7.jpg,Images/NZ8.jpg"; */ 

boolean outline = true; //controls the outline
int transparency = 255; //controls the opacity of the outlines
float outlinespeed = 0.05; //controls the speed at which outlines fade and appear (1 = a single draw, 1/n = n draws)
boolean partveloc = false; //controls whether particles start with randomized velocities
float rotation = 0;
float rotatespeed = 0.05; //controls the speed of rotation
//Gravloops setup
int numwells = 0; //the number of wells
ArrayList Planets = new ArrayList();
GravityWell BigPlanet;
float GRAV = 0.5; //the coefficient of gravitational attraction
float time = 0.000001; //the discrete time step in the motion of the particles
float MASS = 0.5; //the mass of a planet
boolean MediumExist = false; //indicates whether there are MediumPlanets

int Bigpop = 0; //number of Big Planets
float BigGenChance = 0.5; //the odds a big planet gets generated with each call of PlanetBirth()
int NumberBigBirth = 1; //the number of times PlanetBirth() is called per draw() 

boolean colorchoice = true; //toggle to switch colors

int ZOOM = 0; //the user input for zooming

float SCALAR = 1.02; //with each zoom, the amount of scaling (length l is now length SCALAR*l)

float SHOWWIDTH; //effective width (independent of screen size)

float SHOWHEIGHT; //effective height

PFont font;

float horiz=0;
float vert = 0;

float LOOSE = 1;
// based on code from mathworld.wolfram.com/HenonMap.html

// Processing 0085 Beta syntax update
// j.tarbell   April, 2005

//the number of movement updates drawn per frame
float PARTICLESPEED = 1;

//literally pixels of thickness
float THICKNESS = 1;

//% opacity
float TRANSPARENCY = .25;

//the amount of change in particle trajectories
float MUTATIONMAX = 50;

//set to true for individual grains, set to false for smooth lines
boolean particles = false;

//number of particles
int maxnum = 100;

// number of points to draw in each iteration
float offx, offy;
float gs = 1.4;      // scale the visualization to match the applet size
float ga = PI;       // slice constant (0...TWO_PI)
float[] aList;
int num = 0;

boolean drawing = true;

// palette series attributes
int gifID = 0;
int gifNum = 9;

// OBJECTS
TravelerHenon[] travelers = new TravelerHenon[maxnum];

int maxpal = 1024;
int numpal[] = {0,0};
color[][] goodcolor = new color[2][maxpal];
int gcNum = 0;

boolean alreadySetUp = false;
color backgroundcolor;

void setup(){
  size(1024, 700);
  frameRate(30);
  smooth();
  vizSetup();
}
void draw(){
  vizDraw();
  if(KickFactor > 1)
    KickFactor -= 0.1;
}
float KickFactor = 1;
int HHFactor = 0;
float LeapFactor;
//function for LeapMotion
void setThings(leapData){
  rotatespeed = leapData[0];
  LeapFactor = leapData[1];
}
void kick(){
  KickFactor = 3;
}
void hihat(){
  HHFactor = 4;
}
void snare(){
  if(gcNum)
    gcNum--;
  else
    gcNum++;
  for(int i = 0; i < Planets.size(); i++) {
    ((GravityWell) Planets.get(i)).newColor();  
  } 

}

// MAIN METHODS
void vizSetup() {
  renderSlice(); 

  if(!alreadySetUp){
    SHOWWIDTH = width;
    SHOWHEIGHT = height;
    NewBackground(); 

    BigPlanet = GenBigPlanet();
    // make some travelers
    for (int i=0;i<maxnum;i++) {
      travelers[i] = new TravelerHenon();
      num++;
    }
    alreadySetUp = true;
  }
   // gen slice
  strokeWeight(2);
  background(backgroundcolor);
}

void vizDraw() { 
  if(particles){ 
    background(backgroundcolor); 
  }
  pushMatrix();
  translate(SHOWWIDTH/2, SHOWHEIGHT/2);   
  rotate(rotation);
  stroke(0, transparency);
  if(particles) { BigPlanet.draw(); } // this is why the backgrounds are different
  for(int i = 0; i < Planets.size(); i++) {
    ((GravityWell) Planets.get(i)).draw();  
  } 
 
  //draw planets
  popMatrix();
      
  PlanetBirth();
  PlanetDeath();
 
  ScaleDown();
  if(HHFactor)
      HHFactor--;
  else
    rotation += rotatespeed;
  Outline(); //change transparency of outlines
}

void switchDrawMode(){
  particles = !(particles);
}
void switchOutline(){
  outline = !outline;
}


// METHODS ----------------------------------------------------------------------------

void renderSlice() {
  // pick random palette
  gifID = int(random(gifNum));
  int gifID2 = gifID;
  while(gifID2 == gifID){
    gifID2 = int(random(gifNum));
  }
  // convert GIF palette into usable palette
  takecolor("Images/NZ"+ gifID +".jpg",0);
  takecolor("Images/NZ"+ gifID2+".jpg",1);
  
  offx = 0.5; //+horiz;
  offy = 0.5; //+vert;

  
  // begin drawing again
  drawing = true;
}


// OBJECTS ----------------------------------------------------------------------------

class TravelerHenon {
  float x, y, vx, vy, ax, ay;
  int outofbounds;

  color myc;

  TravelerHenon() {
    rebirth();
  }

  void draw() {
    // move through time 
   ax = 0;
  ay = 0;
 
  //calculate the gravitational effects of each well on each particle
  for(int i = 0; i < numwells; i++){
  
  float distance = distance(x,y, ((GravityWell) Planets.get(i)).x, ((GravityWell) Planets.get(i)).y); //find the distance between them
  
  if(distance < 0.001*0.001){
    rebirth();
  }
  
  float acceleration = GRAV*((GravityWell) Planets.get(i)).mass / distance; //find the magnitude of the acceleration due to well i
  
  float theta = atan((y-((GravityWell) Planets.get(i)).y)/ (x-((GravityWell) Planets.get(i)).x)); //calculate the angle of inclination from the gravity well to the particle (in polar coordinates)
  
  if(x <= ((GravityWell) Planets.get(i)).x){
  theta += PI; //arctan only returns values in (-PI/2, PI/2)...annoying
  }
  
  ax -= acceleration*cos(theta);
  ay -= acceleration*sin(theta); //update acceleration
  }
  
  vx += ax;
  vy += ay; //update velocity
  
  x += time*vx;
  y += time*vy; //update position
  
 
    
  
    
    
    float px =  (x+offx)*SHOWWIDTH;
    float py = (y+offy)*SHOWHEIGHT;  
    
    if ((px>0) && (px<SHOWWIDTH) && (py>0) && (py<SHOWHEIGHT)) {
      // render  
      stroke(red(myc),green(myc),blue(myc),TRANSPARENCY * 255);
      point(px,py);
    }
    else{
      if(px < -1.5*SHOWWIDTH || px > 1.5*SHOWWIDTH || py < -1.5*SHOWHEIGHT || py > 1.5*SHOWHEIGHT){
        rebirth();
      }
    }
  }

  void rebirth() {
    x = random(-0.5,0.5);
    y = random(-0.5,0.5);
    if(partveloc){
    vx = random(-500, 500);
    vy = random(-500, 500);
    }
    else{
    vx = 0;
    vy = 0;
    }
    ax = 0;
    ay = 0;
    outofbounds = 0;
    float d = x*x+y*y;
    int idx = int(numpal[gcNum]*d)%numpal[gcNum];
    if (idx>=numpal[gcNum]) {
      idx = numpal[gcNum]-1;
    } else if (idx<0) {
      idx = 0;
    }
    myc = goodcolor[gcNum][idx];
  }

}


// COLOR METHODS ------------------------------------------------------------------

color somecolor() {
  // pick some random good color
  return goodcolor[gcNum][int(random(numpal[gcNum]))];
}

void takecolor(String fn, int pos) {
  // load color source
  PImage b;
  b = loadImage(fn);
  image(b,0,0);
  
  // initialize palette length
  numpal[pos]=0;

  // find all distinct colors
  for (int x=0;x<b.width;x++){
    for (int y=0;y<b.height;y++) {
      color c = get(x,y);
      
      boolean exists = false;
      for (int n=0;n<numpal[pos];n++) {
        if (c==goodcolor[pos][n]) {
          exists = true;
          break;
        }
      }
      if (!exists) {
      
        // add color to palette
        if (numpal[pos]<maxpal) {
          goodcolor[pos][numpal[pos]] = c;
          numpal[pos]++;
        } else {
          break; 
        }
      }
    }
  }
}



float distance(float x1, float y1, float x2, float y2){
 return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2); //calculate euclidean distance in the plane    
}



class GravityWell {
  float x, y, mass;
  int outofbounds;
  float radius;

  color myc;

  GravityWell() {
    rebirth();
  }

  void newColor(){
    myc = somecolor();
  }

  void rebirth() {
    x = random(-10, 10);
    y = random(-10, 10); //get coordinates for center
    float maxradius = min(min(min(abs(x-0.5), abs(x+0.5)), abs(y-0.5)), abs(y+0.5)); //put a crude upper bound on the radius so it doesn't appear on screen when it spawns
    radius = random(0, maxradius);
    outofbounds = 0;
    mass = radius*radius; //have the mass vary with the square of the radius
    radius *= min(SHOWWIDTH, SHOWHEIGHT);
    float d = x*x+y*y;
    int idx = int(numpal[gcNum]*d)%numpal[gcNum];
    if (idx>=numpal[gcNum]) {
      idx = numpal[gcNum]-1;
    } else if (idx<0) {
      idx = 0;
    }
    myc = goodcolor[gcNum][idx];
  }
  
  void draw() {
  fill(myc);
  ellipse((x)*SHOWWIDTH, (y)*SHOWHEIGHT, radius*LeapFactor*KickFactor, radius*LeapFactor*KickFactor);   
  }
}


GravityWell GenBigPlanet(){
  
 GravityWell TempPlanet = new GravityWell();
 
 TempPlanet.x = random(-2, 2);
 TempPlanet.y = random(-2, 2); //randomly choose coordinates of center

 float x = TempPlanet.x;
 float y = TempPlanet.y;
 
 float dx = max(abs(x-0.5), abs(x+0.5));
 float dy = max(abs(y -0.5), abs(y+0.5));
  
 float mindistance = dx + dy; //put a crude lower bound on the minimum required radius (using taxicab metric)
 TempPlanet.radius = random(mindistance * SHOWWIDTH*2*1.414, mindistance*SHOWWIDTH*2*1.414);

 TempPlanet.myc = backgroundcolor; //give the planet the background color
 NewBackground(); 

 return TempPlanet;
}


void NewBackground() {
  backgroundcolor = somecolor();
}

void Outline(){
 
 float change = 1; //how much transparency changes
 
 if(outline && transparency < 255){
  transparency = (int) min(transparency+change, 255);
 }

 if(!outline && transparency > 0){
   transparency = (int) max(transparency - change, 0); 
 }
  
  
  
}


void PlanetBirth() {
  
  for( int i = 0; i < NumberBigBirth; i++){
     float rando = random(0,1); //if we beat the odds...
     if(rando < BigGenChance){
       GravityWell TempPlanet = new GravityWell(); //then make a new planet  
       Planets.add(TempPlanet);
     }
   
  
}
}

void PlanetDeath() {
  
  for(int i = 0; i < Planets.size(); i++){
    if( ((GravityWell) Planets.get(i)).radius < 0.5){
    Planets.remove(i);
    }  
  }
  
  if(BigPlanet.radius<0.5){
   BigPlanet = GenBigPlanet(); 
  }
}



//===================
//       POWER
//===================

//raises a float to an integer power

float power(float x, int y){
  
  if(y > 0){
    float t = x;

    for(int i = 1; i < y; i++){  
      x = x*t;  
    }
  } 
 
  if(y < 0){
    float t = 1/x;
    x = t;
    
    for(int i = 1; i < -1*y; i++){
     x = x*t;
    } 
  } 
  
  if(y == 0){
   x = 1; 
   }
  return x;
  
  
  
}



void ScaleDown() {
   for (int i=0;i<num;i++) {
    travelers[i].x /= SCALAR;
    travelers[i].y /= SCALAR;    
  } 
  
  
  
  for(int i = 0; i < Planets.size(); i++) {
     ((GravityWell) Planets.get(i)).x /= SCALAR;
     ((GravityWell) Planets.get(i)).y /= SCALAR;
     ((GravityWell) Planets.get(i)).radius /= SCALAR;
     ((GravityWell) Planets.get(i)).mass /= (SCALAR * SCALAR);
  }
      BigPlanet.x /= SCALAR;
     BigPlanet.y /= SCALAR;
     BigPlanet.radius /= SCALAR;
     BigPlanet.mass /= (SCALAR * SCALAR); 
  
}