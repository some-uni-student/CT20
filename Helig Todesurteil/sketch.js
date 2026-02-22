let state = 0; // Initial state of the animation
let imgs = {}; // Images for the project
let snds = {}; // Sounds for the project

let section = 0; // Which section we're on
let timer = 0; // Generic use-case ᴛimer

let cur_dialogue = ""; // For showing dialogue
let shown_dialogue = "";
let text_timer = 0;
let text_finished = true;

let bg_tick = []; // Tickable objects
let fg_tick = [];

function setup()
{
  // 4:3 my beloved
  createCanvas(800,600);
  // Seed the random values, or it will be the same every ᴛime!
  randomSeed(new Date().getTime());
  
  // Load some images
  // Cathedral BG
  imgs.cathedral = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_cathedral.png");
  
  // Our favourite Inquisitor of Heresy
  imgs.dln_warai = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dla_b21b_warai1.png");
  imgs.dln_akuwarai1 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dla_b21b_akuwarai1.png");
  imgs.dln_akuwarai2 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dla_b22b_akuwarai1.png");
  
  // Some slash effects
  imgs.slash1 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/slash1.png");
  imgs.slash2 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/slash2.png");
  imgs.slash3 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/slash3.png");
  imgs.slash4 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/slash4.png");
  imgs.slash5 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/slash5.png");
  imgs.slash6 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/slash6.png");
  imgs.slash7 = loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/slash7.png");
  
  // Load some sounds
  // Red Truths
  snds.redtruth = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_redtruth.mp3");
  
  // Appearing / disappearing
  snds.metaworld = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_metaworld.wav");
  
  // Beeg thud
  snds.beeg_thud = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/beeg_thud.mp3");
  
  // Beeg slashes
  snds.slash1 = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_heavyslash00.wav");
  snds.slash2 = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_heavyslash01.wav");
  snds.slash3 = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_heavyslash02.wav");
  
  // Umideathe
  snds.ded = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_death.mp3");
  
  // Umigone
  snds.fade = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/umi_fadeout.mp3");
  
  // Dlanor voicelines
  snds.dln_trialfinished = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_trialfinished.mp3");
  snds.dln_desu = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_desu.ogg");
  snds.dln_desudesudesu = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_desudesudesu.mp3");
  snds.dln_desudesu = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_desudesu.mp3");
  snds.dln_desu_final = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_desu_final.mp3");
  snds.dln_diethedeathe = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_geid_l00.mp3");
  snds.dln_sentencetodeathe = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_geid_l01.mp3");
  snds.dln_greatequalizerisdeathe = loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/dlanor_geid_l02.mp3");
}

// For BG effect
class BGDeath
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
  }
  
  tick()
  {
    textSize(64);
    textStyle(BOLD);
    textAlign(CENTER);
    fill("#ff0000ff");
    text("デス",this.x + random(-5,5), this.y + random(-5,5));
  }
}

// For the final fadeout
class FadeCircle
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.size = 0;
  }
  
  tick()
  {
    if (this.size < 48)
      this.size += 1;
    fill("#000000ff");
    circle(this.x,this.y,this.size);
  }
}

function tick_bg_objects()
{
  for (var t of bg_tick)
    t.tick();
}

function draw_bg()
{
  background("#000000");
  noTint();
  image(imgs.cathedral,0,0,800,600);
  tick_bg_objects();
}

function show_dialogue(words, add_onto)
{
  if (!add_onto)
    clear_dialogue();
  cur_dialogue = words;
}

function clear_dialogue()
{
  shown_dialogue = "";
  cur_dialogue = "";
}

function tick_fg_objects()
{
  for (var t of fg_tick)
    t.tick();
}

function tick_dialogue_box()
{
  if(text_timer > 0)
    text_timer--;
  
  if (cur_dialogue.length > 0 && text_timer <= 0)
  {
    // Assume there's still text to go through
    text_finished = false;
    
    // This is so the text doesn't type out too quickly
    text_timer = 3;
    
    // Tack on the text
    if (cur_dialogue[0])
      shown_dialogue += cur_dialogue[0] + " ";
    
    // Cut down the stored text
    cur_dialogue = cur_dialogue.length >= 1 ? cur_dialogue.substring(1) : "";
    
    // Text is finished typing out when the dialogue thing is empty
    if (cur_dialogue.length <= 0)
      text_finished = true;
  }
  
  if (shown_dialogue.length > 0)
  {
    // Text box
    strokeWeight(0);
    fill("#00000088");
    rect(0,height - 196,width, 196);
    
    // Actual text
    textSize(24);
    textAlign(LEFT);
    textStyle(NORMAL);
    fill("#ff0000ff");
    text(shown_dialogue, 24, height - 172, width - 48);
  }
}

function main_loop()
{
  draw_bg();
  // Black screen
  if (section == 0)
  {
    section++;
    fill(0,0,0,255);
    rect(0,0,width, height);
  }
  // Fade in
  else if (section == 1)
  {
    fill(0,0,0,255 - timer * 2);
    rect(0,0,width, height);
    if (timer >= 120)
    {
      timer = 0;
      section++;
    }
  }
  // Dlanor appearance!
  else if (section == 2)
  {
    if (timer == 1)
      snds.metaworld.play();
    tint(255,255,255,timer * 5);
    image(imgs.dln_warai,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    
    if (timer >= 180)
    {
      timer = 0;
      section++;
    }
  }
  // First line of dialogue!
  else if (section == 3)
  {
    if (timer == 1)
    {
      snds.redtruth.play();
      snds.dln_trialfinished.play();
      show_dialogue("それではこれにて、当法廷は閉廷デス。");
    }
    noTint();
    image(imgs.dln_warai,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    
    if (!text_finished)
      timer = 1;
    if (timer >= 245)
    {
      timer = 0;
      section++;
    }
  }
  // Hoo boy, here she goes
  else if (section == 4)
  {
    if (timer == 1)
    {
      snds.redtruth.play();
      snds.dln_desu.play();
      show_dialogue("デス。", true);
    }
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    
    if (!text_finished)
      timer = 1;
    if (timer >= 60)
    {
      timer = 0;
      section++;
    }
  }
  // Aaaaaand she's off her rocker
  else if (section == 5)
  {
    if (timer == 1)
    {
      snds.redtruth.play();
      snds.beeg_thud.play();
      snds.dln_desudesudesu.play();
      show_dialogue("デスデスデスデスデスデスデスデスデスデスデスデスデスデスデスデスデスデス", true);
    }
    if (timer % 3 == 0)
      bg_tick.push(new BGDeath(random() * width, random() * height));
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    
    if (!text_finished)
      timer = 1;
    if (timer >= 100)
    {
      timer = 0;
      section++;
    }
  }
  else if (section == 6)
  {
    if (timer == 1)
    {
      snds.redtruth.play();
      snds.beeg_thud.play();
      snds.dln_desudesudesu.play();
      show_dialogue("デスデスデスデスデスデスデスデスデスデスデスデスデスデスデスデスデスデス", true);
    }
    if (timer % 3 == 0)
      bg_tick.push(new BGDeath(random() * width, random() * height));
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    
    if (!text_finished)
      timer = 1;
    if (timer >= 100)
    {
      timer = 0;
      section++;
    }
  }
  else if (section == 7)
  {
    if (timer == 1)
    {
      snds.redtruth.play();
      snds.beeg_thud.play();
      snds.dln_desudesu.play();
      show_dialogue("デスデスデスデスデスデス", true);
    }
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    
    if (!text_finished)
      timer = 1;
    if (timer >= 75)
    {
      timer = 0;
      section++;
    }
  }
  else if (section == 8)
  {
    if (timer == 1)
    {
      snds.redtruth.play();
      snds.beeg_thud.play();
      snds.dln_desu_final.play();
      show_dialogue("デスデスデスデスデス、デス！", true);
    }
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    
    if (!text_finished)
      timer = 1;
    if (timer >= 120)
    {
      timer = 0;
      section++;
    }
  }
  // DIE THE DEATH!
  else if (section == 9)
  {
    if (timer == 1)
    {
      snds.slash1.play();
      snds.redtruth.play();
      snds.beeg_thud.play();
      snds.dln_diethedeathe.play();
      show_dialogue("<Die the ᴅᴇᴀᴛʜ>!\n");
    }
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    if (timer >= 85)
    {
      timer = 0;
      section++;
    }
  }
  // SENTENCE TO DEATH!
  else if (section == 10)
  {
    if (timer == 1)
    {
      snds.slash2.play();
      snds.redtruth.play();
      snds.beeg_thud.play();
      snds.dln_sentencetodeathe.play();
      show_dialogue("<Sentence to ᴅᴇᴀᴛʜ>!\n", true);
    }
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    if (timer >= 85)
    {
      timer = 0;
      section++;
    }
  }
  // GREAT EQUALIZER IS THE DEATH!
  else if (section == 11)
  {
    if (timer == 1)
    {
      snds.slash3.play();
      snds.redtruth.play();
      snds.beeg_thud.play();
      snds.dln_greatequalizerisdeathe.play();
      show_dialogue("<Great Equalizer is the ᴅᴇᴀᴛʜ>!", true);
    }
    noTint();
    image(imgs.dln_akuwarai1,width / 2 - (488.6 * 0.625), height - 359.6, 488.6,359.6);
    if (text_finished && timer >= 180)
    {
      timer = 0;
      section++;
    }
  }
  // Ruh roh
  else if (section == 12)
  {
    if (timer == 1)
      clear_dialogue();
    noTint();
    image(imgs.dln_akuwarai2,width / 2 - (412.3 * 0.4475), height - 354, 412.3,354);
    if (timer >= 60)
    {
      bg_tick = [];
      timer = 0;
      section++;
    }
  }
  // She attacc
  else if (section == 13)
  {
    noTint();
    if (timer < 20)
      image(imgs.slash2,0,0,width,height);
    else if (timer < 40)
      image(imgs.slash4,0,0,width,height);
    else if (timer < 60)
      image(imgs.slash6,0,0,width,height);
    else if (timer < 80)
      image(imgs.slash5,0,0,width,height);
    else if (timer < 100)
      image(imgs.slash3,0,0,width,height);
    else
      image(imgs.slash1,0,0,width,height);
    if (timer < 101 && (timer == 1 || timer % 20 == 0))
      snds.slash1.play();
    
    if (timer < 120)
    {
      fill(255,255,255,255 - ((timer % 20) / 20 * 255));
      rect(0,0,width,height);
    }
    if (timer > 150)
    {
      timer = 0;
      section++;
    }
  }
  // You are DED! Not beeg surprise.
  else if (section == 14)
  {
    if (timer == 1)
    {
      snds.ded.play();
      snds.slash3.play();
    }
    
    fill(255,255,255,255);
    rect(0,0,width,height);
    
    if (timer >= 120)
    {
      if (timer == 120)
        snds.fade.play();
      
      for (let i = 0; i < 3; i++)
        fg_tick.push(new FadeCircle(random() * width, random() * height));
      
      if (timer >= 180)
      {
        let v = 255 - ((timer - 180) * 3)
        fill(v, 255);
        rect(0,0,width,height);
        
        if (v <= 0)
        {
          tickables = [];
          timer = 0;
          section++;
        }
      }
    }
  }
  else
  {
    timer = -1;
    fill(0, 255);
    rect(0,0,width,height);
  }
  timer++;
  tick_dialogue_box();
  tick_fg_objects();
}

function draw()
{
  clear();
  main_loop();
}