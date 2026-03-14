// This script handles all of the dialoguing stuff in the game
// Basically a partially rewritten system borrowed from the same idea I've been using since I learned how to make textboxes like years ago at this point lol
let textbox = {
  cur_text: "",
  shown_text: "",
  cur_font: 'Arial',
  font_color: [255,255,255,255],
  cur_cutin: null,
  delay: 0,
  max_delay: 2,
  // Text finished typing out
  finished: function() {return this.cur_text.length == 0;},
  // Put something in the text buffer to type out
  show_text: function(txt,override,font,c,delay,cutin)
  {
    if (override)
      this.clear();
    this.cur_text += txt;
    this.cur_font = font || 'Arial';
    this.font_color = c || [255,255,255,255];
    this.max_delay = delay || 2;
    if (cutin && cutin.url && cutin.w && cutin.h)
    {
      this.cur_cutin = new Sprite(cutin.url,cutin.w,cutin.h);
      this.cur_cutin.tint[3] = 127;
    }
  },
  // Clears out the textbox
  clear: function()
  {
    this.delay = 0;
    this.cur_text = "";
    this.shown_text = "";
  },
  // "Alright we get it just finish up typing already"
  // Preferably said in the same way Mario did in that one Mario Golf game
  hurry_up_already: function()
  {
    this.delay = 0;
    this.shown_text += this.cur_text;
    this.cur_text = "";
  }
};

// Dialogue handler for handling sequences of text
let dialogue_handler = {
  // A queue of dialogues to be displayed
  dialogues: [],
  // Prevent queueing more than once
  queued: false,
  // Add one
  add_dialogue: function(dialogue)
  {
    this.dialogues.push(dialogue);
  },
  // Add multiple
  add_dialogues: function(texts)
  {
    for (let i in texts)
      this.dialogues.push(texts[i]);
  },
  queue_dialogue: function()
  {
    if (this.queued)
      return;
    this.queued = true;
    if (this.dialogues[0])
    {
      let d = this.dialogues[0];
      textbox.show_text(d.txt,d.override,d.font,d.c,d.delay,d.cutin);
      if (d.func && (typeof d.func) == "function")
        d.func();
      dialogue_active = true;
      this.dialogues.splice(0,1);
    }
    else
      textbox.clear();
  },
  clear: function()
  {
    this.queued = false;
    this.dialogues = [];
  }
};

function tick_textbox()
{
  
  if (!game_paused)
  {
    let ctrl = just_pressed();
    if ((ctrl.shoot || keyIsDown('Control')) && dialogue_active)
      if (!textbox.finished())
        textbox.hurry_up_already();
      else
      {
        dialogue_handler.queue_dialogue();
        play_sound(snds.text_adv);
      }

    if (!dialogue_active && dialogue_handler.dialogues.length > 0)
      dialogue_handler.queue_dialogue();
  }
  
  if (!paused())
  {
    // Tick down the delay
    if (textbox.delay > 0)
      textbox.delay--;

    // There is still text to be shown!
    if ((textbox.delay <= 0 || textbox.cur_text.length <= 0) && !textbox.finished())
    {
      textbox.delay = textbox.max_delay;
      // Add the next character
      let c = textbox.cur_text[0];
      let c2 = textbox.cur_text[1];
      let x = c2 && c2 != '!' && c2 != '?' && c2 != '.';
      if (c)
        textbox.shown_text += c;
      // Extra delays for grammar
      if (c == ',')
        textbox.delay += 5;
      if (c == '.' || c == '-' && c2 && c2 == ' ' || c == '!' && x || c == '?' && x)
        textbox.delay += 10;
      // Cut down on the text
      textbox.cur_text = textbox.cur_text.length > 1 ? textbox.cur_text.substring(1) : "";
      
      // Play the sound
      if (c != ' ' || c2)
        play_sound(snds.type);
    }
  }
  
  if (textbox.shown_text.length > 0)
  {
    dialogue_active = true;
    // Do not render the textbox when game's paused
    if (!game_paused)
    {
      // Cutins
      if (textbox.cur_cutin instanceof Sprite)
        textbox.cur_cutin.draw(width / 2,height * 0.75);

      // Actual baux, no way
      push();
      strokeWeight(0);
      fill("#00000088");
      rect(0,height - 196,width, 196);
      pop();

      // Text goes brrr
      push();
      textSize(24);
      textAlign(LEFT);
      textStyle(NORMAL);
      textFont(textbox.cur_font);
      fill(textbox.font_color[0], textbox.font_color[1], textbox.font_color[2], textbox.font_color[3]);
      text(textbox.shown_text, 24, height - 172, width - 48);
      pop();

      if (textbox.finished())
      {
        push();
        strokeWeight(0);
        fill("#aea2deff");
        triangle(width - 32, height - 16, width - 16, height - 16, width - 24, height - 8);
        pop();
      }
    }
  }
  else
    dialogue_active = false;
  
  if (textbox.finished())
    dialogue_handler.queued = false;
}