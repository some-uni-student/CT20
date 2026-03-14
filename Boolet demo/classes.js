// -----------------------------------------------------------------------------------
// The classes
// -----------------------------------------------------------------------------------

// Basic ᴛimer thing
class Timer
{
  #limit;
  #ᴛimer;
  #deletable;
  #ignore_pause;
  #ignore_ᴛimestop;
  constructor(limit, ignore_ᴛimestop, ignore_pause)
  {
    this.#limit = limit;
    this.#ᴛimer = limit;
    this.#deletable = false;
    this.#ignore_pause = ignore_pause;
    this.#ignore_ᴛimestop = ignore_ᴛimestop;
    tick_objects.push(this);
  }
  
  // Force finish
  finish() {this.#ᴛimer = 0;}
  
  finished() {return this.#ᴛimer <= 0;}
  
  cur_val() {return this.#ᴛimer;}
  
  reset() {this.#ᴛimer = this.#limit;}
  
  set_limit(lim) {this.#limit = abs(lim);}
  
  destroy() {this.#deletable = true;}
  
  can_remove() {return this.#deletable;}
  
  tick()
  {
    if(this.#deletable)
      return;
    if (this.#ᴛimer > 0 && (!ᴛimestop || this.#ignore_ᴛimestop) && (!paused() || this.#ignore_pause))
      this.#ᴛimer--;
  }
}

// For images and stuff
class Sprite
{
  #img;
  #w;
  #h;
  #scale_x;
  #scale_y;
  #visible;
  #rotation;
  #tint;
  constructor(url,w,h)
  {
    this.#img = (typeof url) == "string" ? loadImage(url) : url;
    if (this.#img)
    {
      this.#w = w;
      this.#h = h;
      this.#scale_x = 1;
      this.#scale_y = 1;
      this.#visible = true;
      this.#rotation = 0;
      this.#tint = [255,255,255,255];
      return this;
    }
    else
      return null;
  }
  
  get scale_x() {return this.#scale_x;}
  set scale_x(s) {this.#scale_x = s * 1;}
  get scale_y() {return this.#scale_y;}
  set scale_y(s) {this.#scale_y = s * 1;}
  
  get rotation() {return this.#rotation;}
  set rotation(r) {this.#rotation = r % 360;}
  
  get visible() {return this.#visible;}
  set visible(yn) {this.#visible = yn;}
  
  get tint() {return this.#tint;}
  
  draw(x,y)
  {
    if (!this.#visible || !this.#img)
      return;
    let temp_w = this.#w * this.#scale_x;
    let temp_h = this.#h * this.#scale_y;
    // Make sure we're only affecting the current image and no one else
    push();
    translate(x,y);
    // Rotate CCW
    angleMode(RADIANS);
    rotate(-this.#rotation * PI / 180);
    tint(this.#tint[0],this.#tint[1],this.#tint[2],this.#tint[3]);
    image(this.#img,0,0, temp_w, temp_h);
    pop();
  }
}

// Hitboxes and stuff for collision
class HitBox
{
  #parent;
  #r;
  #type;
  // Oopsii, all circles
  // Mainly because circles are a lot easier to deal with than squares, since we don't have to worry about rotation
  // And hoo boy, rotated rectangles are its own can of worms
  constructor(parent,r,type)
  {
    // Hitboxes always needs to be attached to SOMEthing
    if (parent instanceof TickableObject)
    {
      this.#parent = parent;
      this.#r = r * 1;
      // Hitbox size limit
      if (this.#r > 128)
          this.#r = 128;
      this.#type = type || "hit";
      return this;
    }
    else
      return null;
  }
  
  // X and Y are actually offsets from the center of the object
  get_x() {return this.#parent.get_x();}
  get_y() {return this.#parent.get_y();}
  
  get_r() {return this.#r;}
  set_r(r) {this.#r = r;}
  
  get_type() {return this.#type;}
  set_type(t) {this.#type = t;}
  
  is_touching(other, mask)
  {
    if (other instanceof HitBox && (!mask || mask && other.get_type() == mask || other.get_type() != this.#type))
    {
      let dx = this.get_x() - other.get_x();
      let dy = this.get_y() - other.get_y();
      let d = dx * dx + dy * dy;
      // Caluculating with squared distance to increase efficiency
      return d <= sq(this.#r + other.get_r());
    }
    return false;
  }
}

class TickableObject
{
  constructor(x,y)
  {
    this.x = 1 * x;
    this.y = 1 * y;
    this.xsp = 0;
    this.ysp = 0;
    this.no_tick = false;
    this.deletable = false;
    this.ignore_ᴛimestop = false;
    this.uid = generate_uid();
    this.tick_funcs = [];
    tick_objects.push(this);
  }
  
  // Getters and setters for some basic stuff
  get_x() {return this.x;}
  get_y() {return this.y;}
  set_x(x) {this.x = x;}
  set_y(y) {this.y = y;}
  
  get_xsp() {return this.xsp;}
  get_ysp() {return this.ysp;}
  set_xsp(xsp) {this.xsp = xsp;}
  set_ysp(ysp) {this.ysp = ysp;}
  
  get_no_tick() {return this.no_tick;}
  set_no_tick(yn) {this.no_tick = yn;}
  
  // For when things go well offscreen
  can_remove() {return this.deletable;}
  
  // For forced removal
  destroy() {this.deletable = true;}
  
  // For functions to do things
  add_tick_func(f)
  {
    if ((typeof f) == "function")
      this.tick_funcs.push(f);
  }
  clear_tick_funcs()
  {
    this.tick_funcs = [];
  }
  run_tick_funcs()
  {
    for (let f of this.tick_funcs)
      if ((typeof f) == "function")
        f();
  }
  
  // Distance to any other tickable object
  get_distance(other)
  {
    if (other instanceof TickableObject)
    {
      let dx = this.x - other.get_x();
      let dy = this.y - other.get_y();
      return sqrt(dx * dx + dy * dy);
    }
    return Infinity;
  }
  
  // I love trig
  get_angle_to(other)
  {
    if (other instanceof TickableObject)
    {
      let dx = this.x - other.get_x();
      let dy = this.y - other.get_y();
      return (this.x > other.get_x() ? 180 : 0) + atan(-dy / dx) / PI * 180;
    }
    return 180;
  }
  
  get timestop_immune() {return this.ignore_ᴛimestop;}
  set timestop_immune(yn) {this.ignore_ᴛimestop = yn;}
  
  can_tick()
  {
    return !this.deletable && !paused() && !dialogue_active && (!ᴛime_stopped() || this.timestop_immune) && !this.no_tick;
  }
  
  // Doesn't do much by default (lie)
  tick()
  {
    if (!this.can_tick())
      return;
    this.run_tick_funcs();
    this.x += this.xsp;
    this.y += this.ysp;
    
    // Checks removability
    if (!(this instanceof Entity && !this.bounds_delete) && (this.x < -256 || this.y < -256 || this.x >= width + 256 || this.y >= height + 256))
    {
      this.no_tick = true;
      this.deletable = true;
    }
  }
}

class Particle extends TickableObject
{
  constructor(x,y,sprite_data,rotation)
  {
    super(x,y);
    if (!sprite_data || !sprite_data.url || !sprite_data.w || !sprite_data.h)
      return null;
    this.s_data = sprite_data;
    this.sprite = new Sprite(this.s_data.url,this.s_data.w,this.s_data.h);
    if (!this.sprite)
      return null;
    this.frametimer = this.s_data.nextf || 0;
    this._tint = [255,255,255,255];
    this._scale = 1;
    this._rotation = rotation || 0;
    return this;
  }
  
  get tint() {return this._tint;}
  set tint(t) {this._tint = t;}
  
  get scale() {return this._scale;}
  set scale(s) {this._scale = 1 * s;}
  
  get rotation() {return this._rotation;}
  set rotation(r) {this._rotation = r * 1;}
  
  get_sprite() {return this.cur_sprite;}
  
  tick_anim()
  {
    if (!this.sprite && this.s_data)
      this.sprite = new Sprite(this.s_data.url,this.s_data.w,this.s_data.h);
    
    if (!this.deletable && this.sprite instanceof Sprite)
    {
      this.sprite.tint[0] = this._tint[0];
      this.sprite.tint[1] = this._tint[1];
      this.sprite.tint[2] = this._tint[2];
      this.sprite.tint[3] = this._tint[3];
      this.sprite.scale_x = this._scale;
      this.sprite.scale_y = this._scale;
      this.sprite.rotation = this._rotation;
      this.sprite.draw(this.x,this.y);
    }
    
    if (this.can_tick())
    {
      this.frametimer--;
      if (this.frametimer <= 0)
      {
        if (this.s_data.next)
        {
          this.s_data = this.s_data.next();
          if (!this.s_data)
          {
            this.destroy();
            return;
          }
          this.frametimer = this.s_data.nextf || 0;
          this.sprite = new Sprite(this.s_data.url, this.s_data.w, this.s_data.h);
        }
        else
          this.destroy();
      }
    }
  }
  
  tick()
  {
    this.tick_anim();
    super.tick();
  }
}

class BGObject extends TickableObject
{
  constructor(x,y,sprite)
  {
    super(x,y);
    tick_objects.pop();
    this.cur_sprite = null;
    if (sprite && sprite.url && sprite.w && sprite.h)
    {
      this.sprite_data = sprite;
      this.frametimer = sprite.nextf || 0;
      this.cur_sprite = new Sprite(sprite.url,sprite.w,sprite.h);
    }
    // The only difference is that this is drawn in the background
    bg_tick_objs.push(this);
  }
  
  get_sprite() {return this.cur_sprite;}
  get_sprite_data() {return this.sprite_data;}
  remove_sprite() {
    this.sprite_data = null;
    this.cur_sprite = null;
  }
  set_sprite(s)
  {
    if (s && s.url && s.w && s.h)
    {
      this.sprite_data = s;
      this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
      if (s.next && s.nextf)
        this.frametimer = s.nextf;
    }
  }
  
  tick_sprite()
  {
    if (!this.cur_sprite && this.sprite_data)
      this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
    if (!this.deletable && this.cur_sprite)
      this.cur_sprite.draw(this.x,this.y);
    if (this.can_tick() && this.sprite_data && this.sprite_data.next)
    {
      this.frametimer--;
      if (this.frametimer <= 0)
      {
        this.sprite_data = this.sprite_data.next();
        this.frametimer = this.sprite_data.nextf;
        this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
      }
    }
  }
  
  tick_sprite()
  {
    if (!this.cur_sprite && this.sprite_data)
      this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
    if (!this.deletable && this.cur_sprite)
      this.cur_sprite.draw(this.x,this.y);
    if (this.can_tick() && this.sprite_data && this.sprite_data.next)
    {
      this.frametimer--;
      if (this.frametimer <= 0)
      {
        this.sprite_data = this.sprite_data.next();
        this.frametimer = this.sprite_data.nextf;
        this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
      }
    }
  }
  
  // All the ticking happens in the BG tick now
  bg_tick()
  {
    super.tick();
    
    if (!this.deletable)
      this.tick_sprite();
  }
  
  // Normal tick no longer does anything
  tick() {return;}
}

class GameObject extends TickableObject
{
  constructor(x,y,sprite)
  {
    super(x,y);
    this.cur_sprite = null;
    if (sprite && sprite.url && sprite.w && sprite.h)
    {
      this.sprite_data = sprite;
      this.frametimer = sprite.nextf || 0;
      this.cur_sprite = new Sprite(sprite.url,sprite.w,sprite.h);
    }
    this.hitbox = null;
  }
  
  get_hitbox() {return this.hitbox;}
  clear_hitbox() {this.hitbox = null;}
  set_hitbox(r) {this.hitbox = new HitBox(this,r);}
  
  get_sprite() {return this.cur_sprite;}
  get_sprite_data() {return this.sprite_data;}
  remove_sprite() {
    this.sprite_data = null;
    this.cur_sprite = null;
  }
  set_sprite(s)
  {
    if (s && s.url && s.w && s.h)
    {
      this.sprite_data = s;
      this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
      if (s.next && s.nextf)
        this.frametimer = s.nextf;
    }
  }
  
  tick_sprite()
  {
    if (!this.cur_sprite && this.sprite_data)
      this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
    if (!this.deletable && this.cur_sprite)
      this.cur_sprite.draw(this.x,this.y);
    if (this.can_tick() && this.sprite_data && this.sprite_data.next)
    {
      this.frametimer--;
      if (this.frametimer <= 0)
      {
        this.sprite_data = this.sprite_data.next();
        this.frametimer = this.sprite_data.nextf;
        this.cur_sprite = new Sprite(this.sprite_data.url, this.sprite_data.w, this.sprite_data.h);
      }
    }
  }
  
  tick()
  {
    super.tick();
    
    if (!this.deletable)
      this.tick_sprite();
    
    if (!this.can_tick())
      return;
  }
}

// Items
class Item extends GameObject
{
  constructor(x,y,xsp,ysp)
  {
    super(x,y);
    this.xsp = xsp || 0;
    this.ysp = ysp || 0;
    this.collected = false;
    this.hitbox = new HitBox(this,16,"item");
  }
  
  do_collisions()
  {
    if (this.hitbox instanceof HitBox && ply && !ply.is_dead())
    {
      if (this.hitbox.is_touching(ply.get_grazebox(),"graze") && ply_ctrl.focus)
      {
        this.xsp *= 0.95;
        this.ysp *= 0.95;
        this.x += (ply.get_x() - this.x) / 10;
        this.y += (ply.get_y() - this.y) / 10;
      }
      if (this.hitbox.is_touching(ply.get_hitbox(),"player"))
        this.collected = true;
    }
  }
  
  tick()
  {
    super.tick();
    this.do_collisions();
    if (this.collected)
      this.destroy();
    if (!this.can_tick())
      return;
    
    this.xsp -= 0.125;
    this.xsp = max(this.xsp,-3);
    this.ysp *= 0.9752;
  }
}

class BarrierItem extends Item
{
  constructor(x,y,xsp,ysp)
  {
    super(x,y,xsp,ysp);
    this.cur_sprite = new Sprite(imgs.hud.life1.url,16,16);
    this.cur_sprite.scale_x = 2;
    this.cur_sprite.scale_y = 2;
  }
  
  do_collisions()
  {
    super.do_collisions();
    if (this.collected)
    {
      ply.health++;
      play_sound(snds.barrier_up);
    }
  }
}

class OrbItem extends Item
{
  constructor(x,y,xsp,ysp)
  {
    super(x,y,xsp,ysp);
    this.cur_sprite = new Sprite(imgs.hud.sp_orb.url,16,16);
    this.cur_sprite.scale_x = 2;
    this.cur_sprite.scale_y = 2;
  }
  
  do_collisions()
  {
    super.do_collisions();
    if (this.collected)
    {
      ply.magic += 25;
      play_sound(snds.sp_up);
    }
  }
}

// Bullet class
class Bullet extends GameObject
{
  constructor(x,y,angle,speed,size,type,no_hitbox,force_spawn,spin,no_remove_on_hit)
  {
    super(x,y);
    // Can't spawn directly inside player
    if (this.get_distance(ply) <= 10 && !force_spawn)
    {
      this.deletable = true;
      return;
    }
    this.spin = spin || 0;
    this.angle = angle * 1;
    this.speed = speed * 1;
    this.#calc_velocities();
    this.size = size || "m";
    this.type = type || 0;
    this.set_sprite(imgs.bullet[this.size + this.type]);
    this.die_on_hit = !no_remove_on_hit;
    if (!no_hitbox)
    {
      let radius = 6;
      if (this.size == "s")
        radius = 3;
      if (this.size == "l")
        radius = 12;
      if (this.size == "xl")
        radius = 24;
      this.hitbox = new HitBox(this,radius,"bullet");
    }
    else if (this.cur_sprite)
      this.cur_sprite.tint[3] = 127;
    bullets.push(this);
  }
  
  get_type() {return this.type;}
  get_size() {return this.size;}
  
  get_angle() {return this.angle;}
  get_speed() {return this.speed;}
  set_angle(angle)
  {
    if (angle != this.angle)
    {
      this.angle = angle;
      this.#calc_velocities();
    }
  }
  set_speed(speed)
  {
    if (speed != this.speed)
    {
      this.speed = speed;
      this.#calc_velocities();
    }
  }
  
  // These don't do anything anymore; use set_speed and set_angle instead
  set_xsp(xsp) {}
  set_ysp(ysp) {}
  
  // Overridden hitbox thing
  // Doesn't do anything anymore because bullet hitboxes are constant
  set_hitbox(r) {}
  
  #calc_velocities()
  {
    this.xsp = this.speed * cos(this.angle * PI / 180);
    this.ysp = -this.speed * sin(this.angle * PI / 180);
  }
  
  do_collisions()
  {
    if (this.hitbox == null && this.cur_sprite)
      this.cur_sprite.tint[3] = 127;
    if (this.hitbox && this.hitbox instanceof HitBox && ply && !ply.is_dead())
    {
      if (this.hitbox.is_touching(ply.get_grazebox(),"graze"))
        ply.graze(this.uid,this.size);
      if (this.hitbox.is_touching(ply.get_hitbox(),"player"))
      {
        ply.die();
        if (this.die_on_hit)
          this.destroy();
      }
    }
  }
  
  destroy()
  {
    let p = new Particle(this.x,this.y,imgs.particle.bullet_die);
    if (this.size == "l")
      p.scale = 1.5;
    if (this.size == "xl")
      p.scale = 2;
    if (!this.hitbox)
      p.tint[3] = 127;
    super.destroy();
  }
  
  tick()
  {
    super.tick();
    if (this.cur_sprite && this.spin == 0)
      this.cur_sprite.rotation = this.angle;
    this.do_collisions();
    if (!this.can_tick())
      return;
    if (this.cur_sprite && this.spin != 0)
      this.cur_sprite.rotation = (this.cur_sprite.rotation + this.spin) % 360;
  }
}

class PlyShot extends GameObject
{
  constructor(x,y)
  {
    super(x,y,imgs.bullet.ply_shot);
    this.xsp = 3;
    this.hitbox = new HitBox(this,8,"ply_shot");
    this.cur_sprite.tint[3] = 127;
    ply_bullets.push(this);
    play_sound(snds.ply_shot);
  }
  
  do_collisions()
  {
    if (this.hitbox instanceof HitBox)
      for (let e of entities)
        if (e != ply && !e.is_dead() && this.hitbox.is_touching(e.get_hurtbox(), "enem_hurt"))
        {
          e.take_damage(1);
          if (!e.is_invincible())
            ply.magic += 0.0625;
          this.destroy();
        }
  }
  
  movement()
  {
    this.xsp += 0.5;
    this.xsp = min(this.xsp,16);
  }
  
  destroy()
  {
    let p = new Particle(this.x,this.y,imgs.particle.bullet_die);
    p.set_xsp(this.xsp / 4);
    p.tint[3] = 127;
    super.destroy();
  }
  
  tick()
  {
    super.tick();
    if (this.can_tick())
    {
      this.movement();
      this.do_collisions();
    }
  }
}

// Generic entity class
class Entity extends GameObject
{
  constructor(x,y,sprites,def_anim,hp,sp)
  {
    super(x,y);
    this.max_hp = hp || 20;
    this.hp = this.max_hp;
    this.max_sp = sp || 20;
    this.sp = this.max_sp;
    this.curstate = 0;
    this.ᴛimestop = 0;
    this.invin = false;
    this.invin_timer = 0;
    this.sprites = sprites;
    this.play_anim(def_anim);
    this.cur_anim = def_anim;
    this.hurt_timer = 0;
    this.dead = false;
    this.vars = {};
    this.bounds_delete = true;
    entities.push(this);
  }
  
  play_anim(anim)
  {
    if (this.cur_anim == anim)
      return;
    let init = String(anim + "0");
    if (this.sprites[init])
    {
      this.cur_anim = anim;
      this.set_sprite(this.sprites[init]);
    }
  }
  
  get health() {return this.hp;}
  set health(hp) {this.hp = min(this.max_hp,max(0,hp));}
  get magic() {return this.sp;}
  set magic(sp) {this.sp = min(this.max_sp,max(0,sp));}
  
  get max_health() {return this.max_hp;}
  set max_health(hp) {this.max_hp = max(1,hp);}
  get max_magic() {return this.max_sp;}
  set max_magic(sp) {this.max_sp = max(0,sp);}
  
  get offscreen_remove() {return this.bounds_delete};
  set offscreen_remove(yn) {this.bounds_delete = yn;};
  
  take_damage(amt, ignore_invin, nokill)
  {
    if (this.dead)
      return;
    if (ignore_invin || !this.is_invincible())
    {
      this.hp -= amt;
      if (nokill && this.hp < 0)
        this.hp = 0;
      if (this.hp < 0)
        this.die(ignore_invin);
    }
  }
  
  is_dead() {return this.dead;}
  is_hurt() {return this.hurt_timer > 0;}
  
  get_hurtbox() {return null;}
  
  die(ignore_invin)
  {
    if (this.dead)
      return;
    if (ignore_invin || !this.is_invincible())
    {
      this.xsp = random() * 8 - 4;
      this.ysp = -8;
      this.dead = true;
    }
  }
  
  is_invincible() {return this.invin || this.invin_timer > 0 || dialogue_active || paused() || this.no_tick;}
  
  set_invincibility(yn) {this.invin = yn;}
  turn_off_invin()
  {
    this.invin = false;
    this.invin_timer = 0;
  }
  
  get timestop_immune() {return this.ignore_ᴛimestop || this.ᴛimestop > 0;}
  stopping_time() {return this.ᴛimestop > 0;}
  
  stop_time(duration)
  {
    this.ᴛimestop = duration || 60;
  }
  
  end_timestop()
  {
    this.ᴛimestop = 0;
  }
  
  update_invin_tint()
  {
    if (!this.cur_sprite)
      return;
    if (this.invin || this.invin_timer > 0)
    {
      this.cur_sprite.tint[1] = 50;
      this.cur_sprite.tint[2] = 50;
    }
    else
    {
      this.cur_sprite.tint[1] = 255;
      this.cur_sprite.tint[2] = 255;
    }
  }
  
  tick_death()
  {
    if (!this.dead)
      return;
    this.hurt_timer = Infinity;
    this.turn_off_invin();
    this.ysp += 0.375;
    if (this.y >= height + 256)
      this.destroy();
  }
  
  tick()
  {
    if (this.can_tick() && this.invin_timer > 0)
      this.invin_timer--;
    
    this.update_invin_tint();
    
    super.tick();
    if(!this.can_tick())
      return;
    
    this.tick_death();
    
    if (this.ᴛimestop > 0)
      this.ᴛimestop--;
  }
}

// Enemy goes brrr
class Enemy extends Entity
{
  constructor(x,y,r,sprites,def_anim,hp,sp,r2)
  {
    super(x,y,sprites,def_anim,hp,sp);
    this.sp = sp * 1;
    this.ply_col = true;
    this.atk_col = true;
    this.hitbox = new HitBox(this,abs(r),"enem");
    this.hurtbox = new HitBox(this,r2 || abs(r), "enem_hurt");
  }
  
  get has_ply_col() {return this.ply_col;}
  set has_ply_col(yn) {this.ply_col = yn;}
  get has_atk_col() {return this.atk_col;}
  set has_atk_col(yn) {this.atk_col = yn;}
  
  take_damage(amt, ignore_invin, nokill)
  {
    if (this.dead)
      return;
    if (ignore_invin || !this.is_invincible() && this.atk_col)
    {
      this.hp -= amt;
      if (nokill && this.hp < 1)
        this.hp = 1;
      if (this.hp < 1)
        this.die(ignore_invin);
    }
  }
  
  get_hitbox() {return this.ply_col ? this.hitbox : null;}
  get_hurtbox() {return this.atk_col ? this.hurtbox : null;}
  
  is_invincible() {return !this.atk_col || super.is_invincible();}
  
  die(ignore_invin)
  {
    if (this.dead)
      return;
    if (ignore_invin || !this.is_invincible())
    {
      this.dead = true;
      let p = new Particle(this.x,this.y,imgs.particle.bullet_die);
      p.scale = max(1,this.hitbox.get_r() / 32) * 2;
      play_sound(snds.enem_die);
      this.destroy();
    }
  }
  
  do_collisions()
  {
    if (this.hitbox instanceof HitBox)
    {
      if (ply && !ply.is_dead() && this.ply_col &&  this.hitbox.is_touching(ply.get_hitbox(),"player"))
        ply.die();
    }
  }
  
  tick()
  {
    super.tick();
    
    if (this.can_tick())
      this.do_collisions();
  }
}

class Boss extends Enemy
{
  constructor(x,y,r,sprites,def_anim,hp,sp,r2)
  {
    super(x,y,r,sprites,def_anim,hp,sp,r2);
    this.show_pos = true;
  }
  
  die(ignore_invin, no_die_eff, no_bullet_clear)
  {
    if (this.dead)
      return;
    if (ignore_invin || !this.is_invincible())
    {
      this.xsp = random() * 8 - 4;
      this.ysp = -8;
      this.dead = true;
      this.atk_col = false;
      this.ply_col = false;
      if (!no_die_eff)
      {
        shake_screen(15,180);
        let p = new Particle(this.x,this.y,imgs.particle.special);
        p.scale = 8;
        play_sound(snds.boss_expl);
      }
      if (!no_bullet_clear)
        clear_bullets();
      
      this.play_anim("hurt");
      this.show_pos = false;
    }
  }
  
  get show_positioner() {return this.show_pos;}
  set show_positoiner(yn) {this.show_pos = yn;}
  
  draw_positioner()
  {
    // Helps show the player where the boss is since they're focusing on bullet dodging
    if (!this.show_pos)
      return;
    
    push();
    strokeWeight(0);
    fill("#aea2de44");
    rect(0,this.y - 32,width,64);
    pop();
  }
  
  tick()
  {
    this.draw_positioner();
    super.tick();
  }
}

// Oh my god, the actual player, no way
class Player extends Entity
{
  constructor(x,y)
  {
    super(x,y,imgs.ply,"forward",5);
    this.can_control = false;
    this.can_move = true;
    this.can_shoot = false;
    this.can_special = false;
    this.can_ex_super = false;
    ply = this;
    this.hitbox = new HitBox(this,4,"player");
    this.grazebox = new HitBox(this,56,"graze");
    this.grazed = [];
    this.hp = 3;
    this.max_hp = 8;
    this.sp = 0;
    this.max_sp = 100;
    this.sp_timer = 0;
    this.shot_ᴛimer = 0;
    this.shot_ᴛimeout = 0;
    this.vars.sp_atk_lv = 0;
    this.vars.sp_atk_timer = 0;
    this.bounds_delete = false;
    this.barrier_warning = 0;
  }
  
  get_hitbox() {return stage_clear ? null : this.hitbox;}
  
  get_grazebox() {return stage_clear ? null : this.grazebox;}
  
  get allow_control() {return this.can_control;}
  set allow_control(yn) {this.can_control = yn;}
  get allow_moving() {return this.can_move;}
  set allow_moving(yn) {this.can_move = yn;}
  get allow_shooting() {return this.can_shoot;}
  set allow_shooting(yn) {this.can_shoot = yn;}
  get allow_specials() {return this.can_special;}
  set allow_specials(yn) {this.can_special = yn;}
  get allow_supers() {return this.can_ex_super;}
  set allow_supers(yn) {this.can_ex_super = yn;}
  
  get sp_burning() {return this.sp_timer;}
  
  stopping_time() {return this.ᴛimestop > 0 && this.hurt_timer <= 0;}
  
  hurt_freeze() {return this.ᴛimestop > 0 && this.hurt_timer > 0;}
  
  die(ignore_invin)
  {
    if (this.dead)
      return;
    if (ignore_invin || !this.is_invincible())
    {
      this.invin_timer = 180;
      if (this.sp < this.max_sp)
      {
        this.hp--;
        this.sp -= 25;
      }
      this.sp = this.sp <= 0 ? 0 : this.sp;
      this.hurt_timer = 30;
      this.shot_ᴛimeout = 0;
      this.shot_ᴛimer = 0;
      this.sp_timer = 0;
      this.vars.sp_atk_lv = 0;
      this.vars.sp_atk_timer = 0;
      this.vars.super_timer = 0;
      this.stop_time(30);
      if (this.hp == 0)
        this.barrier_warning = 60;
      play_sound(snds.barrier_break);
      shake_screen(15,15);
    }
  }
  
  graze(bullet,size)
  {
    for (let u of this.grazed)
      if (u == bullet)
        return;
    this.grazed.push(bullet);
    
    while (this.grazed.length > 500)
      this.grazed = this.grazed.splice(0,1);
    
    // Graze particle
    let p = new Particle(this.x,this.y,imgs.particle.graze);
    let a = random() * 2 * PI;
    p.set_xsp(6 * cos(a));
    p.set_ysp(6 * sin(a));
    
    // Graze sound
    play_sound(snds.graze);
    
    if (this.vars.super_timer > 0 || this.ᴛimestop > 0)
      return;
    
    // SP increases based on size of boolet
    // Will not increase if charging up a special
    if (!ply_ctrl.special || this.sp_timer <= 0)
      if (size == "s")
        this.sp += 0.5;
      else if (size == "m")
        this.sp += 0.75;
      else if (size == "l")
        this.sp += 0.875;
      else if (size == "xl")
        this.sp++;
    
    if (this.sp > 100)
      this.sp = 100;
  }
  
  tick_hurt()
  {
    if (this.hurt_timer > 0)
    {
      this.hurt_timer--;
      this.play_anim("hurt");
      if (this.sp >= this.max_sp)
      {
        if (this.hurt_timer > 10 && just_pressed().ex_super && this.can_ex_super)
        {
          this.hurt_timer = 0;
          this.vars.counter_super = true;
        }
        else if (this.hurt_timer == 10)
        {
          this.hp--;
          this.sp -= 25;
          if (this.hp == 0)
            this.barrier_warning = 60;
        }
      }
      else if (this.hurt_timer <= 0 && this.hp < 0)
      {
        super.die(true);
        play_sound(snds.death);
      }
    }
    if (this.barrier_warning > 0)
    {
      if (this.barrier_warning == 60)
        play_sound(snds.last_life);
      this.barrier_warning--;
      if (this.barrier_warning >= 55 || this.barrier_warning < 50)
        show_text("[Barriers depleted!]", this.x, this.y - 40, fonts.ts, 16, [255, 0, 0, 127], CENTER);
    }
  }
  
  movement()
  {
    this.xsp = 0;
    this.ysp = 0;
    let speed = 6.5;
    let angle = 0;
    
    if (ply_ctrl.focus)
      speed = 3;
    
    if (!this.can_move || !ply_ctrl.up && !ply_ctrl.down && !ply_ctrl.left && !ply_ctrl.right)
      speed = 0;
    else
    {
      if (ply_ctrl.right)
        if (ply_ctrl.up)
          angle = 45;
        else if (ply_ctrl.down)
          angle = 315;
        else
          angle = 0;
      else if (ply_ctrl.left)
        if (ply_ctrl.up)
          angle = 135;
        else if (ply_ctrl.down)
          angle = 225;
        else
          angle = 180;
      else if (ply_ctrl.up)
        angle = 90;
      else if (ply_ctrl.down)
        angle = 270;
    }
    
    if (this.can_move)
    {
      let temp_x = speed * cos(angle * PI / 180);
      let temp_y = -speed * sin(angle * PI / 180);
      if (temp_x > 1)
        this.play_anim("forward");
      else if (temp_x < -1)
        this.play_anim("back");
      else
        this.play_anim("idle");
      this.x += temp_x;
      this.y += temp_y;
    }
  }
  
  borders()
  {
    if (!this.can_control)
      return;
    
    if (this.x < 32)
      this.x = 32;
    if (this.x > width - 32)
      this.x = width - 32;
    if (this.y < 64)
      this.y = 64;
    if (this.y > height - 64)
      this.y = height - 64;
  }
  
  shooting()
  {
    // Can't shoot if charging up a special
    if (!this.can_shoot || (ply_ctrl.special && this.sp_timer > 0))
    {
      this.shot_ᴛimeout = 0;
      this.shot_ᴛimer = 0;
      return;
    }
    
    if (ply_ctrl.shoot)
      this.shot_ᴛimeout = 30;
    
    if (this.shot_ᴛimeout > 0)
    {
      this.shot_ᴛimeout--;
      if (this.shot_ᴛimer <= 0)
      {
        this.shot_ᴛimer = 5;
        if (ply_ctrl.focus)
        {
          new PlyShot(this.x + 22,this.y + 12);
          new PlyShot(this.x + 22,this.y - 12);
          new PlyShot(this.x + 10,this.y + 24);
          new PlyShot(this.x + 10,this.y - 24);
        }
        else
        {
          new PlyShot(this.x + 22,this.y + 24);
          new PlyShot(this.x + 22,this.y - 24);
          new PlyShot(this.x + 10,this.y + 64);
          new PlyShot(this.x + 10,this.y - 64);
        }
      }
      else
        this.shot_ᴛimer--;
    }
    else
      this.shot_ᴛimer = 0;
  }
  
  specials()
  {
    if (!this.can_special)
    {
      this.sp_timer = 0;
      this.vars.sp_atk_lv = 0;
      this.vars.sp_atk_timer = 0;
      return;
    }
    
    if (ply_ctrl.special && this.vars.sp_atk_timer <= 0)
      this.sp_timer += 1.5;
    
    let _m = 75;
    
    if (this.sp < 75)
      _m = 50;
    if (this.sp < 50 || this.ᴛimestop > 0)
      _m = 25;
    if (this.sp < 25)
      _m = 0;
    
    if (this.is_hurt())
    {
      this.sp_timer = 0;
      this.vars.sp_atk_timer = 0;
    }
    
    if (this.sp_timer > _m)
      this.sp_timer = _m;
    
    if (this.sp_timer >= 75)
      show_text("[Level 3]", this.x, this.y - 56, fonts.ts, 16, [255, 255, 255, 127], CENTER);
    else if (this.sp_timer >= 50)
      show_text("[Level 2]", this.x, this.y - 56, fonts.ts, 16, [255, 255, 255, 127], CENTER);
    else if (this.sp_timer >= 25)
      show_text("[Level 1]", this.x, this.y - 56, fonts.ts, 16, [255, 255, 255, 127], CENTER);
    
    if (!ply_ctrl.special && this.sp_timer > 0)
    {
      let bars = floor(this.sp_timer / 25);
      this.sp -= bars * 25;
      this.sp_timer = 0;
      
      if (bars == 1)
      {
        this.vars.sp_atk_lv = 1;
        this.vars.sp_atk_timer = 30;
      }
      else if (bars == 2)
      {
        this.vars.sp_atk_timer = 30;
        let p = new Particle(this.x,this.y,imgs.particle.special);
        p.scale = 3;
        let clear_box = new HitBox(this,128,"bullet must die");
        for (let b of bullets)
          if (clear_box.is_touching(b.get_hitbox()) || abs(b.get_y() - this.y) <= 64)
            b.destroy();
        clear_box = null;
        for (let i = 0; i < 8; i++)
        {
          new PlyShot(this.x + 32 - i * 32,this.y);
          new PlyShot(this.x + 32 - i * 48,this.y);
          new PlyShot(this.x + 32 - i * 32,this.y + 4);
          new PlyShot(this.x + 32 - i * 32,this.y - 4);
          new PlyShot(this.x + 32 - i * 32,this.y + 8);
          new PlyShot(this.x + 32 - i * 32,this.y - 8);
          new PlyShot(this.x + 32 - i * 48,this.y + 12);
          new PlyShot(this.x + 32 - i * 48,this.y - 12);
          new PlyShot(this.x + 32 - i * 48,this.y + 13);
          new PlyShot(this.x + 32 - i * 48,this.y - 13);
          new PlyShot(this.x + 32 - i * 8,this.y + i * 8);
          new PlyShot(this.x + 32 - i * 8,this.y - i * 8);
          new PlyShot(this.x + 8 - i * 24,this.y + i * 16);
          new PlyShot(this.x + 8 - i * 24,this.y - i * 16);
        }
        play_sound(snds.special);
      }
      else if (bars == 3)
      {
        this.vars.sp_atk_lv = 3;
        this.vars.sp_atk_timer = 30;
        this.invin_timer = 30;
      }
    }
    
    if (this.vars.sp_atk_timer > 0)
    {
      this.vars.sp_atk_timer--;
      this.shot_ᴛimeout = 2;
      this.shot_ᴛimer = 5;
      
      if (this.vars.sp_atk_lv == 1 && this.vars.sp_atk_timer % 2 == 0)
      {
        let temp_y = sin(this.vars.sp_atk_timer / 15 * PI) * 32;
        new PlyShot(this.x + 22,this.y + temp_y);
        new PlyShot(this.x + 22,this.y - temp_y);
        temp_y = cos(this.vars.sp_atk_timer / 15 * PI) * 96;
        new PlyShot(this.x + 22,this.y + temp_y);
        new PlyShot(this.x + 22,this.y - temp_y);
      }
      if (this.vars.sp_atk_lv == 3 && this.vars.sp_atk_timer == 0)
      {
        this.stop_time(120);
        let p = new Particle(this.x,this.y,imgs.particle.special);
        p.scale = 4;
        p.timestop_immune = true;
        let clear_box = new HitBox(this,192,"bullet must die");
        for (let b of bullets)
          if (clear_box.is_touching(b.get_hitbox()))
            b.destroy();
        clear_box = null;
        play_sound(snds.special);
        play_sound(snds.timestop);
      }
    }
    else
      this.vars.sp_atk_lv = 0;
  }
  
  ex_supers()
  {
    if (!this.can_ex_super)
    {
      this.vars.super_timer = 0;
      return;
    }
    
    if (this.vars.super_timer == null)
      this.vars.super_timer = 0;
    
    if (this.vars.counter_super && this.vars.super_timer <= 0)
    {
      this.sp = 0;
      this.stop_time(90);
      this.invin_timer = 120;
      this.vars.super_timer = 90;
      this.vars.could_move = this.can_move;
      play_sound(snds.timestop);
    }
    
    if (this.sp >= this.max_sp && just_pressed().ex_super)
    {
      this.sp = 0;
      this.vars.super_timer = 220;
      this.invin_timer = 222;
      this.vars.could_move = this.can_move;
      
      let p = new Particle(this.x,this.y,imgs.particle.special);
      p.scale = 3;
      p.timestop_immune = true;
      let clear_box = new HitBox(this,128,"bullet must die");
      for (let b of bullets)
        if (clear_box.is_touching(b.get_hitbox()))
          b.destroy();
      clear_box = null;
      play_sound(snds.special);
    }
    if (this.vars.super_timer > 0)
    {
      this.vars.super_timer--;
      this.shot_ᴛimeout = 2;
      this.shot_ᴛimer = 5;
      
      if (this.vars.counter_super)
      {
        this.can_move = false;
        this.play_anim("pose");
        
        if (this.vars.super_timer == 75)
        {
          let p = new Particle(this.x + 64, this.y, imgs.particle.slash);
          p.scale = 5;
          p.rotation = 30;
          p.timestop_immune = true;
          for (let e of entities)
            if (e != this)
              e.take_damage(75, false, true);
          play_sound(snds.slash);
        }
        if (this.vars.super_timer == 72)
        {
          let p = new Particle(this.x + 64, this.y, imgs.particle.slash);
          p.scale = 5;
          p.rotation = 60;
          p.timestop_immune = true;
          for (let e of entities)
            if (e != this)
              e.take_damage(75, false, true);
          play_sound(snds.slash);
        }
        
        if (this.vars.super_timer == 0)
        {
          this.can_move = this.vars.could_move;
          this.vars.counter_super = null;
          this.vars.could_move = null;
        }
      }
      else
      {
        if (this.vars.super_timer > 180)
        {
          this.can_move = false;
          this.play_anim("pose");
        }
        if (this.vars.super_timer == 180)
        {
          this.can_move = this.vars.could_move;
          this.vars.could_move = null;
          this.stop_time(180);
          play_sound(snds.timestop);
        }

        if (this.vars.super_timer <= 180 && this.vars.super_timer > 60)
        {
          new Particle(random() * width, random() * height,imgs.particle.bullet_die);
          for (let e of entities)
            if (e != this)
              e.take_damage(1.5, false, true);
          if (this.vars.super_timer % 2 == 0)
          {
            let p = new Particle(random() * width, random() * height, imgs.particle.slash);
            p.scale = 2;
            p.rotation = random() * 360;
            p.timestop_immune = true;
            play_sound(snds.slash);
          }
        }
      }
      
      if (this.vars.super_timer == 0)
      {
        this.vars.counter_super= false;
        clear_bullets();
        for (let e of entities)
          if (e != this)
            e.take_damage(1);
      }
    }
  }
  
  control_player()
  {
    if (!this.can_control || stage_clear)
    {
      this.shot_ᴛimeout = 0;
      this.shot_ᴛimer = 0;
      this.sp_timer = 0;
      this.vars.sp_atk_lv = 0;
      this.vars.sp_atk_timer = 0;
      this.vars.super_timer = 0;
      return;
    }
    if (this.hurt_timer <= 0)
      this.movement();
    this.borders();
    if (this.hurt_timer > 0)
      return;
    this.shooting();
    this.specials();
    this.ex_supers();
  }
  
  tick_death()
  {
    super.tick_death();
    if (this.deletable)
      ply = null;
  }
  
  draw_hitbox()
  {
    if (ply_ctrl.focus)
    {
      // Rendering hitbox like in Touhou
      push();
      strokeWeight(0);
      fill("#aea2deff");
      circle(this.x,this.y,16);
      fill("#ffffffff");
      circle(this.x,this.y,8);
      pop();
    }
  }
  
  tick()
  {
    this.max_hp = 8;
    this.max_sp = 100;
    if (this.can_tick())
    {
      if (!this.dead && !stage_clear)
      {
        this.xsp = 0;
        this.ysp = 0;
      }
      this.tick_hurt();
      if (!this.dead && !stage_clear)
        this.control_player();
    }
    super.tick();
    if (this.can_tick())
      this.draw_hitbox();
  }
}