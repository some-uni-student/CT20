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

function create_resource(url, id, options, is_snd)
{
  let obj = {};
  obj.p = new Promise(async function(ye,non)
  {
    let s = !!is_snd ? await loadSound(url) : await loadImage(url);
    ye(s);
  });
  obj.id = id;
  obj.type = is_snd ? "sound" : "image";
  obj.options = options;
  return obj;
}

async function load_resources(resources)
{
  let promises = [];
  let ids = [];
  
  let container = {};
  
  for (let r of resources)
  {
    promises.push(r.p);
    ids.push(r.id);
  }
  
  let loaded = await Promise.all(promises);
  
  for (let i = 0; i < ids.length; i++)
  {
    if (resources[i].type != "sound")
      container[ids[i]] = {url: loaded[i]};
    else
      container[ids[i]] = loaded[i];
    
    if (resources[i].options)
    {
      for (let k in resources[i].options)
        container[ids[i]][k] = resources[i].options[k];
    }
  }
  
  return container;
}

async function load_images()
{
  // Title stuff
  let title_imgs = [];
  
  title_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/projekt_chimera_clear.png", "icon",
  {
    w: 200, h: 200
  }));
  title_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/title_bg.png", "bg",
  {
    w: 800, h: 600
  }));
  
  imgs.title = await load_resources(title_imgs);
  
  // HUD stuff
  let hud_imgs = [];
  
  hud_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/hud_base.png", "plate"));
  hud_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/life00.png", "life0"));
  hud_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/life01.png", "life1",
  {
    w:16, h:16
  }));
  hud_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/hud/sp00.png", "sp_orb",
  {
    w:16, h:16
  }));
  
  imgs.hud = await load_resources(hud_imgs);
  
  // Boolets
  let bullet_imgs = [];
  
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/ply_shot.png","ply_shot",
  {
    w:64, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_s000.png","s0",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_s001.png","s1",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_s002.png","s2",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m000.png","m0",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m001.png","m1",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m002.png","m2",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m003.png","m3",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_m004.png","m4",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_l000.png","l0",
  {
    w:32, h:32
  }));
  bullet_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bullets/bullet_xl000.png","xl0",
  {
    w:64, h:64
  }));
  
  imgs.bullet = await load_resources(bullet_imgs);
  
  // particles
  let particle_imgs = [];
  
  // Bullet diededing
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die00.png", "bullet_die",
  {
    w:32, h:32, nextf: 4,
    next: function() {return imgs.particle.bullet_die1;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die01.png", "bullet_die1",
  {
    w:32, h:32, nextf: 4,
    next: function() {return imgs.particle.bullet_die2;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die02.png", "bullet_die2",
  {
    w:32, h:32, nextf: 4,
    next: function() {return imgs.particle.bullet_die3;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die03.png", "bullet_die3",
  {
    w:32, h:32, nextf: 4,
    next: function() {return imgs.particle.bullet_die4;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die04.png", "bullet_die4",
  {
    w:32, h:32, nextf: 4,
    next: function() {return imgs.particle.bullet_die5;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/bullet_die05.png", "bullet_die5",
  {
    w:32, h:32, nextf: 4
  }));
  
  // Graze particle
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/graze00.png", "graze",
  {
    w:32, h:32, nextf: 15
  }));
  
  // Slashes for Lilian's EX Super
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash00.png", "slash",
  {
    w:256, h:256, nextf: 1,
    next: function() {return imgs.particle.slash1;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash01.png", "slash1",
  {
    w:256, h:256, nextf: 1,
    next: function() {return imgs.particle.slash2;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash02.png", "slash2",
  {
    w:256, h:256, nextf: 1,
    next: function() {return imgs.particle.slash3;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash03.png", "slash3",
  {
    w:256, h:256, nextf: 2,
    next: function() {return imgs.particle.slash4;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash04.png", "slash4",
  {
    w:256, h:256, nextf: 3,
    next: function() {return imgs.particle.slash5;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/slash05.png", "slash5",
  {
    w:256, h:256, nextf: 4
  }));
  
  // Special attack wave!!
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special00.png", "special",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special1;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special01.png", "special1",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special2;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special02.png", "special2",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special3;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special03.png", "special3",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special4;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special04.png", "special4",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special5;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special05.png", "special5",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special6;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special06.png", "special6",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special7;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special07.png", "special7",
  {
    w:96, h:96, nextf: 3,
    next: function() {return imgs.particle.special8;}
  }));
  particle_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/particle/special09.png", "special9",
  {
    w:96, h:96, nextf: 3
  }));
  
  imgs.particle = await load_resources(particle_imgs);
  
  // Our player character
  // (Her name is Lilian)
  let ply_imgs = [];
  
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/idle00.png", "idle0", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.idle1;}
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/idle01.png", "idle1", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.idle0;}
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/forward00.png", "forward0", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.forward1;}
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/forward01.png", "forward1", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.forward0;}
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/back00.png", "back0", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.back1;}
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/back01.png", "back1", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.back0;}
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/hurt.png", "hurt0", {
    w:96, h:96
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/pose00.png", "pose0", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.pose1;}
  }));
  ply_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/ply/pose01.png", "pose1", {
    w:96, h:96, nextf:4,
    next: function() {return imgs.ply.pose0;}
  }));
  
  imgs.ply = await load_resources(ply_imgs);
  
  // Enemies
  imgs.enem = {};
  
  // Maria
  let maria_imgs = [];
  maria_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/maria/idle00.png", "idle0",
  {
    w:96, h:96, nextf:4,
    next: function() {return imgs.enem.maria.idle1;}
  }));
  maria_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/maria/idle01.png", "idle1",
  {
    w:96, h:96, nextf:4,
    next: function() {return imgs.enem.maria.idle0;}
  }));
  
  imgs.enem.maria = await load_resources(maria_imgs);
  
  // Claire
  let claire_imgs = [];
  claire_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/claire/idle00.png", "idle0",
  {
    w:96, h:96, nextf:4,
    next: function() {return imgs.enem.claire.idle1;}
  }));
  claire_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/claire/idle01.png", "idle1",
  {
    w:96, h:96, nextf:4,
    next: function() {return imgs.enem.claire.idle0;}
  }));
  claire_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/claire/hurt00.png", "hurt0",
  {
    w:96, h:96
  }));
  claire_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/claire/atk00.png", "atk0",
  {
    w:96, h:96
  }));
  
  imgs.enem.claire = await load_resources(claire_imgs);
  
  // Azael
  let azael_imgs = [];
  azael_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/azael/idle00.png", "idle0",
  {
    w:96, h:96, nextf:4,
    next: function() {return imgs.enem.azael.idle1;}
  }));
  azael_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/azael/idle01.png", "idle1",
  {
    w:96, h:96, nextf:4,
    next: function() {return imgs.enem.azael.idle0;}
  }));
  azael_imgs.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/azael/hurt00.png", "hurt0",
  {
    w:96, h:96
  }));
  
  imgs.enem.azael = await load_resources(azael_imgs);
  
  // Common enemies
  let e_basic_a = [];
  e_basic_a.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_a00.png", "idle0",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_a.idle1;}
  }));
  e_basic_a.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_a01.png", "idle1",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_a.idle0;}
  }));
  
  imgs.enem.basic_a = await load_resources(e_basic_a);
  
  let e_basic_b = [];
  e_basic_b.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_b00.png", "idle0",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_b.idle1;}
  }));
  e_basic_b.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_b01.png", "idle1",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_b.idle0;}
  }));
  
  imgs.enem.basic_b = await load_resources(e_basic_b);
  
  let e_basic_c = [];
  e_basic_c.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_c00.png", "idle0",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_c.idle1;}
  }));
  e_basic_c.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_c01.png", "idle1",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_c.idle0;}
  }));
  
  imgs.enem.basic_c = await load_resources(e_basic_c);
  
  let e_basic_d = [];
  e_basic_d.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_d00.png", "idle0",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_d.idle1;}
  }));
  e_basic_d.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_d01.png", "idle1",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_d.idle0;}
  }));
  
  imgs.enem.basic_d = await load_resources(e_basic_d);
  
  let e_basic_e = [];
  e_basic_e.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_e00.png", "idle0",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_e.idle1;}
  }));
  e_basic_e.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/enem_e01.png", "idle1",
  {
    w:64, h:64, nextf:8,
    next: function() {return imgs.enem.basic_e.idle0;}
  }));
  
  imgs.enem.basic_e = await load_resources(e_basic_e);
  
  // Familiars
  imgs.enem.familiar_a = await load_resources([
    create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/familiar_a00.png", "idle0",
    {
      w:64, h:64
    })
  ]);
  imgs.enem.familiar_b = await load_resources([
    create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/familiar_b00.png", "idle0",
    {
      w:64, h:64
    })
  ]);
  imgs.enem.familiar_c = await load_resources([
    create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/enem/common/familiar_c00.png", "idle0",
    {
      w:64, h:64
    })
  ]);
  
  // Portraits
  let portraits = [];
  
  // Lilian
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/lily000.png", "lily",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/lily001.png", "lily_wau",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/lily002.png", "lily_eyesclosed",
  {
    w:800, h:300
  }));
  
  // Maria
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria000.png", "maria",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria001.png", "maria_confident",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria002.png", "maria_smug",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria003.png", "maria_ohno",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria004.png", "maria_wetotallygotthis",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria005.png", "maria_panik",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria006.png", "maria_cri",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/maria007.png", "maria_ouch",
  {
    w:800, h:300
  }));
  
  // Claire
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire000.png", "claire",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire001.png", "claire_fiteme",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire002.png", "claire_uhh",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire003.png", "claire_angy",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire004.png", "claire_seething",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire005.png", "claire_ouch",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/claire006.png", "claire_seethingouch",
  {
    w:800, h:300
  }));
  
  // Azael
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael000.png", "azael",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael001.png", "azael_stahp",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael002.png", "azael_o",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael003.png", "azael_uhm",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael004.png", "azael_angy",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael005.png", "azael_awawa",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael006.png", "azael_ouch",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael007.png", "azael_cri_ouch",
  {
    w:800, h:300
  }));
  portraits.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/cutin/azael008.png", "azael_criii_ouch",
  {
    w:800, h:300
  }));
  
  
  imgs.cutins = await load_resources(portraits);
  
  // Background objects
  let bgos = [];
  
  // Some treest for Stage 2
  bgos.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/trees000.png", "trees0",
  {
    w:1600, h:300
  }));
  bgos.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/trees001.png", "trees1",
  {
    w:1600, h:300
  }));
  bgos.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/trees002.png", "trees2",
  {
    w:1600, h:300
  }));
  bgos.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/trees003.png", "trees3",
  {
    w:1600, h:300
  }));
  bgos.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/box000.png", "bawx",
  {
    w:600, h:800
  }));
  
  imgs.bgo = await load_resources(bgos)
  
  // Background objects
  // imgs.bgo = {
  //   // Some trees for Stage 2
  //   "tree0":{
  //     url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree000.png"),
  //     w: 200,
  //     h: 300
  //   },
  //   "tree1":{
  //     url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree001.png"),
  //     w: 200,
  //     h: 300
  //   },
  //   "tree2":{
  //     url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree002.png"),
  //     w: 200,
  //     h: 300
  //   },
  //   "tree3":{
  //     url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/bgos/tree003.png"),
  //     w: 200,
  //     h: 300
  //   },
  // };
  
  // Other misc stuff
  imgs.timestop_eff = {
    url: await loadImage("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/misc/gears.png"),
    w:800,
    h:600
  };
}

async function load_sounds()
{
  
  let s_r = [];
  
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/shot0.ogg", "shot0", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/shot1.ogg", "shot1", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/shot2.ogg", "shot2", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/ping0.ogg", "ping0", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/ping1.ogg", "ping1", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/ping2.ogg", "ping2", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/familiar.ogg", "familiar", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/ply_shot.ogg", "ply_shot", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/graze.ogg", "graze", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/enem_die.ogg", "enem_die", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/barrier_break.ogg", "barrier_break", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/last_life.ogg", "last_life", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/death.ogg", "death", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/type.ogg", "type", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/text_adv.ogg", "text_adv", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/special.ogg", "special", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/timestop.ogg", "timestop", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/slash.ogg", "slash", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/barrier_pickup.ogg", "barrier_up", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/sp_pickup.ogg", "sp_up", null, true));
  s_r.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/sound/boss_expl.ogg", "boss_expl", null, true));
  
  snds = await load_resources(s_r);
}

async function load_music()
{
  let m = [];
  
  m.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg0.ogg", "stg0", null, true));
  m.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg1.ogg", "stg1", null, true));
  m.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg1b.ogg", "stg1b", null, true));
  m.push(create_resource("https://raw.githubusercontent.com/some-uni-student/CT20/refs/heads/main/p5js_assets/project3/music/stg2.ogg", "stg2", null, true));
  
  mus = await load_resources(m);
  
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

p5.disableFriendlyErrors = true;

async function setup()
{
  print("setting up canvas");
  // 4:3 my beloved
  createCanvas(800, 600);
  background("#000000ff");
  // Loading fonts
  print("loading fonts");
  await load_fonts();
  
  // Loading thing
  show_text("Loading...",0 , height - 11, fonts.ts, 22);
  
  print("loading images");
  // Loading image assets
  await load_images();
  
  print("loading sounds");
  // Loading sound assets
  await load_sounds();
  
  print("loading music");
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
  
  // Controls cheat sheet because some people have never played Touhou-likes before
  if (getItem("tutorial_finished"))
  {
    create_ctrl_cheatsheet_btn();
  }
}

let ctrl_element
let cheatsheet_btn

function create_ctrl_cheatsheet_btn()
{
  if (cheatsheet_btn != null)
    return;
  
  cheatsheet_btn = createButton("Controls cheat sheet!");
  cheatsheet_btn.position(16,height + 16);
  cheatsheet_btn.mousePressed(showhide_ctrl);
  
  ctrl_element = createDiv("<p></p>");
  ctrl_element.position(16, height + 32);
}

function showhide_ctrl()
{
  if (ctrl_element.html() == "<p></p>")
    ctrl_element.html("<p style=\"color:#aea2de;\">[↑][←][↓][→] - Move</p><p style=\"color:#aea2de;\">[shift] Focus :: [Z] - Fire :: Hold [X] - Skill :: [C] - EX Super</p><p style=\"color:#aea2de;\">[ctrl] - Skip dialogue</p><p style=\"color:#aea2de;\">[esc] - Pause</p>");
  else
    ctrl_element.html("<p></p>");
}