// -----------------------------------------------------------------------------------
// Meat and potatoes of the game
// -----------------------------------------------------------------------------------

let __shake = {
  max_intensity: 0,
  intensity: 0,
  duration: 0
};

function tick_screen_shake()
{
  resetMatrix();
  if (__shake.intensity > 0 && __shake.duration > 0)
  {
    let i = __shake.intensity;
    translate(random(-i,i),random(-i,i));
  }
  
  if (__shake.intensity > 0)
    __shake.intensity -= __shake.max_intensity / __shake.duration;
  else
    __shake.intensity = 0;
  if (__shake.duration > 0)
    __shake.duration--;
  else
    __shake.duration = 0;
}

function draw_bg()
{
  background("#000000ff");
  if (cur_bg != null && cur_bg instanceof Sprite)
    cur_bg.draw(width / 2, height / 2);
  
  for (let bgo of bg_tick_objs)
    bgo.bg_tick();
  
  // Change BG color / show ᴛimestop effect
  if (ᴛime_stopped())
  {
    push();
    blendMode(DIFFERENCE);
    if (ply.hurt_freeze())
    {
      strokeWeight(0);
      fill("#ffffffff");
      rect(0,0,width,height);
    }
    else
      image(imgs.timestop_eff.url,width / 2, height / 2,width,height);
    pop();
  }
}

// Keylogging for controls
function log_keys()
{
  ply_ctrl.up = keyIsDown(UP_ARROW);
  ply_ctrl.down = keyIsDown(DOWN_ARROW);
  ply_ctrl.left = keyIsDown(LEFT_ARROW);
  ply_ctrl.right = keyIsDown(RIGHT_ARROW);
  ply_ctrl.focus = keyIsDown("Shift"); // keyIsDown(16); // Shift key
  ply_ctrl.shoot = keyIsDown('KeyZ'); // Z key
  ply_ctrl.special = keyIsDown('KeyX'); // X key
  ply_ctrl.ex_super = keyIsDown('KeyC'); // C key
  ply_ctrl.pause = keyIsDown('Escape'); // Escape key
}

function remember_keys()
{
  prv_ctrl = deep_copy(ply_ctrl);
}

function main_loop()
{
  // First thing you do is log keys for this frame
  log_keys();
  
  // Removes deletable things for garbo collection
  bg_tick_objs = bg_tick_objs.filter((t) => !t.can_remove());
  tick_objects = tick_objects.filter((t) => !t.can_remove());
  entities = entities.filter((e) => !e.can_remove());
  bullets = bullets.filter((b) => !b.can_remove());
  ply_bullets = ply_bullets.filter((b) => !b.can_remove());
  
  // Screenshake!
  tick_screen_shake();
  
  // Draw the background
  draw_bg();
  
  if (gamestate == 0)
    tick_intro();
  else if (gamestate == 1)
    tick_title();
  else if (gamestate == 2)
    tick_game_loop();
  
  // Ticks things
  for (let t of tick_objects)
    t.tick();
  // Renders textbox last so it goes over everything else
  tick_textbox();
  // And then render the HUD on top of THAT
  tick_hud();
  // For handling audio
  tick_sounds();
  // Last thing
  remember_keys();
}

function draw()
{
  clear();
  main_loop();
}