// -----------------------------------------------------------------------------------
// Setup functions
// -----------------------------------------------------------------------------------

async function load_fonts()
{
  // Fnuuy pixel font I'm using
  fonts.ts = await loadFont("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/TS.ttf"); // ZaTimou
  
  // I like having symbols I can throw around for the h*ck of it
  fonts.xlo = await loadFont("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/XidusLangOmbwha-nyrR.ttf"); // LJ Design Studios
  fonts.gold_disks = await loadFont("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/GoldenDisks-D0aE.ttf"); // Giedi Prime
}

async function load_images()
{
  // Title stuff
  imgs.title = {
    "icon": {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/projekt_chimera_clear.png"),
      w:200,
      h:200
    },
    "bg": {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/title_bg.png"),
      w:800,
      h:600
    }
  };
  
  // HUD stuff
  imgs.hud = {
    plate: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/hud_base.png"),
      w:16, h:16
    },
    life0: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/life00.png"),
      w:16, h:16
    },
    life1: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/life01.png"),
      w:16, h:16
    },
    sp_orb: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/sp00.png"),
      w:16, h:16
    }
  };
  
  // Boolets
  imgs.bullet = {
    "ply_shot":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/ply_shot.png"),
      w:64,
      h:32
    },
    "s0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_s000.png"),
      w:32,
      h:32
    },
    "s1":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_s001.png"),
      w:32,
      h:32
    },
    "s2":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_s002.png"),
      w:32,
      h:32
    },
    "m0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m000.png"),
      w:32,
      h:32
    },
    "m1":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m001.png"),
      w:32,
      h:32
    },
    "m2":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m002.png"),
      w:32,
      h:32
    },
    "m3":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m003.png"),
      w:32,
      h:32
    },
    "m4":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m004.png"),
      w:32,
      h:32
    },
    "l0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_l000.png"),
      w:32,
      h:32
    },
    "xl0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_xl000.png"),
      w:64,
      h:64
    }
  };
  
  // particles
  imgs.particle = {
    // Bullet diededing
    bullet_die:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die00.png"),
      w:32, h:32,
      nextf: 4,
      next: function() {return imgs.particle.bullet_die1;}
    },
    bullet_die1:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die01.png"),
      w:32, h:32,
      nextf: 4,
      next: function() {return imgs.particle.bullet_die2;}
    },
    bullet_die2:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die02.png"),
      w:32, h:32,
      nextf: 4,
      next: function() {return imgs.particle.bullet_die3;}
    },
    bullet_die3:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die03.png"),
      w:32, h:32,
      nextf: 4,
      next: function() {return imgs.particle.bullet_die4;}
    },
    bullet_die4:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die04.png"),
      w:32, h:32,
      nextf: 4,
      next: function() {return imgs.particle.bullet_die5;}
    },
    bullet_die5:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die05.png"),
      w:32, h:32,
      nextf: 4
    },
    // Graze particle
    graze:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/graze00.png"),
      w:32, h:32,
      nextf: 15
    },
    // Slash effect for Lilian's EX Super
    slash: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash00.png"),
      w:256, h:256,
      nextf: 1,
      next: function() {return imgs.particle.slash1;}
    },
    slash1: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash01.png"),
      w:256, h:256,
      nextf: 1,
      next: function() {return imgs.particle.slash2;}
    },
    slash2: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash02.png"),
      w:256, h:256,
      nextf: 1,
      next: function() {return imgs.particle.slash3;}
    },
    slash3: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash03.png"),
      w:256, h:256,
      nextf: 2,
      next: function() {return imgs.particle.slash4;}
    },
    slash4: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash04.png"),
      w:256, h:256,
      nextf: 3,
      next: function() {return imgs.particle.slash5;}
    },
    slash5: {
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash05.png"),
      w:256, h:256,
      nextf: 4
    },
    // Special attack!
    special:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special00.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special1;}
    },
    special1:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special01.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special2;}
    },
    special2:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special02.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special3;}
    },
    special3:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special03.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special4;}
    },
    special4:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special04.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special5;}
    },
    special5:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special05.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special6;}
    },
    special6:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special06.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special7;}
    },
    special7:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special07.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special8;}
    },
    special8:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special08.png"),
      w:96, h:96,
      nextf: 3,
      next: function() {return imgs.particle.special9;}
    },
    special9:{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special09.png"),
      w:96, h:96,
      nextf: 3
    }
  };
  
  // Our player character
  // (Her name is Lilian)
  imgs.ply = {
    "idle0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/idle00.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.idle1;},
      nextf: 4
    },
    "idle1":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/idle01.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.idle0;},
      nextf: 4
    },
    "forward0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/forward00.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.forward1;},
      nextf: 4
    },
    "forward1":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/forward01.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.forward0;},
      nextf: 4
    },
    "back0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/back00.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.back1;},
      nextf: 4
    },
    "back1":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/back01.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.back0;},
      nextf: 4
    },
    "hurt0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/hurt.png"),
      w:96,
      h:96
    },
    "pose0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/pose00.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.pose1;},
      nextf: 4
    },
    "pose1":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/pose01.png"),
      w:96,
      h:96,
      next: function() {return imgs.ply.pose0;},
      nextf: 4
    }
  };
  
  // Enemies
  imgs.enem = {
    // Maria
    maria:{
      idle0:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/maria/idle00.png"),
        w:96,
        h:96,
        next: function() {return imgs.enem.maria.idle1},
        nextf: 4
      },
      idle1:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/maria/idle01.png"),
        w:96,
        h:96,
        next: function() {return imgs.enem.maria.idle0},
        nextf: 4
      }
    },
    
    // Claire
    claire: {
      idle0:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/claire/idle00.png"),
        w:96,
        h:96,
        next: function() {return imgs.enem.claire.idle1},
        nextf: 4
      },
      idle1:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/claire/idle01.png"),
        w:96,
        h:96,
        next: function() {return imgs.enem.claire.idle0},
        nextf: 4
      },
      hurt0:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/claire/hurt00.png"),
        w:96,
        h:96
      }
    },
    
    // Common enemies
    basic_a: {
      idle0: {
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_a00.png"),
        w:64,
        h:64,
        next: function() {return imgs.enem.basic_a.idle1},
        nextf: 8
      },
      idle1: {
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_a01.png"),
        w:64,
        h:64,
        next: function() {return imgs.enem.basic_a.idle0},
        nextf: 8
      }
    },
    
    basic_b: {
      idle0: {
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_b00.png"),
        w:64,
        h:64,
        next: function() {return imgs.enem.basic_b.idle1},
        nextf: 8
      },
      idle1: {
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_b01.png"),
        w:64,
        h:64,
        next: function() {return imgs.enem.basic_b.idle0},
        nextf: 8
      }
    },
    
    basic_c: {
      idle0: {
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_c00.png"),
        w:64,
        h:64,
        next: function() {return imgs.enem.basic_c.idle1},
        nextf: 8
      },
      idle1: {
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_c01.png"),
        w:64,
        h:64,
        next: function() {return imgs.enem.basic_c.idle0},
        nextf: 8
      }
    },
  };
  
  imgs.cutins = {
    // Lilian
    lily:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/lily000.png"),
        w:800,
        h:300
    },
    lily_wau:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/lily001.png"),
        w:800,
        h:300
    },
    lily_eyesclosed:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/lily002.png"),
        w:800,
        h:300
    },
    
    // Maria
    maria:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria000.png"),
        w:800,
        h:300
    },
    maria_confident:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria001.png"),
        w:800,
        h:300
    },
    maria_smug:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria002.png"),
        w:800,
        h:300
    },
    maria_ohno:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria003.png"),
        w:800,
        h:300
    },
    maria_wetotallygotthis:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria004.png"),
        w:800,
        h:300
    },
    maria_panik:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria005.png"),
        w:800,
        h:300
    },
    maria_cri:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria006.png"),
        w:800,
        h:300
    },
    maria_ouch:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria007.png"),
        w:800,
        h:300
    },
    
    // Claire
    claire:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire000.png"),
        w:800,
        h:300
    },
    claire_fiteme:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire001.png"),
        w:800,
        h:300
    },
    claire_uhh:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire002.png"),
        w:800,
        h:300
    },
    claire_angy:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire003.png"),
        w:800,
        h:300
    },
    claire_seething:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire004.png"),
        w:800,
        h:300
    },
    claire_ouch:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire005.png"),
        w:800,
        h:300
    },
    claire_seethingouch:{
        url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire006.png"),
        w:800,
        h:300
    }
  };
  
  // Background objects
  imgs.bgo = {
    // Some trees for Stage 2
    "tree0":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree000.png"),
      w: 200,
      h: 300
    },
    "tree1":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree001.png"),
      w: 200,
      h: 300
    },
    "tree2":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree002.png"),
      w: 200,
      h: 300
    },
    "tree3":{
      url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree003.png"),
      w: 200,
      h: 300
    },
  };
  
  // Other misc stuff
  imgs.timestop_eff = {
    url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/misc/gears.png"),
    w:800,
    h:600
  };
}

async function load_sounds()
{
  snds.shot0 = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/shot0.ogg");
  snds.shot1 = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/shot0.ogg");
  snds.shot2 = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/shot0.ogg");
  snds.ply_shot = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/ply_shot.ogg");
  snds.graze = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/graze.ogg");
  snds.enem_die = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/enem_die.ogg");
  snds.barrier_break = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/barrier_break.ogg");
  snds.last_life = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/last_life.ogg");
  snds.death = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/death.ogg");
  snds.type = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/type.ogg");
  snds.text_adv = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/text_adv.ogg");
  snds.special = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/special.ogg");
  snds.timestop = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/timestop.ogg");
  snds.slash = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/slash.ogg");
  snds.barrier_up = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/barrier_pickup.ogg");
  snds.sp_up = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/sp_pickup.ogg");
  snds.boss_expl = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/boss_expl.ogg");
}

async function load_music()
{
  mus.stg0 = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg0.ogg");
  mus.stg1 = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg1.ogg");
  mus.stg1b = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg1b.ogg");
  mus.stg2 = await loadSound("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg2.ogg");
  
  for (let m in mus)
    mus[m].loop(true);
}

async function list_bgs()
{
  // Night background
  // It's always night lol
  // 永夜抄, even
  bgs.night = new Sprite(imgs.title.bg.url,imgs.title.bg.w,imgs.title.bg.h);
}

async function setup()
{
  // 4:3 my beloved
  createCanvas(800, 600);
  background("#000000ff");
  
  // Loading fonts
  await load_fonts();
  
  // Loading thing
  show_text("Loading...",0 , height - 11, fonts.ts, 22);
  
  // Loading image assets
  await load_images();
  
  // Loading sound assets
  await load_sounds();
  
  // Loading music assets
  await load_music();
  
  // Something something preparing background images
  list_bgs();
  
  // Seed the random values, or it will be the same every ᴛime!
  randomSeed(new Date().getTime());
  
  // HUD setup
  hud_objs.sprites = {
    plate: new Sprite(imgs.hud.plate.url,400,32),
    life0: new Sprite(imgs.hud.life0.url,16,16),
    life1: new Sprite(imgs.hud.life1.url,16,16)
  }
  
  // This way everything is centered
  imageMode(CENTER);
  // No antialiasing!
  noSmooth();
  // Hides the cursor so it doesn't get in the way
  noCursor();
}