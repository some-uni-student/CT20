let state = 0;
let timer = 0;
let caret_timer = 0;

let tickables = [];
let clickables = [];
let scanlines = [];

function setup()
{
  createCanvas(800, 600);
  randomSeed(new Date().getTime());
  strokeWeight(0);
  textSize(16);
  textFont("Courier New");
  
  for (let y = 0; y < 608; y += 4)
    new Scanline(y);
}

function deep_copy(obj)
{
  if (!obj)
    return null;
  let new_copy = {};
  // Well it's not a container, so
  if (typeof obj != "object")
    return obj;
  for (let k in obj)
  {
    // Deep copying arrays
    if (Array.isArray(obj[k]))
    {
      let a = [];
      for (let i in obj[k])
        a.push(deep_copy(obj[k][i]));
      new_copy[k] = a;
    }
    // Just deep copy it
    else
      new_copy[k] = deep_copy(obj[k]);
  }
  return new_copy;
}

function get_size(obj)
{
  let s = 0;
  for (let i in obj)
    s++;
  return s;
}

function draw_bg()
{
  if (timer <= 60 && state == 0)
    background("#000000");
  else
    background("#002200");
}

class Btn
{
  constructor(x,y,w,h,scolor,sw,fcolor,txt,tcolor)
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.scolor = scolor;
    this.sw = sw;
    this.fcolor = fcolor;
    this.txt = txt;
    this.tcolor = tcolor;
    this.event = null;
    this.enabled = true;
    tickables.push(this);
    clickables.push(this);
  }
  
  removable()
  {
    return this.ded;
  }
  
  destroy()
  {
    this.ded = true;
  }
  
  check_click()
  {
    if (!this.enabled || !this.event || typeof this.event != "function")
      return false;
    
    if (abs(mouseX - this.x) <= this.w / 2 && abs(mouseY - this.y) <= this.h)
    {
      this.event();
      return true;
    }
  }
  
  tick()
  {
    push();
    stroke(this.scolor != null ? this.scolor : "#00ff00");
    strokeWeight(this.sw != null ? this.sw : 1);
    fill(this.fcolor != null ? this.fcolor : "#005500");
    rect(this.x - this.w / 2,this.y - this.h / 2,this.w,this.h);
    pop();
    push();
    textSize(16);
    textAlign(CENTER);
    textFont("Courier New");
    fill(this.tcolor != null ? this.tcolor : "#00ff00");
    text(this.txt != null ? this.txt : "",this.x,this.y + 4);
    pop();
  }
}

class Scanline
{
  constructor(y)
  {
    this.y = y;
    scanlines.push(this);
  }
  
  tick()
  {
    this.y += 0.03125;
    if (this.y > 608)
      this.y = 0;
    
    push();
    blendMode(BURN);
    strokeWeight(0);
    fill("#00000055");
    rect(0,this.y - 1,width,2);
    pop();
  }
}

let startup = {
  "delay":120,
  "txt":"",
  "texts": [
    "Cloud Database™, brought to you by Cloud Technologies\nIncorporated",
    "Coming Soon™ to a Data Center near you!",
    "",
    "Locating nearest active server...",
    "CTSrv100 v0.0.1a - Hosted by Got Net ~ Santa Cruz data\ncenter",
    "Establishing connection...",
    "Connection established"
  ]
};

function beginning_sequence()
{
  timer++;
  if (timer > 120)
  {
    if (startup.delay > 0)
      startup.delay--;
    else if (startup.texts.length > 0)
    {
      let l = startup.texts[0];
      
      if (l.length > 0)
      {
        if (timer % 2 == 0)
        {
          caret_timer = 0;
          startup.txt += l.substring(0,1);
          startup.texts[0] = l.substring(1);
        }
      }
      else
      {
        startup.txt += "\n";
        if (startup.texts.length >= 5)
          startup.delay = 30;
        else
          startup.delay = 90;
        startup.texts.splice(0,1);
      }
    }
    else
    {
      startup.delay--;
      if (startup.delay == -2)
      {
        let b = new Btn(32 + 48, height - 64, 48 * 2, 32);
        b.txt = "Start";
        b.event = function()
        {
          state = 1;
          timer = 0;
          b.destroy();
        }
      }
    }
    
    let final_text = startup.txt;
    if (caret_timer <= 30)
      final_text += "_";
    
    push();
    fill("#0f0");
    text(final_text, 32, 32);
    pop();
    
    if (timer >= 122)
      timer = 120;
  }
}

let menu = {
  "delay":0,
  "txt":"",
  "txts":[
    "Loading...",
    "The server seems to be running into some issues at the\nmoment.",
    "We apologize for the inconvenience.",
    "In the meantime, you can learn more about us and what\nwe do."
  ],
  "temp_txts":[]
};

function menu_sequence()
{
  timer++;
  if (timer == 1)
  {
    menu.txt = "";
    menu.temp_txts = menu.txts.slice();
  }
  if (timer >= 60)
  {
    if (menu.delay > 0)
      menu.delay--;
    else if (menu.temp_txts.length > 0)
    {
      let l = menu.temp_txts[0];
      
      if (l.length > 0)
      {
        if (timer % 2 == 0)
        {
          caret_timer = 0;
          menu.txt += l.substring(0,1);
          menu.temp_txts[0] = l.substring(1);
        }
      }
      else
      {
        menu.txt += "\n";
        if (menu.temp_txts.length > 3 || menu.temp_txts.length <= 0)
          menu.delay = 120;
        else
          menu.delay = 30;
        menu.temp_txts.splice(0,1);
      }
    }
    else
    {
      menu.delay--;
      if (menu.delay == -15)
      {
        let b1 = new Btn(32 + 64, height - 160, 128, 32,"#00aa00");
        b1.txt = "See list";
        b1.fcolor = "#002200";
        b1.tcolor = "#00aa00";
        let b2 = new Btn(32 + 80, height - 112, 160, 32,"#00aa00");
        b2.txt = "Submit entry";
        b2.fcolor = "#002200";
        b2.tcolor = "#00aa00";
        let b3 = new Btn(32 + 64, height - 64, 128, 32);
        b3.txt = "About us";
        b3.event = function()
        {
          state = 2;
          timer = 0;
          b1.destroy();
          b2.destroy();
          b3.destroy();
        }
      }
    }
    
    let final_text = menu.txt;
    if (caret_timer <= 30)
      final_text += "_";
    
    push();
    fill("#0f0");
    text(final_text, 32, 32);
    pop();
    
    if (timer >= 62)
      timer = 60;
  }
}

let wwd = {
  "delay":0,
  "txt":"",
  "txts":[
    "Our Mission",
    "We strive to locate and record every data center that exists\non the planet.",
    "None too small, none too far.",
    "And if they're up to no good, you bet we'll be the first to\nknow.",
    "Since we are familiar with data centers, let us at least talk\nabout the one that hosts our server(s)."
  ],
  "temp_txts":[]
};

function what_we_do()
{
  timer++;
  if (timer == 1)
  {
    wwd.txt = "";
    wwd.temp_txts = wwd.txts.slice();
  }
  if (timer >= 60)
  {
    if (wwd.delay > 0)
      wwd.delay--;
    else if (wwd.temp_txts.length > 0)
    {
      let l = wwd.temp_txts[0];
      
      if (l.length > 0)
      {
        if (timer % 2 == 0)
        {
          caret_timer = 0;
          wwd.txt += l.substring(0,1);
          wwd.temp_txts[0] = l.substring(1);
        }
      }
      else
      {
        wwd.txt += "\n";
        wwd.delay = 30;
        wwd.temp_txts.splice(0,1);
      }
    }
    else
    {
      wwd.delay--;
      if (wwd.delay == -15)
      {
        let b = new Btn(32 + 96, height - 64, 192, 32);
        b.txt = "Our home server";
        b.event = function()
        {
          state = 3;
          timer = 0;
          b.destroy();
        }
      }
    }
    
    let final_text = wwd.txt;
    if (caret_timer <= 30)
      final_text += "_";
    
    push();
    fill("#0f0");
    text(final_text, 32, 32);
    pop();
    
    if (timer >= 62)
      timer = 60;
  }
}

let hs = {
  "delay":0,
  "txt":"",
  "txts":[
    "About Data Centers",
    "Our server is hosted by the Got Net data center in Santa Cruz.",
    "It is located downtown, at 303 Potrero St., building 40-E.",
    "Without it and many data centers like it, the cloud, or the\ninternet cannot exist as it is today.",
    "The internet, the cloud, all of it still needs a physical\nspace to exist in, to store data somewhere.",
    "Therefore, data centers are necessary."
  ],
  "temp_txts":[]
};

function home_server()
{
  timer++;
  if (timer == 1)
  {
    hs.txt = "";
    hs.temp_txts = hs.txts.slice();
  }
  if (timer >= 60)
  {
    if (hs.delay > 0)
      hs.delay--;
    else if (hs.temp_txts.length > 0)
    {
      let l = hs.temp_txts[0];
      
      if (l.length > 0)
      {
        if (timer % 2 == 0)
        {
          caret_timer = 0;
          hs.txt += l.substring(0,1);
          hs.temp_txts[0] = l.substring(1);
        }
      }
      else
      {
        hs.txt += "\n";
        hs.delay = 30;
        hs.temp_txts.splice(0,1);
      }
    }
    else
    {
      hs.delay--;
      if (hs.delay == -15)
      {
        let b = new Btn(32 + 128, height - 64, 256, 32);
        b.txt = "Effects on Environment";
        b.event = function()
        {
          state = 4;
          timer = 0;
          b.destroy();
        }
      }
    }
    
    let final_text = hs.txt;
    if (caret_timer <= 30)
      final_text += "_";
    
    push();
    fill("#0f0");
    text(final_text, 32, 32);
    pop();
    
    if (timer >= 62)
      timer = 60;
  }
}

let eoe = {
  "delay":0,
  "txt":"",
  "txts":[
    "Effects on the Environment",
    "However, because data centers are still just a bunch of\ncomputers that store and process data, it needs a lot of\nresources.",
    "Such resources may include electricity (for powering),\nwater (for cooling), and various chemical components (for\nfire suppression without damaging the components).",
    "Outside of resources, data centers also produce plenty\nof waste, such as heat and sound.",
    "These used up resources and generated waste can be\nacceptable as long as data centers aren't built to be\ntoo large, like the data center our server is hosted\nin."
  ],
  "temp_txts":[]
}

function effects_on_environment()
{
  timer++;
  if (timer == 1)
  {
    eoe.txt = "";
    eoe.temp_txts = eoe.txts.slice();
  }
  if (timer >= 60)
  {
    if (eoe.delay > 0)
      eoe.delay--;
    else if (eoe.temp_txts.length > 0)
    {
      let l = eoe.temp_txts[0];
      
      if (l.length > 0)
      {
        if (timer % 2 == 0)
        {
          caret_timer = 0;
          eoe.txt += l.substring(0,1);
          eoe.temp_txts[0] = l.substring(1);
        }
      }
      else
      {
        eoe.txt += "\n";
        eoe.delay = 30;
        eoe.temp_txts.splice(0,1);
      }
    }
    else
    {
      eoe.delay--;
      if (eoe.delay == -15)
      {
        let b = new Btn(32 + 64, height - 64, 128, 32);
        b.txt = "Bad Actors";
        b.event = function()
        {
          state = 5;
          timer = 0;
          b.destroy();
        }
      }
    }
    
    let final_text = eoe.txt;
    if (caret_timer <= 30)
      final_text += "_";
    
    push();
    fill("#0f0");
    text(final_text, 32, 32);
    pop();
    
    if (timer >= 62)
      timer = 60;
  }
}

let ba = {
  "delay":0,
  "txt":"",
  "txts":[
    "Bad Actors",
    "Unfortunately, not all those who own or run data centers care\nabout those who are affected by the output.",
    "For example, OpenAI's Stargate project is projected to spend\nhundreds of billions in construction over the next four years\nto build data centers for their AI products with no concern on\nhow it could draw away electricity and water while simultaneously\ngenerating low-frequency sound and waste heat.",
    "Using up so much electricity and water will drive up utility\ncosts for the average civilian, and it is proven that low-\nfrequency sounds cause adverse effects on the human body.",
    "Yet, some continue on despite it.",
    "Therefore, it is our mission to inform as many people as we can\nwith our database, no matter how big or small the data center is.",
    "If it negatively impacts the environment or society in any way,\nwe will be the first to know.",
    "And when we finally know, you, too, will know.",
    "The more people that know, the more people we have against the\nbad actors.",
    "And collectively, we'll be able to fight back.",
    "Thank you for checking in with our database."
  ],
  "temp_txts":[]
}

function bad_actors()
{
  timer++;
  if (timer == 1)
  {
    ba.txt = "";
    ba.temp_txts = ba.txts.slice();
  }
  if (timer >= 60)
  {
    if (ba.delay > 0)
      ba.delay--;
    else if (ba.temp_txts.length > 0)
    {
      let l = ba.temp_txts[0];
      
      if (l.length > 0)
      {
        if (timer % 2 == 0)
        {
          caret_timer = 0;
          ba.txt += l.substring(0,1);
          ba.temp_txts[0] = l.substring(1);
        }
      }
      else
      {
        ba.txt += "\n";
        ba.delay = 30;
        ba.temp_txts.splice(0,1);
      }
    }
    else
    {
      ba.delay--;
      if (ba.delay == -15)
      {
        let b = new Btn(32 + 96, height - 64, 192, 32);
        b.txt = "Return to Menu";
        b.event = function()
        {
          state = 1;
          timer = 0;
          b.destroy();
        }
      }
    }
    
    let final_text = ba.txt;
    if (caret_timer <= 30)
      final_text += "_";
    
    push();
    fill("#0f0");
    text(final_text, 32, 32);
    pop();
    
    if (timer >= 62)
      timer = 60;
  }
}

function tick_objects()
{
  tickables = tickables.filter((t) => t != null && !t.removable());
  clickables = clickables.filter((c) => c != null && !c.removable());
  
  for (let t of tickables)
    if (t.tick && typeof t.tick == "function")
      t.tick();
}

function mousePressed()
{
  for (let c of clickables)
    if (c.check_click && typeof c.check_click == "function")
      if (c.check_click())
        break;
}

function tick_scanlines()
{
  if (timer <= 60 && state == 0)
    return;
  
  for (let s of scanlines)
    s.tick();
}

function draw()
{
  clear();
  caret_timer = (caret_timer + 1) % 60;
  draw_bg();
  if (state == 0)
    beginning_sequence();
  else if (state == 1)
    menu_sequence();
  else if (state == 2)
    what_we_do();
  else if (state == 3)
    home_server();
  else if (state == 4)
    effects_on_environment();
  else if (state == 5)
    bad_actors();
  tick_objects();
  tick_scanlines();
}