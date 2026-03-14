function tick_hud()
{
  // Titlescreen fade out
  if (title.state >= 3 && gamestate == 1)
  {
    push();
    strokeWeight(0);
    fill(0,0,0,(60 - title.timer) / 60 * 255);
    rect(0,0,width,height);
    pop();
  }
  
  // Ignore the rest of this if the game isn't even active
  if (gamestate < 2)
  {
    game_paused = false;
    show_hud = false;
    return;
  }
  
  let ctrl = just_pressed();
  
  if (ctrl.pause)
    game_paused = !game_paused;
  
  if (!game_handler.cur_level && game_handler.lv > 0)
  {
    push();
    strokeWeight(0);
    fill(0,0,0,255);
    rect(0,0,width,height);
    pop();
  }
  
  // Player is ded
  if (!ply)
  {
    game_paused = true;
    
    if (!hud_objs.ded_timer)
      hud_objs.ded_timer = 0;
    
    if (hud_objs.ded_timer < 180)
      hud_objs.ded_timer++;
    
    let t = hud_objs.ded_timer;
    
    // Darken overlay
    push();
    stroke("#ff000088");
    strokeWeight(22);
    fill("#44000088");
    rect(0,0,width,height);
    pop();
    
    show_text("Critical\ninjuries\nsustained", 32, height / 2 - 64, fonts.xlo, 80, [255, 255, 255, min(t / 30, 1) * 80]);
    show_text("Game Over", 64, height / 2, fonts.ts, 64, [255, 255, 255, min(t / 30, 1) * 255]);
    
    if (t >= 60)
    {
      show_text(">To Title<", width - 64, height / 2, fonts.ts, 32, [255, 255, 255, min(t / 30, 1) * 255], RIGHT);
      
      if (ctrl.shoot && !hud_objs.ded_fadeout)
        hud_objs.ded_fadeout = 0;
    }
    
    if (hud_objs.ded_fadeout != null)
    {
      hud_objs.ded_fadeout++;
      
      push();
      strokeWeight(0);
      fill(0,0,0,(hud_objs.ded_fadeout / 60) * 255);
      rect(0,0,width,height);
      pop();
      
      if (hud_objs.ded_fadeout >= 90)
      {
        cur_bg = null;
        stop_music();
        title.reset();
        gamestate = 1;
        tick_objects = [];
        hud_objs.ded_timer = null;
        hud_objs.ded_fadeout = null;
      }
    }
  }
  else if (stage_clear)
  {
    game_paused = false;
    if (!hud_objs.clear_timer)
      hud_objs.clear_timer = 0;
    
    if (ply.get_x() >= width + 96)
    {
      hud_objs.clear_timer++;
      ply.set_x(width + 96);
    }
    
    let t = hud_objs.clear_timer;
    
    if (t >= 30)
    {
      show_text("Stage Clear!",width / 2, height / 2 + 16, fonts.xlo, 96, [255, 255, 255, min((t - 30) / 60, 1) * 80], CENTER);
      show_text("Stage Clear!",width / 2, height / 2, fonts.ts, 64, [174, 162, 222, min((t - 30) / 60, 1) * 255], CENTER);
    }
    
    if (t >= 150)
    {
      push();
      strokeWeight(0);
      fill(0,0,0,min((t - 150) * 2,255));
      rect(0,0,width,height);
      pop();
    }
    
    if (!focused && t > 299)
      t = 299;
    
    if (t >= 300)
    {
      stop_music();
      hud_objs.clear_timer = null;
      game_handler.cur_level = null;
    }
    return;
  }
  else if (game_paused)
  {
    // Darken overlay
    push();
    stroke("#aea2de88");
    strokeWeight(22);
    fill("#00000088");
    rect(0,0,width,height);
    pop();
    
    // Pause text
    show_text("On break!",width / 2, height / 2 + 4, fonts.xlo, 48, [255, 255, 255, 80], CENTER);
    show_text("On break!",width / 2, height / 2, fonts.ts, 32, [174, 162, 222, 255], CENTER);
    show_text("Press [Esc] to continue!",width / 2, height / 2 + 64, fonts.ts, 22, [255, 255, 255, 255], CENTER);
  }
  else if (show_hud)
  {
    // Draw SP bar
    push();
    strokeWeight(0);
    fill("#555588aa");
    rect(4,4,392, 28);
    pop();
    if (ply && ply.magic && ply.max_magic)
    {
      let ratio = ply.magic / ply.max_magic;
      push();
      strokeWeight(0);
      fill(ratio >= 1 ? "#aea2deff" : "#dea099ff");
      rect(4,4,ratio * 392, 28);
      pop();
      
      // For using specials
      if (ply.sp_burning > 0)
      {
        let ratio2 = ply.sp_burning / ply.max_magic;
        push();
        strokeWeight(0);
        fill("#ffffffff");
        rect(4,4,ratio2 * 392, 28);
        pop();
      }
    }
    
    // Draw the plate
    hud_objs.sprites.plate.draw(width / 4, 16);
    // Draw lives
    for (let i = 0; i < 8; i++)
    {
      let s = ply && !ply.is_dead() && ply.health > i ? "life1" : "life0";
      hud_objs.sprites[s].draw(8 + i * 16, 24);
    }
  }
  
  // Level fade in
  if (game_handler.starting_level)
  {
    if (hud_objs.start_timer == null)
      hud_objs.start_timer = 300;
    
    hud_objs.start_timer -= 5;
    
    push();
    strokeWeight(0);
    fill(0,0,0,hud_objs.start_timer);
    rect(0,0,width,height);
    pop();
  }
  else
    hud_objs.start_timer = null;
}