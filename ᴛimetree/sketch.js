// ᴛime of day
// One of four values: "night", "sunrise", "day", "sunset"
let tod = "night";
// The global hour
let hr = 0;

// Array for clouds
let clouds = [];

// Array for leaves
let leaves = [];

// Seconds (for leaves)
let cur_sec = null;

// Array of points for leaf mass for different ᴛimes of day
let beeg_leaf = [
  // Sunrise
  [
    [306,313],
    [253,302],
    [295,277],
    [265,244],
    [312,234],
    [322,208],
    [338,159],
    [362,202],
    [371,250],
    [394,233],
    [397,185],
    [423,210],
    [425,278],
    [482,241],
    [452,307],
    [537,282],
    [522,311],
    [454,341],
    [388,313],
    [357,337],
    [320,320]
  ],
  // during day
  [
    [207,265],
    [228,233],
    [240,191],
    [274,185],
    [284,146],
    [326,124],
    [383,134],
    [441,130],
    [496,170],
    [519,214],
    [554,234],
    [578,301],
    [531,348],
    [462,344],
    [446,300],
    [400,280],
    [369,280],
    [350,335],
    [300,345],
    [246,351]
  ],
  // late evening
  [
    [284,330],
    [250,300],
    [270,260],
    [240,225],
    [290,214],
    [322,205],
    [322,160],
    [375,155],
    [385,195],
    [441,180],
    [445,225],
    [490,236],
    [500,280],
    [525,310],
    [490,350],
    [445,310],
    [420,265],
    [380,275],
    [340,326]
  ]
];

// Cloud class
class Cloud
{
  constructor(x,y,num_circ)
  {
    this.x = x;
    this.y = y;
    // Random X speed to float across the screen
    this.xsp = random(50,200) / 200;
    this.circs = [];
    // Randomly position circles for clouds
    for (let i = 0; i < num_circ; i++)
    {
      this.circs.push({
        "x":random(-32,32),
        "y":random(-8,16)
      });
    }
  }
  
  tick()
  {
    strokeWeight(0);
    // Determine the color of the clouds based on ᴛime of day
    let f; // = tod == "day" ? "#eeeeff" : tod == "night" ? "#333399" : tod == "sunrise" ? "#8888dd" : "#ffaaaa";
    if (hr >= 6 && hr < 20)
    {
      if(hr < 7)
        f = "#182394";
      else if (hr < 8)
        f = "#ccccff";
      else if (hr < 17)
        f = "#eeeeff";
      else if (hr < 18)
        f = "#ffcc00";
      else if (hr < 19)
        f = "#ffaaaa";
      else if (hr < 20)
        f = "#bb9999";
    }
    else
      f = "#333399";
    fill(f);
    // Rendering circles to make up the cloud
    for (var c of this.circs)
      circle(this.x + c.x, this.y + c.y, 48);
    this.x += this.xsp;
  }
  
  deletable()
  {
    // Only becomes deletable when it floats offscreen
    return this.x >= width + 48;
  }
}

// Leaf class
class Leaf
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.xsp = random(20,500) / 250;
    this.ysp = random(10,40) / 20;
    this.tickable = random(0,36000) / 100;
  }
  
  tick()
  {
    // Moves according to X and Y speeds
    this.x += this.xsp;
    this.y += this.ysp;
    // Acceleration
    this.xsp *= 1.005;
    this.ysp *= 1.005;
    // Ticks the thing
    this.tickable += 1.5;
    // Calculates sine from degrees
    let offset = sin(this.tickable * PI / 180);
    // Draws the leaf
    let f = "#12cd00";
    if (hr >= 20)
      f = "#eeaa00";
    else if (hr >= 17)
      f = "#eeee00";
    fill(f);
    arc(this.x - 64 * offset, this.y - 32 * (offset + PI / 2), 32, 16, PI / 6 + offset, PI + offset);
  }
  
  deletable()
  {
    // Only becomes deletable when it falls offscreen
    return this.x >= width + 128 || this.y >= height + 128;
  }
}

function setup()
{
  // Fnuuy canvas goes brrr
  createCanvas(800, 600);
  // Seed the random values, or it will be the same every ᴛime!
  randomSeed(new Date().getTime());
}

function prepare_tod()
{
  hr = hour();
  if (hr >= 6)
  {
    if (hr < 7)
      tod = "sunrise";
    else if (hr < 18)
      tod = "day";
    else if (hr < 20)
      tod = "sunset";
  }
  else
    tod = "night";
}

function draw_bg() // : void // Right I forgot this isn't ActionScript
{
  // Draws the background
  let sky_color = "#6699ff";
  // ᴛime of day for sky color
  if (hr >= 6 && hr < 20)
  {
    if(hr < 7)
      sky_color = "#182394";
    else if (hr < 8)
      sky_color = "#3385cc";
    else if (hr < 17)
      sky_color = "#669fff"; // Nice
    else if (hr < 18)
      sky_color = "#eeaa00";
    else if (hr < 19)
      sky_color = "#ff9912";
    else if (hr < 20)
      sky_color = "#992540";
  }
  else
    sky_color = "#220055";
  background(sky_color);
}

function draw_horz_bars()
{
  strokeWeight(0);
  fill("#aea2de7f");
  let h = hr % 12;
  rect(0,0,width,h);
  rect(0,height - h,width,height);
}

function draw_beeg_rhombus_thing()
{
  // Beeg spinny rhombus square thing
  let f = "#aea2de";
  if (tod == "sunrise")
    f = "#aaffff";
  else if (tod == "sunset")
    f = "#ff2222";
  else if (tod == "day")
    f = "#ffffff";
  stroke(f);
  strokeWeight(22);
  fill("#00000000");
  // Variable setup
  let a = (second() / 30 + millis() / 30000) * PI; // Angle
  let cx = width / 2; // Center variables so we don't have to keep typing them out over and over again
  let cy = height / 2; // The "radius" of the thing is half the height of the screen, so we could reuse this variable
  quad(
    cx + cos(a) * cy, cy + sin(a) * cy,
    cx + cos(a + PI / 2) * cy, cy + sin(a + PI / 2) * cy,
    cx + cos(a + PI) * cy, cy + sin(a + PI) * cy,
    cx + cos(a + 3 * PI / 2) * cy, cy + sin(a + 3 * PI / 2) * cy
  );
  quad(
    cx + cos(-a) * cy / 2, cy + sin(-a) * cy / 2,
    cx + cos(-a + PI / 2) * cy / 2, cy + sin(-a + PI / 2) * cy / 2,
    cx + cos(-a + PI) * cy / 2, cy + sin(-a + PI) * cy / 2,
    cx + cos(-a + 3 * PI / 2) * cy / 2, cy + sin(-a + 3 * PI / 2) * cy / 2
  );
}

function draw_side_bars()
{
  strokeWeight(0);
  fill("#000000ff");
  let m = minute() * 1.25;
  rect(0,0,m,height);
  rect(width - m,0,width,height);
}

/*void*/ function draw_clouds() // Right I forgot this isn't C++
{
  // Make clouds randomly, as long as there aren't already eight of them
  if(random(0,256) <= 1 && clouds.length < 8)
    clouds.push(new Cloud(-48,random(-10,200),8));
  // Tick each cloud
  for (var c of clouds)
    c.tick();
  // Remove clouds that are offscreen
  clouds = clouds.filter((c) => !c.deletable());
}
// end // Right I forgot this isn't Lua

function draw_tree()
{
  strokeWeight(0);
  let f = "#996600";
  if (tod == "night")
      f = "#552222";
  else if (tod == "sunrise")
    f = "#774400";
  else if (tod == "sunset")
    f = "#dd6600";
  fill(f);
  let half_x = width / 2;
  let half_y = height / 2;
  // Manually adding each shape onto the tree
  quad(half_x - 32, height, half_x + 32, height, half_x - 16, half_y, half_x + 16, half_y);
  quad(395, 348, 385, 500, 415, 500, 405, 335);
  triangle(392,308,222,270,400,345);
  triangle(370,320,400,308,300,200);
  triangle(292,297,245,328,320,302);
  triangle(340,252,248,230,347,270);
  triangle(350,258,334,136,369,283);
  triangle(348,196,363,166,350,206);
  triangle(389,298,414,136,415,306);
  triangle(402,224,376,203,400,238);
  triangle(412,263,454,184,411,248);
  triangle(437,214,435,187,435,218);
  triangle(413,302,520,230,408,331);
  triangle(413,321,560,288,406,350);
  triangle(437,290,457,230,455,280);
  triangle(492,312,521,327,460,326);
  triangle(480,310,531,269,500,308);
}

// For drawing leaves
function draw_leaves()
{
  // the main big thing to prevent a bunch of lag from needing to iterate through a kbjillion leaves
  // Only draws the mass of leaves during not night
  if (tod != "night" || hr == 20)
  {
    // Leaf color
    let f = "#12cb00";
    if (hr >= 20)
      f = "#ee8900";
    else if (hr >= 17)
      f = "#ffcc00";
    else if (hr >= 7)
      f = "#12aa00";
    fill(f);
    // Deciding which leaf shape to use
    let ind = hr < 7 ? 0 : hr < 18 ? 1 : 2;
    beginShape();
    for (p of beeg_leaf[ind])
      vertex(p[0], p[1]);
    endShape(CLOSE);
  }
  // Leaves only begin to fall starting at twelve, noon
  if (hr >= 12 && hr < 21 && cur_sec != second())
  {
    cur_sec = second();
    // Spawning from two random boxes
    if (random(0,1))
      leaves.push(new Leaf(290 + random() * 210, 260 + random() * 70));
    else
      leaves.push(new Leaf(355 + random() * 60, 200 + random() * 150));
  }
  // Tick each leaf
  for (var l of leaves)
    l.tick();
  // Remove leaves that are offscreen
  leaves = leaves.filter((l) => !l.deletable());
}

// Debug function to figure out where I'm clicking

function mousePressed()
{
  print(mouseX, mouseY);
}


// Main ticking loop
function draw()
{
  clear();
  // Prepare ᴛime of day
  prepare_tod();
  // The draw calls
  draw_bg();
  draw_horz_bars();
  draw_beeg_rhombus_thing();
  draw_side_bars();
  draw_clouds();
  draw_tree();
  draw_leaves();
}