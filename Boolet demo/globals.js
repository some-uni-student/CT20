// -----------------------------------------------------------------------------------
// Some global variables and functions
// -----------------------------------------------------------------------------------

// Gotta load them in first or P5js complains about it :P

// Debug flag
let DEBUG = false;

// Game assets
let imgs = {};
let snds = {};
let mus = {};
let fonts = {};
let bgs = {};
let cur_bg = null;
let cur_mus = null;

// Current game state
// 0 - intro
// 1 - title
// 2 - gameplay
// I would've preferred to set its type to a single byte, but we can't do that here so .v'
let gamestate = 0;

// Game pausing stuff
let game_paused = false;
let dialogue_active = false;
let ᴛimestop = false;

// Stuff for HUD
let show_hud = false;
let hud_objs = {};

// Stage clear flag
let stage_clear = false;

// The actual player
let ply;

// The game objects, basically
let tick_objects = [];
// Boolet
let bullets = [];
let ply_bullets = [];
// For other checks
let entities = [];
// Background objects
let bg_tick_objs = [];

// Control stuffs
let ply_ctrl = {
  "up":false,
  "down":false,
  "left":false,
  "right":false,
  "focus":false,
  "shoot":false,
  "special":false,
  "ex_super":false,
  "pause":false
};
// Controls on the previous frame to handle one-press things
let prv_ctrl = {
  "up":false,
  "down":false,
  "left":false,
  "right":false,
  "focus":false,
  "shoot":false,
  "special":false,
  "ex_super":false,
  "pause":false
};

let ___uid = Number.MIN_SAFE_INTEGER;

function generate_uid()
{
  ___uid++;
  if (___uid >= Number.MAX_SAFE_INTEGER)
    ___uid = Number.MIN_SAFE_INTEGER;
  return millis() + ":" + ___uid;
}

function ᴛime_stopped()
{
  for (let e of entities)
    if (e.stopping_time())
      return true;
  return ᴛimestop || ply && ply.hurt_freeze();
}

function paused()
{
  return !focused && gamestate > 1 || game_paused;
}

function game_frozen()
{
  return ᴛime_stopped() || paused() || dialogue_active;
}

// Shaking the screen
function shake_screen(intensity, duration)
{
  __shake.max_intensity = intensity;
  __shake.intensity = intensity;
  __shake.duration = duration;
}

// Neat thing for putting all the text stuff in one function
function show_text(txt, pos_x, pos_y, font, size, c, align, w, h)
{
  push();
  if (c)
    fill(c[0],c[1],c[2],c[3]);
  else
    fill("#ffffffff");
  textStyle(NORMAL);
  textSize(size ? size : 12);
  textFont(font ? font : 'Arial');
  textAlign(align ? align : LEFT);
  if (w != null && h != null)
    text(txt,pos_x,pos_y,w,h);
  else
    text(txt,pos_x,pos_y);
  pop();
}

function clear_bullets()
{
  for (let b of bullets)
    b.destroy();
}

function clear_ply_bullets()
{
  for (let b of ply_bullets)
    b.destroy();
}

function clear_enemies(ignore_invin, clear_boss)
{
  for (let e of entities)
    if (e != ply && (clear_boss || !(e instanceof Boss)))
      e.die(ignore_invin);
}

// To get buttons pressed on the current frame
function just_pressed()
{
  return {
    "up":ply_ctrl.up && !prv_ctrl.up,
    "down":ply_ctrl.down && !prv_ctrl.down,
    "left":ply_ctrl.left && !prv_ctrl.left,
    "right":ply_ctrl.right && !prv_ctrl.right,
    "focus":ply_ctrl.focus && !prv_ctrl.focus,
    "shoot":ply_ctrl.shoot && !prv_ctrl.shoot,
    "special":ply_ctrl.special && !prv_ctrl.special,
    "ex_super":ply_ctrl.ex_super && !prv_ctrl.ex_super,
    "pause":ply_ctrl.pause && !prv_ctrl.pause
  };
}

// Deep copies
function deep_copy(obj)
{
  if (!obj)
    return null;
  let new_copy = {};
  // Well it's not a container, so
  if (typeof obj != "object")
    return obj;
  for (let k in obj)
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
  return new_copy;
}