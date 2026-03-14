let game_handler = {
  cur_level: null,
  auto_next: true,
  load_level: function(obj)
  {
    // Clears the level variables from the previous level
    lv_vars = {};
    this.cur_level = obj;
    
    // Only initializes the player from stage one forwards since Lilian's already chilling at the right place for stage zero
    if (this.lv >= 1 && ply)
    {
      this.starting_level = true;
      this.ply_move = 224;
      ply.allow_control = false;
      ply.allow_moving = false;
      ply.allow_shooting = false;
      ply.allow_specials = false;
      ply.allow_supers = false;
      ply.set_x(-96);
      ply.set_y(height / 2 + 50);
      
      // Setting the BG, if there is one
      if (this.cur_level.bg && this.cur_level.bg instanceof Sprite)
        cur_bg = this.cur_level.bg;
      else
        cur_bg = null;
    }
  },
  run_level: function()
  {
    if (ply && ply.health < 1 && this.lv <= 0)
      ply.health = 1;
    let s = this.cur_level;
    if (s[0] && s[0].main)
      s[0].main();
    else
      this.next_sequence();
  },
  next_sequence: function()
  {
    if (this.cur_level.length > 0)
    {
      this.cur_level.splice(0,1);
      // let s = this.cur_level;
      // if (s[0] && s[0].main)
      //   s[0].main();
    }
    else if (this.auto_next)
      this.cur_level = null;
  },
  ply_move: 0,
  lv: 0,
  starting_level: false
};

function tick_game_loop()
{
  
  if(paused())
    return;
  
  if (stage_clear && game_handler.cur_level)
  {
    if (!game_frozen() || ᴛime_stopped() && ply.timestop_immune)
    {
      ply.play_anim("forward");
      ply.set_xsp(ply.get_xsp() + 0.25);
    }
  }
  else
  {
    if (game_handler.auto_next && !game_handler.cur_level && game_handler.lv <= levels.length && levels[game_handler.lv])
    {
      stage_clear = false;
      game_handler.load_level(levels[game_handler.lv]());
      game_handler.lv++;
    }
  }
  
  if (game_handler.starting_level)
  {
    if (ply.get_x() < 122)
    {
      ply.play_anim("forward");
      ply.set_x(128 - game_handler.ply_move);
      game_handler.ply_move *= 0.95;
    }
    else
    {
      show_hud = true;
      ply.allow_control = true;
      ply.allow_moving = true;
      ply.allow_shooting = true;
      ply.allow_specials = true;
      ply.allow_supers = true;
      game_handler.starting_level = false;
      ply.set_x(122);
      if (ply.health <= 0)
        ply.barrier_warning = 60;
    }
  }
  else if (game_handler.cur_level)
    game_handler.run_level();
}

// lol
// function mousePressed()
// {
//   if (gamestate >= 2 && !game_frozen())
//   {
//     let b = new Bullet(mouseX, mouseY, 0,2,"s",1);
//     b.set_angle(b.get_angle_to(ply));
//   }
// }