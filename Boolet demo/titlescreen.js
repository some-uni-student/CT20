// We're going to pretend these are invisible to the other scripts because I haven't figured out how to separate things yet
let title = {
  "showing": 0,
  "next_show": 0,
  "prev_show": 0,
  "state": 0,
  "cur_sel": 1,
  "max_sel": 2,
  "can_sel": false,
  "move_up": function()
  {
    this.cur_sel--;
    if (this.cur_sel < 1)
      this.cur_sel = this.max_sel;
  },
  "move_down": function()
  {
    this.cur_sel++;
    if (this.cur_sel > this.max_sel)
      this.cur_sel = 1;
  },
  "select": function()
  {
    // Main title screen
    if (this.showing == 0)
    {
      // Gamestart
      if (this.cur_sel == 1)
        this.next_show = this.tutorial_finished ? 23 : 22;
      // Credits (Or tutorial, if tutorial has already been finished once)
      if (this.cur_sel == 2)
        this.next_show = this.tutorial_finished ? 22 : 1;
      if (this.cur_sel == 3)
        this.next_show = 1;
    }
    else if(this.showing == 1)
    {
      this.go_back();
      return;
    }
    this.transition = 1;
    this.can_sel = false;
    this.cur_sel = 1;
  },
  "go_back": function()
  {
    if (this.showing == 0)
      return;
    this.next_show = this.prev_show;
    this.transition = 1;
    this.can_sel = false;
    this.cur_sel = 1;
  },
  "timer1": new Timer(30,true,true),
  "reset": function()
  {
    this.cur_sel = 1;
    this.can_sel = false;
    this.max_sel = 2;
    this.showing = 0;
    this.state = 0;
  }
};

function tick_title()
{
  // Some initialization
  if (title.state == 0)
  {
    if (ply)
      ply.destroy();
    
    title.timer1.reset();
    title.tutorial_finished = getItem("tutorial_finished");
    
    title.sprites = {
      "icon": new Sprite(imgs.title.icon.url,imgs.title.icon.w,imgs.title.icon.h),
      "bg": new Sprite(imgs.title.bg.url,imgs.title.bg.w,imgs.title.bg.h)
    }
    
    title.sprites.icon.scale_x = 0.75;
    title.sprites.icon.scale_y = 0.75;
    
    title.state = 1;
    title.bg_y = height;
    title.timer = 0;
    title.icon_rotate = 22.22;
    
    title.ply_x_offset = width;
    
    title.op_pos = [
      {x:width - 100,y:height / 2},
      {x:width - 100,y:height / 2 + 50},
      {x:width - 100,y:height / 2 + 100},
      {x:width - 100,y:height / 2 + 150},
      {x:width - 100,y:height / 2 + 200},
      {x:width - 100,y:height / 2 + 250}
    ];
    title.op_offset = {x:0,y:0};
    
    title.transition = 0;
  }
  else if (title.state == 1)
  {
    if (title.bg_y <= 48)
    {
      ply = ply || new Player(-30,height / 2 + 50);
      ply.set_x(127 - title.ply_x_offset);
      title.ply_x_offset *= 0.9752;
      if (title.ply_x_offset < 10)
        ply.play_anim("idle");
    }
    
    // Animate the BG sliding in
    if (title.bg_y > 1)
    {
      title.sprites.bg.draw(width / 2, height / 2 + title.bg_y);
      title.bg_y *= 0.9752;
    }
    else
    {
      title.sprites.bg.draw(width / 2, height / 2);
      
      // There's probably a better way of going about this
      // But I'm not doing it because I don't wanna and I *LAZY*
      let txt = "";
      title.timer++;
      
      if (title.timer <= 5)
        txt = "P";
      else if (title.timer <= 10)
        txt = "PR";
      else if (title.timer <= 15)
        txt = "PRO";
      else if (title.timer <= 20)
        txt = "PROJ";
      else if (title.timer <= 25)
        txt = "PROJE";
      else if (title.timer <= 30)
        txt = "PROJEK";
      else if (title.timer <= 35)
        txt = "PROJEKT";
      else if (title.timer <= 40)
        txt = "PROJEKT C";
      else if (title.timer <= 45)
        txt = "PROJEKT CH";
      else if (title.timer <= 50)
        txt = "PROJEKT CHI";
      else if (title.timer <= 55)
        txt = "PROJEKT CHIM";
      else if (title.timer <= 60)
        txt = "PROJEKT CHIME";
      else if (title.timer <= 65)
        txt = "PROJEKT CHIMER";
      else
        txt = "PROJEKT CHIMERA";
      
      let icon = title.sprites.icon;
      // Icon fades in
      icon.tint[3] = title.timer / 30 * 255;
      
      // Fnuuy tilt
      if (title.timer >= 45)
      {
        if (title.icon_rotate > 0.01)
        {
          icon.rotation = 22.22 - title.icon_rotate;
          title.icon_rotate *= 0.952;
        }
        else
          icon.rotation = 22.22;
      }
      
      // Actually drawing stuff to the screen
      icon.draw(width * 0.375, 125);
      show_text(txt, width / 3, 155, fonts.xlo, 60, [255,255,255,60], CENTER);
      show_text(txt, width * 0.375, 150, fonts.ts, 50, [255,255,255,255], CENTER);
      
      if (title.showing == 0)
      {
        title.max_sel = title.tutorial_finished ? 3 : 2;
        // Menu options
        if (title.timer >= 90)
          show_text("Start!", title.op_pos[0].x + title.op_offset.x, title.op_pos[0].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        if (title.timer >= 100)
        {
          let txt = title.tutorial_finished ? "Tutorial!" : "Credits!";
          show_text(txt, title.op_pos[1].x + title.op_offset.x, title.op_pos[1].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        }
        if (title.timer >= 110 && title.tutorial_finished)
        {
          show_text("Credits!", title.op_pos[2].x + title.op_offset.x, title.op_pos[2].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        }
      }
      else if (title.showing == 1)
      {
        title.max_sel = 1;
        // Credits!
        if (title.timer >= 70)
          show_text("Fonts - LJ Design Studios,", title.op_pos[0].x + title.op_offset.x, title.op_pos[0].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        if (title.timer >= 80)
          show_text("Giedi Prime, NdUSB", title.op_pos[1].x + title.op_offset.x, title.op_pos[1].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        if (title.timer >= 90)
          show_text("Graphics - Pixabay, NdUSB", title.op_pos[2].x + title.op_offset.x, title.op_pos[2].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        if (title.timer >= 100)
          show_text("Sounds - Pixabay, NdUSB", title.op_pos[3].x + title.op_offset.x, title.op_pos[3].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        if (title.timer >= 110)
          show_text("Music - Dova-Syndrome", title.op_pos[4].x + title.op_offset.x, title.op_pos[4].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
        if (title.timer >= 120)
          show_text("Back", title.op_pos[5].x + title.op_offset.x, title.op_pos[5].y + title.op_offset.y, fonts.ts, 30, [255,255,255,255], RIGHT);
      }
      
      // Transitioning screens
      if (title.transition >= 1)
      {
        title.transition++;
        title.op_offset.y = title.op_offset.y + title.transition;
        
        if (title.transition >= 40)
        {
          title.transition = 0;
          title.showing = title.next_show;
          title.timer = 70;
          title.op_offset.y = 0;
          // We're actually moving onto actual gameplay, wowee
          if (title.next_show >= 22)
          {
            title.state = title.next_show - 20;
            title.timer = 60;
          }
        }
      }
      
      let ctrl = just_pressed();
      
      // Showing the cursor
      if (title.timer > 120 && title.transition <= 0)
      {
        title.can_sel = true;
        title.timer = 120;
        if (title.showing == 0)
          show_text(" <[Z]", title.op_pos[title.cur_sel - 1].x + title.op_offset.x, title.op_pos[title.cur_sel - 1].y + title.op_offset.y, fonts.ts, 30, [255,127,0,255], LEFT);
        else if (title.showing == 1)
          show_text(" <[Z]", title.op_pos[5].x + title.op_offset.x, title.op_pos[5].y + title.op_offset.y, fonts.ts, 30, [255,127,0,255], LEFT);
      }
      
      // For actually handling selection
      if (title.can_sel)
      {
        if (ctrl.up)
          title.move_up();
        if (ctrl.down)
          title.move_down();
        if (ctrl.shoot)
          title.select();
        if (ctrl.special)
          title.go_back();
      }
    }
  }
  // Gamestart!
  else if (title.state >= 2)
  {
    title.timer--;
    title.sprites.bg.draw(width / 2, height / 2);
    title.sprites.icon.tint[3] = title.timer / 60 * 255;
    title.sprites.icon.draw(width * 0.375, 125);
    show_text("PROJEKT CHIMERA", width / 3, 155, fonts.xlo, 60, [255, 255, 255, title.timer], CENTER);
    show_text("PROJEKT CHIMERA", width * 0.375, 150, fonts.ts, 50, [255, 255, 255, title.timer / 60 * 255], CENTER);
    
    if (title.timer <= 0)
    {
      gamestate = 2;
      cur_bg = bgs.night;
      game_handler.lv = title.state - 2;
    }
  }
}