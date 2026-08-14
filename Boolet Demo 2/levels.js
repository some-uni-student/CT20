let lv_vars = {};
// All of the level logic goes here
let levels = [
  // ---------------------------------------------------------------------------------
  // Stage 0 (tutorial)
  // ---------------------------------------------------------------------------------
  function()
  {
    return [
      {
        loc1: 0,
        main: function()
        {
          if (dialogue_active)
            return;
          
          if (this.loc1 == 0)
            play_music(mus.stg0);

          this.loc1++;
          if (this.loc1 >= 60)
          {
            textbox.show_text("Yo!",true,fonts.ts);
            lv_vars.maria = new Enemy(width + 48, height / 2 + 50, 48, imgs.enem.maria, "idle", 500);
            lv_vars.maria.has_ply_col = false;
            lv_vars.maria.offscreen_remove = false;
            game_handler.next_sequence();
          }
        }
      },
      
      // Maria appearance!
      {
        loc1: 256,
        main: function()
        {
          if (dialogue_active)
            return;
          
          let m = lv_vars.maria;
          if (m)
          {
            m.set_x(width - 128 + this.loc1);
            this.loc1 *= 0.9752;
          }
          
          if (this.loc1 <= 1)
          {
            m.set_x(width - 128);
            dialogue_handler.add_dialogues([
              {
                txt: "...Didn't really take you for the flying type, nyih.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria
              },
              {
                txt: "So you're the new chimera everyone's been talking about. Must be fun being one of the few chimeras she's created, nyih?",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria
              },
              {
                txt: "...",
                delay: 20,
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.lily
              },
              {
                txt: "Not very talkative, nyih~? Haven't yet learned how to, nyih~?",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_smug
              },
              {
                txt: "...Meow.",
                override: true,
                font: fonts.xlo,
                cutin: imgs.cutins.lily
              },
              {
                txt: "...I-I'm sorry?",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_ohno
              },
              {
                txt: "Looks can be deceiving.",
                override: true,
                font: fonts.xlo,
                cutin: imgs.cutins.lily
              },
              {
                txt: "I have NO idea what you're on about, nyih.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_ohno
              },
              {
                txt: "A-anyways! Looks like you're just getting started with learning how to get around.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_wetotallygotthis
              },
              {
                txt: "You DO know how to get around instead of just hovering there, right?",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria
              }
            ]);
            game_handler.next_sequence();
          }
        }
      },
      // Learned to move!
      {
        loc1: 0,
        loc2: 300,
        moved: false,
        char_pos: {x:0,y:0},
        main: function()
        {
          if (dialogue_active)
          {
            this.loc1 = 0;
            this.loc2 = 300;
            this.moved = false;
            this.char_pos.x = ply.get_x();
            this.char_pos.y = ply.get_y();
            return;
          }
          
          this.loc1++;
          show_text("[↑]\n[←][↓][→]\n[Shift]",width / 2, height / 2, fonts.ts, 24, [255, 255, 255, min(this.loc1 * 2, 127)], CENTER);
          
          if (this.loc1 == 5)
            ply.allow_control = true;
          
          if (ply.get_x() > width / 3)
            ply.set_x(width / 3);
          
          if (this.char_pos.x != ply.get_x() || this.char_pos.y != ply.get_y())
            this.moved = true;
          
          if (this.moved && this.loc2 > 0)
            this.loc2--;
          
          if (this.loc1 > 120)
          {
            this.loc1 = 120;
            if (this.moved && this.loc2 <= 0)
              game_handler.next_sequence();
          }
        }
      },
      // More wordspeaking!!
      {
        main: function()
        {
          if (dialogue_active)
            return;
          
          dialogue_handler.add_dialogues([
            {
              txt: "...*nods*",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.lily_eyesclosed
            },
            {
              txt: "Good! ",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_confident
            },
            {
              txt: "So she DID tell you that, in this world, people fight and play via bullets.. right?",
              font: fonts.ts,
              cutin: imgs.cutins.maria
            },
            {
              txt: "...",
              delay: 20,
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.lily_wau
            },
            {
              txt: "Awwh, wittle kitty doesn't know art of bullet curtains~?",
              font: fonts.ts,
              override: true,
              cutin: imgs.cutins.maria_smug
            },
            {
              txt: "Don't worry, Big Sis Maria's gonna show you how it's done, nyih!",
              font: fonts.ts,
              override: true,
              cutin: imgs.cutins.maria_confident
            },
            {
              txt: "Please stop being condescending with your words.",
              override: true,
              font: fonts.xlo,
              cutin: imgs.cutins.lily
            },
            {
              txt: "When I shoot, you move!",
              font: fonts.ts,
              override: true,
              cutin: imgs.cutins.maria_confident
            },
            {
              txt: "Ready or not, here I come!",
              font: fonts.ts,
              override: true,
              cutin: imgs.cutins.maria_confident
            }
          ]);
          game_handler.next_sequence();
        }
      },
      // And now Maria shoots you
      {
        loc1: 0,
        loc2: 0,
        main: function()
        {
          if (dialogue_active)
          {
            this.loc1 = 0;
            this.loc2 = 0;
          }
          this.loc1++;
          
          if (this.loc1 > 120)
          {
            this.loc2++;
            this.loc1 = 0;
            
            if (!ply)
              return;
            
            let m = lv_vars.maria;
            let a = m.get_angle_to(ply);
            let mx = m.get_x();
            let my = m.get_y();
            for (let i = 1; i < 3; i++)
            {
              new Bullet(mx,my,a,2 * i / 2, "m", 0, false, true);
              new Bullet(mx,my,a - 15,2 * i / 2, "m", 0, false, true);
              new Bullet(mx,my,a + 15,2 * i / 2, "m", 0, false, true);
              new Bullet(mx,my,a - 30,2 * i / 2, "m", 0, false, true);
              new Bullet(mx,my,a + 30,2 * i / 2, "m", 0, false, true);
              new Bullet(mx,my,a - 45,2 * i / 2, "m", 0, false, true);
              new Bullet(mx,my,a + 45,2 * i / 2, "m", 0, false, true);
            }
            play_sound(snds.shot0);
          }
          
          if (ply.is_hurt())
          {
            clear_bullets();
            ply.health++;
            ply.end_timestop();
            dialogue_handler.add_dialogues([
              {
                txt: "Wh- HEY! ",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_panik
              },
              {
                txt: "I said to DODGE, not to get HIT by the bullets!!",
                font: fonts.ts,
                cutin: imgs.cutins.maria_panik
              },
              {
                txt: "Did.. a-are you okay?!!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_panik
              },
              {
                txt: "...",
                delay:20,
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.lily
              },
              {
                txt: "F-frightening...",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_ohno
              },
            ]);
            game_handler.next_sequence();
          }
          else if (this.loc2 >= 12)
          {
            clear_bullets();
            dialogue_handler.add_dialogues([
              {
                txt: "Seems like you're getting a pretty good hang of it.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_smug
              }
            ]);
            game_handler.next_sequence();
          }
        }
      },
      // More wordspeaking!!
      {
        main: function()
        {
          dialogue_handler.add_dialogues([
            {
              txt: "Anyway...",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria
            },
            {
              txt: "Bullet curtaining shouldn't just be about dodging stuff, even if that's the fun part.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria
            },
            {
              txt: "You've gotta fight back too, nyih! Ya gotta tell 'em you're livin' and kickin', nyih!!",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_confident
            },
            {
              txt: "C'mon, give it a go, will ya?",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_confident
            },
          ]);
          game_handler.next_sequence();
        }
      },
      // You can shoot boolet now
      {
        loc1: 0,
        loc2: 0,
        shot: false,
        main: function()
        {
          if (dialogue_active)
          {
            this.shot = false;
            return;
          }
          
          this.loc2 += 2;
          this.loc2 = this.loc2 > 127 ? 127 : this.loc2;
          show_text("[Z]",width / 2, height / 2, fonts.ts, 24, [255, 255, 255, this.loc2],CENTER);
          
          ply.allow_shooting = true;
          
          if (ply_bullets.length > 0)
            this.shot = true;
          
          if (this.shot)
            this.loc1++;
          
          let m = lv_vars.maria;
          
          if (m.health <= 425)
          {
            m.health = 500;
            clear_ply_bullets();
            ply.allow_shooting = false;
            dialogue_handler.add_dialogues([
              {
                txt: "Ack! Enough, enough! Any more and I'll die, nyih!!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_cri
              }
            ]);
            game_handler.next_sequence();
          }
          else if (this.loc1 >= 300)
          {
            m.health = 500;
            clear_ply_bullets();
            ply.allow_shooting = false;
            dialogue_handler.add_dialogues([
              {
                txt: "Looking good, nyih!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              }
            ]);
            game_handler.next_sequence();
          }
        }
      },
      // Even MORE wordspeaking
      {
        main: function()
        {
          dialogue_handler.add_dialogues([
            {
              txt: "(What even are those things you're throwing, anyway..?)",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_ohno
            },
            {
              txt: "I don't know. She just gave these to me and told me to fight with them.",
              override: true,
              font: fonts.xlo,
              cutin: imgs.cutins.lily
            },
            {
              txt: "You have to keep in mind that I can't understand you, nyih.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_ohno
            },
            {
              txt: "Anyway! Seems like you picked up a bit of SP along the way here.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_wetotallygotthis
            }
          ]);
          game_handler.next_sequence();
        }
      },
      // We finkally draw the HUD for the first ᴛime in the game, waus
      {
        loc1: 0,
        main: function()
        {
          if (dialogue_active)
          {
            this.loc1 = 0;
            show_hud = false;
            ply.magic = 75 + random(0,22);
            return;
          }
          show_hud = true;
          ply.allow_shooting = true;
          ply.allow_specials = true;
          dialogue_handler.add_dialogues([
            {
              txt: "Check it!",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_confident
            },
            {
              txt: "Now, you can spend a bit of your own magic in order to perform a special attack. A skill, if you will, nyih.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria
            },
            {
              txt: "These kinds of attacks are obviously going to be stronger than your normal attacks and might even clear bullets, nyih. You can even charge it, nyih.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria
            },
            {
              txt: "It's built up by brushing up close to bullets around you, and each bullet gives you a different amount of SP depending on size.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria
            },
            {
              txt: "Or you could just attack something. That also gives you some SP, nyih.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_ohno
            },
            {
              txt: "Give it a go, will ya?",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_confident
            },
            {
              txt: "Don't worry about running out of SP, I'll make some bullets fire around you to keep it high enough for you to use, nyih!",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria_confident
            }
          ]);
          lv_vars.maria.has_atk_col = false;
          game_handler.next_sequence();
        }
      },
      // Specials testing!!
      {
        loc1: 0,
        loc2: 0,
        loc3: 0,
        got_hurt: false,
        used_special: false,
        main: function()
        {
          if (dialogue_active)
          {
            this.loc1 = 0;
            return;
          }
          
          this.loc3 += 2;
          this.loc3 = this.loc3 > 127 ? 127 : this.loc3;
          show_text("→[X]←",width / 2, height / 2, fonts.ts, 24, [255, 255, 255, this.loc3],CENTER);
          
          if (ply.is_hurt())
            this.got_hurt = true;
          
          if (ᴛime_stopped())
            return;
          
          if (ply.magic < 75)
            this.used_special = true;
          
          if (this.used_special)
            this.loc2++;
          
          this.loc1++;
          
          if (this.loc1 >= 60)
          {
            this.loc1 = 0;
            let p_x = ply.get_x();
            let p_y = ply.get_y();
            let len = 48;
            let parts = 20;
            let offset = random() * parts;
            let a = parts;
            while (a < 360 + offset)
            {
              b = new Bullet(p_x + len * Math.cos(a * PI / 180),p_y + len * Math.sin(a * PI / 180),0,10,"xl");
              b.set_angle(b.get_angle_to(ply) + 180);
              a += 360 / parts;
            }
            play_sound(snds.shot2);
          }
          
          let trigger_next = false;
          
          if (this.got_hurt)
          {
            trigger_next = true;
            dialogue_handler.add_dialogues([
              {
                txt: "Wh- HEY! ",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_panik
              },
              {
                txt: "Don't hurt yourself, nyih!!",
                font: fonts.ts,
                cutin: imgs.cutins.maria_panik
              },
              {
                txt: "I already specifically shot the bullets so they moved away faster than you could move, but I guess I was wrong, nyih...",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_ohno
              },
              {
                txt: "...",
                delay:20,
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.lily
              },
              {
                txt: "Anyways... ",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_ohno
              }
            ]);
          }
          else if (this.loc2 >= 600)
          {
            trigger_next = true;
            dialogue_handler.add_dialogues([
              {
                txt: "Good! You've got that down pat too!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              },
              {
                txt: "Alright. ",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              }
            ]);
          }
          
          if (trigger_next)
          {
            ply.allow_moving = false;
            ply.allow_shooting = false;
            ply.allow_specials = false;
            clear_bullets();
            clear_ply_bullets();
            game_handler.next_sequence();
          }
        }
      },
      // There are still more words to speak
      {
        main: function()
        {
          dialogue_handler.add_dialogues([
            {
              txt: "One last thing left.",
              font: fonts.ts,
              cutin: imgs.cutins.maria_confident
            },
            {
              txt: "I'm sure you've already noticed, but your SP bar becomes a different color when it fills up all the way.",
              override: true,
              font: fonts.ts,
              cutin: imgs.cutins.maria
            }
          ]);
          game_handler.next_sequence();
          if (ply.magic >= ply.max_magic)
            game_handler.next_sequence();
          else
            dialogue_handler.add_dialogues([,
              {
                txt: "Now if you can just please hold still...",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              }
            ]);
        }
      },
      // She's going to fill up your SP .v'
      {
        offset: 0,
        loc1: 0,
        main: function()
        {
          if (dialogue_active)
            return;
          
          this.loc1++;
          if (this.loc1 >= 2)
          {
            this.loc1 = 0;
            let p_x = ply.get_x();
            let p_y = ply.get_y();
            let len = 48;
            let parts = 5;
            let a = this.offset;
            while (a < 360 + this.offset)
            {
              b = new Bullet(p_x + len * Math.cos(a * PI / 180),p_y + len * Math.sin(a * PI / 180),0,10,"xl");
              b.set_angle(b.get_angle_to(ply) + 180);
              a += 360 / parts;
            }
            this.offset += 360 / 22;
            play_sound(snds.shot1);
          }
          
          if (ply.magic >= ply.max_magic)
          {
            clear_bullets();
            game_handler.next_sequence();
            if (this.offset >= 270)
              lv_vars.scawy = true;
          }
        }
      },
      // Even MORE dialogue
      {
        loc1: 0,
        main: function()
        {
          this.loc1++;
          
          if (this.loc1 >= 60)
          {
            ply.allow_moving = true;
            ply.allow_supers = true;
            ply.allow_shooting = true;
            if (lv_vars.scawy)
              dialogue_handler.add_dialogues([
                {
                  txt: "You held up pretty well under that kind of pressure, nyih~",
                  override: true,
                  font: fonts.ts,
                  cutin: imgs.cutins.maria_smug
                },
                {
                  txt: "...*paralyzed with fear*",
                  override: true,
                  font: fonts.ts,
                  cutin: imgs.cutins.lily
                },
              ]);
            dialogue_handler.add_dialogues([
              {
                txt: "Now, when you're at your full strength, you can unleash the strongest you got in ya, nyih.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              },
              {
                txt: "Most definitely makes you invincible, does massive damage, hell, even maybe works as a counter when you get hit, nyih! Who knows?",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria
              },
              {
                txt: "Now go give it a shot, nyih!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              }
            ]);
            game_handler.next_sequence();
          }
        }
      },
      // Last little bit where she teaches you about EX Supers
      {
        loc2: 0,
        loc3: 0,
        main: function()
        {
          if (dialogue_active)
            return;
          
          this.loc3 += 2;
          this.loc3 = this.loc3 > 127 ? 127 : this.loc3;
          show_text("[C]",width / 2, height / 2, fonts.ts, 24, [255, 255, 255, this.loc3], CENTER);
          
          if (ᴛime_stopped())
            return;
          
          if (ply.magic <= 0)
          {
            this.loc2++;
          }
          
          if (this.loc2 >= 120)
          {
            storeItem("tutorial_finished",true);
            ply.allow_moving = false;
            ply.allow_supers = false;
            ply.allow_shooting = false;
            ply.play_anim("idle");
            dialogue_handler.add_dialogues([
              {
                txt: "Great! Looks like you know your basics, nyih.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              },
              {
                txt: "...Except those things under your SP bar, nyih. Yeah, those are barriers. They'll block bullets once. Run out of them and you die, nyih.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria
              },
              {
                txt: "...",
                delay:20,
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.lily
              },
              {
                txt: "Now go out there and get 'em!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_confident
              },
              {
                txt: "...O-or whatever she told you to do.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.maria_ohno
              }
            ]);
            game_handler.next_sequence();
          }
        }
      },
      // Aaaaaaaand level clear!
      {
        loc1: 0,
        main: function()
        {
          if (dialogue_active)
            return;
          
          this.loc1++;
          
          if (this.loc1 == 2)
            create_ctrl_cheatsheet_btn();
          
          if(this.loc1 >= 5)
          {
            stage_clear = true;
            ply.health = 3;
            let m = lv_vars.maria;
            m.set_xsp(m.get_xsp() + 0.125);
            m.set_ysp(m.get_ysp() - 0.25);
            if (m.get_x() > width + 96)
              m.set_x(width + 96);
            if (m.get_y() < -96)
              m.set_y(-96);
          }
        }
      }
    ];
  },
  // ---------------------------------------------------------------------------------
  // Stage 1 (Claire)
  // ---------------------------------------------------------------------------------
  function()
  {
    let stage_seq = [
      {
        // Stage intro
        loc1: 0,
        a: 1,
        main: function()
        {
          this.loc1++;
          
          if (this.loc1 == 60)
            play_music(mus.stg1);
          
          if (this.loc1 > 60)
          {
            let n = this.loc1 - 60;
            if (n < 96)
              this.a++;
            
            if (n > 180)
              this.a--;
            show_text("Stage 1",width / 2, height / 3 - (n / 8), fonts.gold_disks, 64, [255, 255, 255, this.a], CENTER);
            show_text("Stage 1",width / 2, height / 3 - (n / 3) + 32, fonts.ts, 48, [255, 255, 255, this.a * 2.5], CENTER);
            show_text("Awake, anew, yet without a real purpose.\nThere is a lot to find out about yourself...",width / 2, height / 3 - (n / 5) + 96, fonts.ts, 22, [255, 255, 255, this.a * 1.5], CENTER);
            
            if (this.a <= -1)
              game_handler.next_sequence();
          }
        }
      },
      // Initial wave of enemies
      {
        loc1: 0,
        loc2: 0,
        enems: [],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          
          if (this.loc2 >= 10)
          {
            clear_enemies(true);
            game_handler.next_sequence();
            return;
          }
          
          this.loc1++;
          if (this.loc1 % 60 == 0)
          {
            for (let e of this.enems)
            {
              if (e && !e.can_remove())
              {
                let a = e.get_angle_to(ply);
                let ex = e.get_x();
                let ey = e.get_y();
                new Bullet(ex,ey,a,1.5);
                new Bullet(ex,ey,a - 15,1.5);
                new Bullet(ex,ey,a + 15,1.5);
                play_sound(snds.shot0);
              }
            }
          }
          
          if (this.loc1 % 90 == 0)
          {
            this.loc2++;
            let n_e = new Enemy(width + 48, height / 2 - 128 + 256 * random(), 24, imgs.enem.basic_a, "idle", 12, 0);
            n_e.set_xsp(-8);
            this.enems.push(n_e);
          }
          
          for (let e of this.enems)
          {
            if (e.get_x() < width || e.get_xsp() < 0)
              e.set_xsp(e.get_xsp() + 0.125);
            else
              e.destroy();
          }
        }
      },
      // Small cooldown period
      {
        loc1: 0,
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.loc1++;
          
          if (this.loc1 >= 120)
            game_handler.next_sequence();
        }
      },
      // Second wave of enemies
      {
        loc1: 0,
        loc2: 0,
        enems: [],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          this.loc1++;
          
          if(this.loc2 < 12) 
          {
            if (this.loc1 % 60 == 0)
            {
              this.loc2++;
              let n_e = new Enemy(width - 48, height + 48, 24, imgs.enem.basic_b, "idle", 3, 0);
              n_e.set_xsp(-3);
              n_e.set_ysp(-5);
              this.enems.push(n_e);
            }

            if ((this.loc1 + 30) % 60 == 0)
            {
              this.loc2++;
              let n_e = new Enemy(width - 48, -48, 24, imgs.enem.basic_b, "idle", 3, 0);
              n_e.set_xsp(-3);
              n_e.set_ysp(5);
              this.enems.push(n_e);
            }
          }
          else if (this.loc2 == 12)
          {
            this.loc2++;
            this.loc1 = 0;
          }
          else
          {
            this.loc1++;
            if (this.loc1 >= 180)
              game_handler.next_sequence();
          }
          
          for (let e of this.enems)
          {
            if (!e.timer)
              e.timer = 0;
            
            e.timer++;
            
            if (e.timer == 40)
            {
              let a = e.get_angle_to(ply);
              let ex = e.get_x();
              let ey = e.get_y();
              new Bullet(ex,ey,a,2,"m",1);
              new Bullet(ex,ey,a - 10,1.5,"m",1);
              new Bullet(ex,ey,a + 10,1.5,"m",1);
              new Bullet(ex,ey,a - 20,1,"m",1);
              new Bullet(ex,ey,a + 20,1,"m",1);
              play_sound(snds.shot0);
            }
          }
        }
      },
      // Third wave of enemies
      {
        loc1: 0,
        loc2: 0,
        enems: [],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          // Logic for creating items on death
          for (let e of this.enems)
            if (e.can_remove())
              new OrbItem(e.get_x(),e.get_y(),5,0);
          this.enems = this.enems.filter((e) => !e.can_remove());
          this.loc1++;
          
          if (this.loc1 == 1)
          {
            let n_e = new Enemy(width + 48, 96, 24, imgs.enem.basic_c, "idle", 75, 0);
            n_e.set_xsp(-10);
            n_e.timer = 0;
            this.enems.push(n_e);
            let n_e2 = new Enemy(width + 48, height - 96, 24, imgs.enem.basic_c, "idle", 75, 0);
            n_e2.set_xsp(-10);
            n_e2.timer = 0;
            this.enems.push(n_e2);
          }
          
          for (let e of this.enems)
          {
            e.timer++;
            
            if (e.timer < 180)
              e.set_xsp(e.get_xsp() * 0.9752);
            else if (e.timer >= 180 && e.timer < 600)
              e.set_xsp(0);
            else
              e.set_xsp(e.get_xsp() + 0.15);
            
            if (e.timer > 120 && e.timer % 60 == 0)
            {
              let offset = e.get_angle_to(ply) + 18;
              let a = offset;
              let ex = e.get_x();
              let ey = e.get_y();
              while (a < 360 + offset)
              {
                new Bullet(ex,ey,a,1,"m",2);
                a += 36;
              }
              play_sound(snds.shot0);
            }
            
            if (e.timer >= 300 && e.timer % 120 == 0)
            {
              let a = e.get_angle_to(ply);
              let ex = e.get_x();
              let ey = e.get_y();
              for (let i = 1; i <= 3; i++)
              {
                new Bullet(ex,ey,a,2 + i / 2,"m",1);
                new Bullet(ex,ey,a + 20,1 + i / 2,"m",3);
                new Bullet(ex,ey,a - 20,1 + i / 2,"m",3);
              }
              play_sound(snds.shot1);
            }
          }
          
          if (this.loc1 > 3 && this.enems.length <= 0)
            this.loc2++;
          
          if (this.loc2 >= 180)
            game_handler.next_sequence();
        }
      },
      // Even more enemies
      {
        loc1: 0,
        enems: [],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          this.loc1++;
          
          if (this.loc1 % 120 == 0 && this.loc1 < 600)
          {
            let n_e = new Enemy(width + 48, height / 2 - 32, 24, imgs.enem.basic_c, "idle", 40, 0);
            n_e.timer = -30;
            n_e.set_xsp(-2.5);
            this.enems.push(n_e);
            
            let n_e2 = new Enemy(width + 48, height / 2 + 32, 24, imgs.enem.basic_c, "idle", 40, 0);
            n_e2.timer = -30;
            n_e2.set_xsp(-2.5);
            this.enems.push(n_e2);
          }
          
          for (let e of this.enems)
          {
            if (e.get_x() > 0)
              e.timer++;
            
            if (e.timer >= 90)
            {
              e.timer = 0;
              let rnd = random() * 36;
              let a = rnd;
              let ex = e.get_x();
              let ey = e.get_y();
              while (a < 360 + rnd)
              {
                new Bullet(ex,ey,a,1,"m",2);
                a += 36;
              }
              play_sound(snds.shot0);
            }
          }
          
          if (this.loc1 >= 750)
            game_handler.next_sequence();
        }
      },
      // Oh look, it's Claire
      {
        loc1: 0,
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.loc1++;
          if (this.loc1 == 1)
          {
            clear_bullets();
            lv_vars.claire = new Boss(width + 48, 0, 32, imgs.enem.claire, "idle", 1000);
            let c = lv_vars.claire;
            c.has_ply_col = false;
            c.has_atk_col = false;
            c.offscreen_remove = false;
          }
          
          let c = lv_vars.claire;
          if (c)
          {
            c.set_x(width - 128 + 176 / (this.loc1 / 5));
            c.set_y(height / 2 - (height / 2) / (this.loc1 / 5));
            
            if (abs(c.get_x() - (width - 128)) <= 24)
              game_handler.next_sequence();
          }
        }
      },
      // Now Claire attacks you
      {
        loc1: 0,
        target: [0,0],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.loc1++;
          
          let c = lv_vars.claire;
          if (c)
          {
            if (this.loc1 >= 60)
            {
              c.has_ply_col = true;
              c.has_atk_col = true;
              if (this.loc1 == 60)
              {
                this.target[0] = width / 2 + width / 3 * random();
                this.target[1] = height / 4 + height / 2 * random();
              }
              
              let diff_x = this.target[0] - c.get_x();
              let diff_y = this.target[1] - c.get_y();
              
              c.set_x(c.get_x() + diff_x / 20);
              c.set_y(c.get_y() + diff_y / 20);
              
              if (this.loc1 % 45 == 0)
              {
                let a = c.get_angle_to(ply);
                let cx = c.get_x();
                let cy = c.get_y();
                for (let i = 1; i < 3; i++)
                {
                  new Bullet(cx,cy,a,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a - 30,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a + 30,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a - 60,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a + 60,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a - 90,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a + 90,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a - 120,2 * i / 2, "m", 2);
                  new Bullet(cx,cy,a + 120,2 * i / 2, "m", 2);
                }
                play_sound(snds.shot0);
              }
              
              if (this.loc1 > 360)
              {
                this.loc1 = 59;
                let to_ply = c.get_angle_to(ply);
                let a = to_ply;
                let cx = c.get_x();
                let cy = c.get_y();
                while (a < 360 + to_ply)
                {
                  new Bullet(cx,cy,a,5,"l");
                  a += 60;
                }
                play_sound(snds.shot2);
              }
            }
            
            if (c.health < 750)
            {
              clear_bullets();
              c.play_anim("hurt");
              c.health = 1000;
              c.has_ply_col = false;
              c.has_atk_col = false;
              c.invin_timer = 300;
              c.show_positioner = false;
              new OrbItem(c.get_x(),c.get_y(),4,-2 + random(4));
              new BarrierItem(c.get_x(),c.get_y(),4,-2 + random(4));
              shake_screen(8,30);
              play_sound(snds.enem_die);
              game_handler.next_sequence();
            }
          }
        }
      },
      // Claire runs away!!!
      {
        loc1: 0,
        main: function()
        {
          if (ᴛime_stopped())
            return;
          this.loc1++;
          
          let c = lv_vars.claire;
          if (c)
          {
            if (this.loc1 >= 60 && this.loc1 < 120)
            {
              c.play_anim("idle");
              c.set_xsp(c.get_xsp() + 0.0625);
              c.set_ysp(c.get_ysp() - 0.125);
            }
            
            if (this.loc1 > 180)
            {
              c.set_xsp(0);
              c.set_ysp(0);
              c.set_x(width + 48);
              c.set_y(-48);
              game_handler.next_sequence();
            }
          }
        }
      },
      // More enemies ᴛime
      {
        loc1: 0,
        enems: [],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          this.loc1++;
          
          // Kill bullets of ded enemies
          for (let e of this.enems)
            if (e.can_remove() && e.bullets && e.bullets.length > 0)
              for (let b of e.bullets)
                b.destroy();
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          
          if (this.loc1 == 60)
          {
            let n_e = new Enemy(width - 48, height / 2, 24, imgs.enem.basic_a, "idle", 50, 0);
            n_e.timer = 0;
            n_e.set_xsp(-12);
            this.enems.push(n_e);
          }
          
          if (this.loc1 == 120)
          {
            let n_e = new Enemy(width - 48, height / 4, 24, imgs.enem.basic_a, "idle", 50, 0);
            n_e.timer = 0;
            n_e.set_xsp(-12);
            this.enems.push(n_e);
            
            let n_e2 = new Enemy(width - 48, height * 0.75, 24, imgs.enem.basic_a, "idle", 50, 0);
            n_e2.timer = 0;
            n_e2.set_xsp(-12);
            this.enems.push(n_e2);
          }
          
          for (let e of this.enems)
          {
            e.timer++;
            
            if (e.bullets == null)
              e.bullets = [];
            
            if (e.timer < 60)
              e.set_xsp(e.get_xsp() * 0.9);
            
            if (e._angle == null)
              e._angle = 0;
            
            if (e.timer >= 90 && e._angle > -360)
            {
              e.bullets.push(new Bullet(e.x, e.y, e._angle, 12));
              
              e._angle -= 18;
              
              play_sound(snds.shot0);
            }
            
            for (let b of e.bullets)
            {
              if (b.timer == null)
                b.timer = 0;
              
              b.timer++;
              
              if (b.timer < 60)
                b.set_speed(b.get_speed() * 0.75);
              else if (b.get_speed() < 5)
                b.set_speed(b.get_speed() + 0.125);
            }
            
            if (e.timer > 120)
            {
              e.timer = 120;
              if (e.get_xsp() > -4)
                e.set_xsp(e.get_xsp() - 0.125);
            }
          }
          
          if (this.loc1 >= 300)
            game_handler.next_sequence();
        }
      },
      // Second wave post-midboss
      {
        loc1: 0,
        loc2: 0,
        enems: [],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          this.loc1++;
          
          if(this.loc2 < 12) 
          {
            if (this.loc1 % 60 == 0)
            {
              this.loc2++;
              let n_e = new Enemy(width - 48, height + 48, 24, imgs.enem.basic_b, "idle", 3, 0);
              n_e.set_xsp(-1);
              n_e.set_ysp(-6);
              this.enems.push(n_e);
            }

            if ((this.loc1 + 30) % 60 == 0)
            {
              this.loc2++;
              let n_e = new Enemy(width - 48, -48, 24, imgs.enem.basic_b, "idle", 3, 0);
              n_e.set_xsp(-1);
              n_e.set_ysp(6);
              this.enems.push(n_e);
            }
          }
          else if (this.loc2 == 18)
          {
            this.loc2++;
            this.loc1 = 0;
          }
          else
          {
            this.loc1++;
            if (this.loc1 >= 180)
              game_handler.next_sequence();
          }
          
          for (let e of this.enems)
          {
            if (!e.timer)
              e.timer = 0;
            
            e.timer++;
            
            if (e.timer % 30 == 0)
            {
              let a = e.get_angle_to(ply);
              let ex = e.get_x();
              let ey = e.get_y();
              new Bullet(ex,ey,a,1.5,"m",1);
              new Bullet(ex,ey,a - 15,1.5,"m",1);
              new Bullet(ex,ey,a + 15,1.5,"m",1);
              new Bullet(ex,ey,a - 30,1.5,"m",1);
              new Bullet(ex,ey,a + 30,1.5,"m",1);
              play_sound(snds.shot0);
            }
          }
        }
      },
      // Third wave post-midboss
      // Oh god, they immediately go straight to their second attacks this ᴛime
      // AND THERE ARE THREE OF THEM
      {
        loc1: 0,
        loc2: 0,
        enems: [],
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          // Logic for creating items on death
          for (let e of this.enems)
            if (e.can_remove())
              new OrbItem(e.get_x(),e.get_y(),5,0);
          this.enems = this.enems.filter((e) => !e.can_remove());
          this.loc1++;
          
          if (this.loc1 == 1)
          {
            let n_e = new Enemy(width + 48, 96, 24, imgs.enem.basic_c, "idle", 75, 0);
            n_e.set_xsp(-8);
            n_e.timer = 0;
            this.enems.push(n_e);
            let n_e2 = new Enemy(width + 48, height / 2, 24, imgs.enem.basic_c, "idle", 75, 0);
            n_e2.set_xsp(-8);
            n_e2.timer = 0;
            this.enems.push(n_e2);
            let n_e3 = new Enemy(width + 48, height - 96, 24, imgs.enem.basic_c, "idle", 75, 0);
            n_e3.set_xsp(-8);
            n_e3.timer = 0;
            this.enems.push(n_e3);
          }
          
          for (let e of this.enems)
          {
            e.timer++;
            
            if (e.timer < 180)
              e.set_xsp(e.get_xsp() * 0.9752);
            else if (e.timer >= 180 && e.timer < 600)
              e.set_xsp(0);
            else
              e.set_xsp(e.get_xsp() + 0.15);
            
            if (e.timer > 120 && e.timer % 90 == 0)
            {
              let a = e.get_angle_to(ply);
              let ex = e.get_x();
              let ey = e.get_y();
              for (let i = 1; i <= 3; i++)
              {
                new Bullet(ex,ey,a,2 + i / 2,"m",1);
                new Bullet(ex,ey,a + 20,1 + i / 2,"m",3);
                new Bullet(ex,ey,a - 20,1 + i / 2,"m",3);
              }
              play_sound(snds.shot1);
            }
          }
          
          if (this.loc1 > 3 && this.enems.length <= 0)
            this.loc2++;
          
          if (this.loc2 >= 180)
          {
            clear_bullets();
            clear_ply_bullets();
            ply.allow_supers = false;
            ply.allow_shooting = false;
            ply.allow_specials = false;
            game_handler.next_sequence();
          }
        }
      },
      // Claire returns!
      {
        loc1: 0,
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.loc1++;
          
          let c = lv_vars.claire;
          if (c)
          {
            c.set_xsp(0);
            c.set_ysp(0);
            c.set_x(width - 128 + 176 / (this.loc1 / 5));
            c.set_y(height / 2 - (height / 2) / (this.loc1 / 5));
            c.show_positioner = true;
            
            if (abs(c.get_x() - (width - 128)) <= 24)
              game_handler.next_sequence();
          }
        }
      },
      // Speak WORDS
      {
        loc1: 0,
        main: function()
        {
          if (ᴛime_stopped())
            return;
          
          this.loc1++;
          
          if (this.loc1 >= 30)
          {
            dialogue_handler.add_dialogues([
              {
                txt: "...",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire
              },
              {
                txt: "You. Chimera. Fight me.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_fiteme
              },
              {
                txt: "...",
                delay:20,
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.lily
              },
              {
                txt: "Don't give me that look. You know damn well what you're capable of.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_fiteme
              },
              {
                txt: "Now fight me.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_fiteme
              },
              {
                txt: "Is this what Maria meant when people said they picked fights?",
                override: true,
                font: fonts.xlo,
                cutin: imgs.cutins.lily
              },
              {
                txt: "...\n(Not how I expected her to talk at all.)",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_uhh
              },
              {
                txt: "You better not be trash-talking me.",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_angy
              },
              {
                txt: "That was offensive?",
                override: true,
                font: fonts.xlo,
                cutin: imgs.cutins.lily_wau
              },
              {
                txt: "Stop it! Stop it with those words and just fight me already!!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_seething,
                func: function()
                {
                  stop_music();
                }
              }
            ]);
            game_handler.next_sequence();
          }
        }
      },
      // First boss attack!
      {
        loc1: 0,
        loc2: 0,
        a: 0,
        a2: 0,
        offset: 0,
        target: [0,0],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          let c = lv_vars.claire;
          
          if (this.loc1 == 2)
          {
            play_music(mus.stg1b);
            c.health = 1000;
            c.has_ply_col = true;
            c.has_atk_col = true;
            
            ply.allow_supers = true;
            ply.allow_shooting = true;
            ply.allow_specials = true;
          }
          
          if (c)
          {
            if (this.loc1 >= 60)
            {
              if (this.loc1 == 60)
              {
                this.target[0] = width / 2 + width / 3 * random();
                this.target[1] = height / 4 + height / 2 * random();
                this.offset = c.get_angle_to(ply);
                this.a = this.offset;
                this.loc2 = 0;
              }
              
              let diff_x = this.target[0] - c.get_x();
              let diff_y = this.target[1] - c.get_y();
              
              c.set_x(c.get_x() + diff_x / 10);
              c.set_y(c.get_y() + diff_y / 10);
              
              let cx = c.get_x();
              let cy = c.get_y();
              
              if (this.a < 360 + this.offset)
              {
                new Bullet(cx,cy,this.a,1,"m",2);
                new Bullet(cx,cy,this.a,1.75,"m",2);
                this.a += 360 / 20;
                play_sound(snds.shot0);
                this.a2 = c.get_angle_to(ply);
              }
              else
                this.loc2++;
              
              if (this.loc2 % 10 == 0 && this.loc2 < 31 && this.loc2 > 4)
              {
                new Bullet(cx,cy,this.a2,3,"l");
                new Bullet(cx,cy,this.a2 + 10,3,"l");
                new Bullet(cx,cy,this.a2 - 10,3,"l");
                play_sound(snds.shot1);
              }
              
              if (this.loc2 > 0 && this.loc2 < 45)
                c.play_anim("atk");
              else
                c.play_anim("idle");
              
              if (this.loc1 >= 210)
                this.loc1 = 59;
            }
            
            if (c.health <= 800)
            {
              clear_bullets();
              c.play_anim("hurt");
              c.health = 1000;
              c.invin_timer = 180;
              shake_screen(8,30);
              play_sound(snds.enem_die);
              game_handler.next_sequence();
            }
          }
        }
      },
      // First boss Special attack!
      {
        loc1: 0,
        loc2: 0,
        loc3: 0,
        target: [0,0],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          let c = lv_vars.claire;
          
          if (c)
          {
            if (this.loc1 >= 60)
              c.play_anim("idle");
            
            if (this.loc1 == 119)
            {
              let p = new Particle(c.get_x(),c.get_y(),imgs.particle.special);
              p.scale = 6;
              p.tint[3] = 127;
              shake_screen(4,180);
              play_sound(snds.special);
            }
            
            if (this.loc1 >= 180)
            {
              this.loc2++;
              if (this.loc1 == 180)
              {
                this.target[0] = width * 2 / 3 + width / 4 * random();
                this.target[1] = max(96, min(height - 96, c.get_y() - 16 + 32 * random()));
              }
              
              let diff_x = this.target[0] - c.get_x();
              let diff_y = this.target[1] - c.get_y();
              
              c.set_x(c.get_x() + diff_x / 5);
              c.set_y(c.get_y() + diff_y / 5);
              
              let cx = c.get_x();
              let cy = c.get_y();
              
              if (this.loc2 >= 240)
              {
                this.loc2 = 209;
                let offset = random() * 360;
                let a = offset;
                while (a < 360 + offset)
                {
                  new Bullet(cx,cy,a,3,"m",2);
                  a += 36;
                }
              }
              
              if (this.loc1 >= 200)
              {
                if (this.loc3 >= 3)
                {
                  this.loc3 = 2;
                  let a = c.get_angle_to(ply);
                  new Bullet(cx,cy,a,4,"l");
                  new Bullet(cx,cy,a,4.5,"l");
                  new Bullet(cx,cy,a,5,"l");
                  new Bullet(cx,cy,a,5.5,"l");
                  new Bullet(cx,cy,a,6,"l");
                  play_sound(snds.shot2);
                }
                else
                  this.loc3++;
                this.loc1 = 179;
              }
            }
            
            if (c.health <= 750)
            {
              clear_bullets();
              c.play_anim("hurt");
              c.health = 1000;
              c.invin_timer = 180;
              shake_screen(8,30);
              play_sound(snds.enem_die);
              game_handler.next_sequence();
              new BarrierItem(c.get_x(),c.get_y(),4,-2 + random(4));
            }
          }
        }
      },
      // Second boss attack!
      {
        loc1: 0,
        a: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          let c = lv_vars.claire;
          
          if (c)
          {
            let cx = c.get_x();
            let cy = c.get_y();
            
            if (this.loc1 >= 60)
              c.play_anim("idle");
            
            if (this.loc1 >= 120)
            {
              if (this.loc1 == 120)
              {
                c.set_xsp(-1.5 + random() * 3);
                c.set_ysp(-1.5 + random() * 3);
              }
              
              if (this.loc1 % 20 == 0)
              {
                for (let i = this.a; i < 360 + this.a; i += 36)
                  new Bullet(cx,cy,i,1.5,"m",2);
                play_sound(snds.shot0);
                this.a = (this.a + 20) % 360;
              }
              
              // Bounds
              if (cx > width - 96)
                c.set_xsp(-abs(c.get_xsp()));
              if (cx < width / 2)
                c.set_xsp(abs(c.get_xsp()));
              if (cy > height - 96)
                c.set_ysp(-abs(c.get_ysp()));
              if (cy < 96)
                c.set_ysp(abs(c.get_ysp()));
              
              if (this.loc1 >= 270)
              {
                this.loc1 = 119;
              }
            }
            
            if (c.health <= 800)
            {
              clear_bullets();
              c.set_xsp(0);
              c.set_ysp(0);
              c.health = 1000;
              c.invin_timer = 180;
              c.play_anim("hurt");
              shake_screen(8,30);
              play_sound(snds.enem_die);
              game_handler.next_sequence();
            }
          }
        }
      },
      // Second boss Special attack!!
      {
        a: 0,
        d: 0,
        loc1: 0,
        loc2: 0,
        loc3: 0,
        height_var: height / 3,
        target: [0,0],
        fake_bullets: [],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.fake_bullets = this.fake_bullets.filter((b) => !b.can_remove());
          this.loc1++;
          
          for (let b of this.fake_bullets)
          {
            b.timer++;
            if (b.timer > 45)
              b.destroy();
          }
          
          let c = lv_vars.claire;
          
          if (c)
          {
            let cx = c.get_x();
            let cy = c.get_y();
            
            if (this.loc1 >= 60)
              c.play_anim("idle");
            
            if (this.loc1 == 119)
            {
              let p = new Particle(c.get_x(),c.get_y(),imgs.particle.special);
              p.scale = 6;
              p.tint[3] = 127;
              shake_screen(4,180);
              play_sound(snds.special);
            }
            
            if (this.loc1 >= 180)
            {
              this.loc2++;
              
              if (this.loc2 >= 30)
              {
                this.loc2 = 0;
                let ofs = c.get_angle_to(ply);
                let ang = ofs;
                while (ang < 360 + ofs)
                {
                  new Bullet(cx,cy,ang,1,"m",2);
                  ang += 60;
                }
                play_sound(snds.shot0);
              }
              
              if (this.loc1 == 180)
              {
                this.target[0] = width * 2 / 3 + width / 4 * random();
                this.target[1] = height / 2 + random() * this.height_var;
                this.height_var *= -1;
              }
              
              let diff_x = this.target[0] - c.get_x();
              let diff_y = this.target[1] - c.get_y();
              
              c.set_x(c.get_x() + diff_x / 7);
              c.set_y(c.get_y() + diff_y / 7);
              
              if (this.loc1 >= 250)
              {
                c.play_anim("atk");
                if (this.loc1 == 250)
                {
                  this.a = c.get_angle_to(ply);
                  shake_screen(7,30);
                }
                if (this.d < width * 0.875)
                {
                  this.d += 32;
                  let loc_ang = this.a / 180 * PI;
                  let xoffset = this.d * Math.cos(loc_ang);
                  let yoffset = -this.d * Math.sin(loc_ang);
                  let b = new Bullet(cx + xoffset, cy + yoffset, this.a, 0, "l", 0, true, true);
                  b.timer = 0;
                  this.fake_bullets.push(b);
                }
                else
                  this.loc3++;
                
                if (this.loc3 >= 5 && this.loc3 < 15)
                {
                  new Bullet(cx, cy, this.a - 1, 20, "l");
                  new Bullet(cx, cy, this.a + 1, 20, "l");
                  play_sound(snds.shot2);
                }
                
                if (this.loc3 >= 60)
                {
                  this.d = 0;
                  this.loc1 = 179;
                  this.loc3 = 0;
                }
              }
            }
            
            if (c.health <= 750)
            {
              clear_bullets();
              c.play_anim("hurt");
              c.health = 1000;
              c.invin_timer = 180;
              shake_screen(8,30);
              play_sound(snds.enem_die);
              game_handler.next_sequence();
              new OrbItem(c.get_x(),c.get_y(),4,-2 + random(4));
            }
          }
        }
      },
      // Final attack!!!
      {
        a: 0,
        d: 0,
        loc1: 0,
        loc2: 0,
        target: [width * 0.75, height / 2],
        loc_bullets: [],
        fake_bullets: [],
        main: function()
        {
          if (game_frozen())
            return;
          this.fake_bullets = this.fake_bullets.filter((b) => !b.can_remove());
          this.loc1++;
          
          let c = lv_vars.claire;
          
          for (let b of this.fake_bullets)
          {
            b.timer++;
            
            if (b.timer >= 120)
            {
              let bx = b.get_x();
              let by = b.get_y();
              let b1 = new Bullet(bx, by, b.__ang, 0, "m", 2);
              let b2 = new Bullet(bx, by, b.__ang - 50, 0, "m", 2);
              let b3 = new Bullet(bx, by, b.__ang + 50, 0, "m", 2);
              this.loc_bullets.push(b1);
              this.loc_bullets.push(b2);
              this.loc_bullets.push(b3);
              b.destroy();
            }
          }
          
          this.loc_bullets = this.loc_bullets.filter((b) => !b.can_remove());
          
          for (let b of this.loc_bullets)
            if (!b.can_remove())
              b.set_speed(min(2.5,b.get_speed() + 0.03125));
          
          if (c)
          {
            let cx = c.get_x();
            let cy = c.get_y();
            
            if (this.loc1 >= 240)
              c.play_anim("atk");
            else if (this.loc1 >= 60)
              c.play_anim("idle");
            
            if (this.loc2 > 0)
              this.loc2++;
            
            if (this.loc2 >= 76)
            {
              let ofs = c.get_angle_to(ply);
              let ang = ofs;
              while (ang < 360 + ofs)
              {
                new Bullet(cx, cy, ang, 1, "l");
                play_sound(snds.shot0);
                ang += 36;
              }
              this.loc2 = 1;
            }
            
            if (this.loc1 == 120)
            {
              let p = new Particle(c.get_x(),c.get_y(),imgs.particle.special);
              p.scale = 6;
              p.tint[3] = 127;
              c.invin_timer = 180;
              shake_screen(4,180);
              play_sound(snds.special);
            }
            
            if (this.loc1 >= 180)
            {
              let diff_x = this.target[0] - c.get_x();
              let diff_y = this.target[1] - c.get_y();
              
              c.set_x(c.get_x() + diff_x / 10);
              c.set_y(c.get_y() + diff_y / 10);
            }
            
            if (this.loc1 >= 240)
            {
              if (this.loc1 < 270)
              {
                shake_screen(4,4);
              }
              else
              {
                if (this.loc1 == 270)
                {
                  this.a = c.get_angle_to(ply);
                  shake_screen(10,60);
                  play_sound(snds.special);
                }
                
                if (this.d < width * 0.875)
                {
                  this.d += 96;
                  let a1 = this.a;
                  let loc_ang = a1 / 180 * PI;
                  let xoffset = this.d * Math.cos(loc_ang);
                  let yoffset = -this.d * Math.sin(loc_ang);
                  let b = new Bullet(cx + xoffset, cy + yoffset, a1, 0, "xl", 0, true, true);
                  b.__ang = a1;
                  b.timer = 0;
                  this.fake_bullets.push(b);
                  
                  a1 = this.a + 45;
                  loc_ang = a1 / 180 * PI;
                  xoffset = this.d * Math.cos(loc_ang);
                  yoffset = -this.d * Math.sin(loc_ang);
                  b = new Bullet(cx + xoffset, cy + yoffset, a1, 0, "xl", 0, true, true);
                  b.__ang = a1;
                  b.timer = 0;
                  this.fake_bullets.push(b);
                  
                  a1 = this.a - 45;
                  loc_ang = a1 / 180 * PI;
                  xoffset = this.d * Math.cos(loc_ang);
                  yoffset = -this.d * Math.sin(loc_ang);
                  b = new Bullet(cx + xoffset, cy + yoffset, a1, 0, "xl", 0, true, true);
                  b.__ang = a1;
                  b.timer = 0;
                  this.fake_bullets.push(b);
                  play_sound(snds.shot2);
                }
              }
              
              if (this.loc1 >= 420)
              {
                this.d = 0;
                this.loc1 = 239;
                if (this.loc2 < 1)
                  this.loc2 = 1;
              }
            }
            
            if (c.health <= 500)
            {
              clear_bullets();
              c.health = 1000;
              c.play_anim("hurt");
              c.invin_timer = 180;
              c.has_ply_col = false;
              play_sound(snds.enem_die);
              game_handler.next_sequence();
            }
          }
        }
      },
      // Claire ded
      // rip
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 < 100)
          {
            shake_screen(4,4);
            if (this.loc1 % 30 == 0)
              play_sound(snds.enem_die);
          }
          else if (this.loc1 == 120)
          {
            let c = lv_vars.claire;
            
            if (c)
            {
              new OrbItem(c.get_x(),c.get_y(),4,-2 + random(4));
              new OrbItem(c.get_x(),c.get_y(),4,-2 + random(4));
              new BarrierItem(c.get_x(),c.get_y(),4,-2 + random(4));
              c.die(true);
              lv_vars.claire = null;
            }
          }
          
          if (this.loc1 >= 360)
          {dialogue_handler.add_dialogues([
              {
                txt: "Ouch! Fine, you win!!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_ouch
              },
              {
                txt: "...",
                delay:20,
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.lily
              },
              {
                txt: "Stop looking at me like that!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_ouch
              },
              {
                txt: "(I can't believe I lost to a newbie, of all things...)\n(How can I prove my superiority if I lost to someone who just started existing?!)",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_seethingouch
              },
              {
                txt: "Do you have a superiority complex?",
                override: true,
                font: fonts.xlo,
                cutin: imgs.cutins.lily
              },
              {
                txt: "I don't know what you said, but SHUT UP!! Just get out of here already, I'm through with you!!!",
                override: true,
                font: fonts.ts,
                cutin: imgs.cutins.claire_seethingouch
              },
              {
                txt: "...If you say so.",
                override: true,
                font: fonts.xlo,
                cutin: imgs.cutins.lily
              }
            ]);
            game_handler.next_sequence();
          }
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 >= 3)
          {
            stage_clear = true;
          }
        }
      }
    ];
    
    stage_seq.bg = bgs.night;
    
    return stage_seq;
  },
  // ---------------------------------------------------------------------------------
  // Stage 2 (End of demo but not really)
  // ---------------------------------------------------------------------------------
  function()
  {
    let stage_seq = [
      {
        a: 0,
        loc1: 0,
        not_main: function()
        {
          if (this.loc1 >= 60)
          {
            let n = this.loc1 - 60;
            if (n < 96)
              this.a++;
            if (n > 120)
              n = 120;
            show_text("End of Demo",width / 2, height / 3 - (n / 8), fonts.gold_disks, 64, [255, 255, 255, this.a], CENTER);
            show_text("End of Demo",width / 2, height / 3 - (n / 3) + 32, fonts.ts, 48, [255, 255, 255, this.a * 2.5], CENTER);
            show_text("Thank you for playing!",width / 2, height / 3 - (n / 5) + 96, fonts.ts, 22, [255, 255, 255, this.a * 1.5], CENTER);
          }
          
          if (game_frozen())
            return;
          
          this.loc1++;
        }
      },
      // Just kidding, Stage 2 jumpscare! >:D
      {
        a: 0,
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 == 60)
          {
            play_music(mus.stg2);
            // Some trees in the BG
            // WHY IS THIS SO LAGGY AAAAAAAAAAAAAAAAAAAAAAA
            /*
            for (let i = 0; i < 16; i++)
            {
              if (true)
              {
                let ratio = 0.25 + (i / 10) * 0.25;
                let b = new BGObject(1.5 * width * random(), height - 192 + random(32));
                b._xo = random(48);
                b._yo = random(32);
                b.set_xsp(-0.5 * ratio);
                b.set_sprite(imgs.bgo["tree" + round(random(3))]);
                let s = b.get_sprite();
                s.scale_x = 2;
                s.scale_y = 2;
                let f = function(obj)
                {
                  if (obj.get_x() < -192 - obj._xo)
                    obj.set_x(992 + obj._xo);
                }
                b.add_tick_func(f);
              }
              if (i == 4 || i == 8)
              {
                let bawx = new BGObject(width / 2, height / 2);
                bawx.set_sprite(imgs.bgo.bawx);
                bawx.__timer = -(20 - (i + 1)) * 10;
                let s = bawx.get_sprite();
                s.scale_x = 2;
                s.scale_y = 2;
                let f = function(obj)
                {
                  if (obj.__timer < 96)
                  {
                    obj.__timer += 0.5;
                    let t = obj.__timer;

                    let spr = obj.get_sprite();
                    spr.tint[3] = 255 - t;
                  }
                  else
                  {
                    obj.get_sprite().tint[3] = 160;
                    obj.clear_tick_funcs();
                  }
                }
                bawx.add_tick_func(f);
              }
            }*/
            
            // New trees in the BG thing
            let f = function(obj)
            {
              if (obj.get_x() < -1600)
              {
                obj.set_sprite(imgs.bgo["trees" + round(random(3))]);
                let s = obj.get_sprite();
                if (s)
                {
                  s.scale_x = 2;
                  s.scale_y = 2;
                }
                obj.set_x(1600 + width);
                obj.set_y(height - 192 + random(32));
              }
            }
            let f2 = function(obj)
            {
              if (obj.__timer < 160)
              {
                obj.__timer++;
                let t = obj.__timer;
                let spr = obj.get_sprite();
                spr.tint[3] = 255 - t;
              }
              else
              {
                obj.get_sprite().tint[3] = 96;
                obj.clear_tick_funcs();
              }
            }
            for (let i = 0; i < 2; i++)
            {
              for (let k = 0; k < 2; k++)
              {
                let b = new BGObject(1600 + 1600 * k, height - 192 + random(32));
                b.set_xsp(-0.125 - (i * 0.125));
                b.offscreen_remove = false;
                b.set_sprite(imgs.bgo["trees" + round(random(3))]);
                let s = b.get_sprite();
                if (s)
                {
                  s.scale_x = 2;
                  s.scale_y = 2;
                }
                b.add_tick_func(f);
              }
              if (true)
              {
                let bawx = new BGObject(width / 2, height / 2);
                bawx.set_sprite(imgs.bgo.bawx);
                bawx.__timer = -120 + (i * 60);
                let s = bawx.get_sprite();
                s.scale_x = 2;
                s.scale_y = 2;
                bawx.add_tick_func(f2);
              }
            }
          }
          
          if (this.loc1 > 60)
          {
            let n = this.loc1 - 60;
            if (n < 96)
              this.a++;
            
            if (n > 240)
              this.a--;
            show_text("Stage 2",width / 2, height / 3 - (n / 8), fonts.gold_disks, 64, [255, 255, 255, this.a], CENTER);
            show_text("Stage 2",width / 2, height / 3 - (n / 3) + 32, fonts.ts, 48, [255, 255, 255, this.a * 2.5], CENTER);
            show_text("The forest is dim. It always has been. Kuaze and kaize lurk amok.\nBut hasn't it always been like that, long before civilization claimed this world?",width / 2, height / 3 - (n / 5) + 96, fonts.ts, 22, [255, 255, 255, this.a * 1.5], CENTER);
            
            if (this.a <= -1)
              game_handler.next_sequence();
          }
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 > 120 && this.loc1 < 300)
          {
            if (this.loc1 % 60 == 0)
            {
              let n_e = new Enemy(width - 128, height + 48, 28, imgs.enem.basic_a, "idle", 40, 0);
              n_e.set_ysp(-10);
              n_e.__timer = 0;
              let b = function(unused_lol)
              {
                n_e.__timer++;
                let t = n_e.__timer;
                if (t < 60)
                {
                  n_e.set_ysp(n_e.get_ysp() * 0.925);
                }
                else if (t < 90)
                {
                  n_e.set_ysp(0);
                  n_e.__timer2 = 0;
                }
                else
                {
                  n_e.set_ysp(n_e.get_ysp() - 0.0625);
                  n_e.__timer2++;
                  if (n_e.__timer2 % 15 == 0 && n_e.__timer2 < 62)
                  {
                    let nx = n_e.get_x();
                    let ny = n_e.get_y();
                    let ofs = n_e.get_angle_to(ply);
                    let ang = ofs;
                    while (ang < 360 + ofs)
                    {
                      new Bullet(nx, ny, ang, 1.25, "m");
                      play_sound(snds.shot0);
                      ang += 36;
                    }
                  }
                }
              }
              n_e.add_tick_func(b);
            }
            
            if (this.loc1 % 60 == 0)
            {
              let n_e = new Enemy(width - 128, -48, 28, imgs.enem.basic_a, "idle", 40, 0);
              n_e.set_ysp(10);
              n_e.__timer = 0;
              let b = function(unused_lol)
              {
                n_e.__timer++;
                let t = n_e.__timer;
                if (t < 60)
                {
                  n_e.set_ysp(n_e.get_ysp() * 0.925);
                }
                else if (t < 90)
                {
                  n_e.set_ysp(0);
                  n_e.__timer2 = 0;
                }
                else
                {
                  n_e.set_ysp(n_e.get_ysp() + 0.0625);
                  n_e.__timer2++;
                  if (n_e.__timer2 % 15 == 0 && n_e.__timer2 < 62)
                  {
                    let nx = n_e.get_x();
                    let ny = n_e.get_y();
                    let ofs = n_e.get_angle_to(ply);
                    let ang = ofs;
                    while (ang < 360 + ofs)
                    {
                      new Bullet(nx, ny, ang, 1.25, "m");
                      play_sound(snds.shot0);
                      ang += 36;
                    }
                  }
                }
              }
              n_e.add_tick_func(b);
            }
          }
          else if (this.loc1 > 360)
          {
            game_handler.next_sequence();
          }
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 % 30 == 0)
          {
            let n_e1 = new Enemy(width + 48, height / 2 - 32 * (this.loc1 / 30), 24, imgs.enem.basic_b, "idle", 15, 0);
            let n_e2 = new Enemy(width + 48, height / 2 + 32 * (this.loc1 / 30), 24, imgs.enem.basic_b, "idle", 15, 0);
            
            let b = function(e)
            {
              if (!e.__timer)
                e.__timer = 0;
              
              e.__timer++;
              
              let t = e.__timer;
              
              if (t == 1)
                e.set_xsp(-10);
              
              if (t < 120)
                e.set_xsp(e.get_xsp() * 0.95);
              
              if (t >= 60 && t < 120 && t % 6 == 0)
              {
                let nx = e.get_x();
                let ny = e.get_y();
                new Bullet(nx, ny, e.get_angle_to(ply), 5, "m", 1);
                play_sound(snds.shot0);
              }
              
              if (t > 135)
                e.set_xsp(e.get_xsp() + 0.1);
            }
            
            n_e1.add_tick_func(b);
            n_e2.add_tick_func(b);
          }
          
          if (this.loc1 > 180)
            game_handler.next_sequence();
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 == 60)
          {
            let n_e = new Enemy(width + 48, height / 2, 24, imgs.enem.basic_e, "idle", 40, 0);
            n_e.__timer = 0;
            n_e.familiars = [];
            n_e.set_xsp(-10);
            
            let b = function(e)
            {
              let ex = e.get_x();
              let ey = e.get_y();
              
              e.__timer++;
              
              let t = e.__timer;
              
              if (t < 180)
                e.set_xsp(e.get_xsp() * 0.96);
              
              if (t == 60)
              {
                for (let i = 0; i < 4; i++)
                {
                  let new_f = new Familiar(e,ex, ey, 16, imgs.enem.familiar_a, "idle", 40, 0);
                  new_f._fid = i;
                  new_f.set_xsp(-1);
                  e.familiars.push(new_f);
                }
                e._f_dist = 0;
                play_sound(snds.familiar);
              }
              
              if (e._f_dist != null && e.familiars.length > 0)
              {
                if (e._f_dist < 80)
                  e._f_dist++;
                
                let d = e._f_dist;
                
                for (let f of e.familiars)
                  if (!f.is_dead())
                  {
                    let a = (t * 1.25 + f._fid * 90) * PI / 180;
                    f.set_x(ex + Math.cos(a) * d);
                    f.set_y(ey + Math.sin(a) * d);
                  }
              }
              
              if (ex > 0 && t > 150 && t % 90 == 0)
              {
                let ea = e.get_angle_to(ply);
                new Bullet(ex, ey, ea, 2, "m", 3);
                new Bullet(ex, ey, ea - 10, 2, "m", 3);
                new Bullet(ex, ey, ea + 10, 2, "m", 3);
                play_sound(snds.shot0);
              }
              
              if (t >= 300)
              {
                if (e.get_xsp() > -2)
                  e.set_xsp(e.get_xsp() - 0.1);
                if (ex > 0 && t % 80 == 0)
                {
                  for (let f of e.familiars)
                    if (!f.is_dead())
                    {
                      let fx = f.get_x();
                      let fy = f.get_y();
                      let a = 0;
                      while (a < 360)
                      {
                        new Bullet(fx, fy, a, 4, "m", 2);
                        a += 60;
                      }
                    }
                  play_sound(snds.shot0);
                }
              }
            }
            
            n_e.add_tick_func(b);
          }
          
          if (this.loc1 >= 360)
            game_handler.next_sequence();
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 == 60)
          {
            let n_e = new Enemy(width + 48, height / 2 - 127, 24, imgs.enem.basic_e, "idle", 70, 0);
            let n_e2 = new Enemy(width + 48, height / 2 + 127, 24, imgs.enem.basic_e, "idle", 70, 0);
            
            
            n_e.__timer = 0;
            n_e.familiars = [];
            n_e.set_xsp(-10);
            
            n_e2.__timer = 0;
            n_e2.familiars = [];
            n_e2.set_xsp(-10);
            
            let b = function(e)
            {
              let ex = e.get_x();
              let ey = e.get_y();
              
              e.__timer++;
              
              let t = e.__timer;
              
              if (t < 180)
                e.set_xsp(e.get_xsp() * 0.96);
              
              if (t == 60)
              {
                for (let i = 0; i < 6; i++)
                {
                  let new_f = new Familiar(e,ex, ey, 16, imgs.enem.familiar_a, "idle", 20, 0);
                  new_f._fid = i;
                  new_f.set_xsp(-1);
                  e.familiars.push(new_f);
                }
                e._f_dist = 0;
                play_sound(snds.familiar);
              }
              
              if (e._f_dist != null && e.familiars.length > 0)
              {
                if (e._f_dist < 80)
                  e._f_dist++;
                
                let d = e._f_dist;
                
                for (let f of e.familiars)
                  if (!f.is_dead())
                  {
                    let a = (t * 1.5 + f._fid * 30) * PI / 180;
                    f.set_x(ex + Math.cos(a) * d);
                    f.set_y(ey + Math.sin(a) * d);
                  }
              }
              
              if (ex > 0 && t >= 120 && t % 65 == 0)
              {
                let ea = e.get_angle_to(ply);
                new Bullet(ex, ey, ea, 2, "m", 3);
                new Bullet(ex, ey, ea - 10, 2, "m", 3);
                new Bullet(ex, ey, ea + 10, 2, "m", 3);
                new Bullet(ex, ey, ea - 20, 2, "m", 3);
                new Bullet(ex, ey, ea + 20, 2, "m", 3);
                play_sound(snds.shot0);
              }
              
              if (t >= 300)
                if (e.get_xsp() > -2)
                  e.set_xsp(e.get_xsp() - 0.1);
            }
            
            let d = function(e)
            {
              new OrbItem(e.get_x(),e.get_y(),5,0);
            }
            
            n_e.add_tick_func(b);
            n_e.add_death_func(d);
            n_e2.add_tick_func(b);
            n_e2.add_death_func(d);
          }
          
          if (this.loc1 >= 360)
            game_handler.next_sequence();
        }
      },
      {
        loc1: 0,
        enems: [],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          
          if (this.loc1 > 120 && this.loc1 < 600 && (this.loc1 - 119) % 45 == 0)
          {
            let n_e = new Enemy(width + 48, height / 2 + random(-127,127), 24, imgs.enem.basic_d, "idle", 20, 0);
            
            n_e.__timer = 0;
            n_e.__up = round(random()) == 0 ? false : true;
            
            let b = function(e)
            {
              e.__timer++;
              let t = e.__timer;
              let ex = e.get_x();
              let ey = e.get_y();
              
              e.set_xsp(e.get_xsp() * 0.9);
              e.set_ysp(e.get_ysp() * 0.9);
              
              if (t >= 75)
              {
                e.__timer = 0;
                
                if (ex > 0)
                {
                  let a = 0;
                  while (a < 360)
                  {
                    new Bullet(ex, ey, a, 1.5, "m", 2);
                    a += 36;
                  }
                }
                
                e.set_xsp(-12);
                e.set_ysp(e.__up ? -12 : 12);
                e.__up = !e.__up;
                
                play_sound(snds.ping0);
              }
            }
            
            n_e.add_tick_func(b);
            this.enems.push(n_e);
          }
          
          if (this.loc1 > 1200 || this.loc1 > 600 && this.enems.length <= 0)
            game_handler.next_sequence();
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 == 120)
          {
            let n_e = new Enemy(width + 48, height / 2 - 127, 24, imgs.enem.basic_e, "idle", 70, 0);
            let n_e2 = new Enemy(width + 48, height / 2 + 127, 24, imgs.enem.basic_e, "idle", 70, 0);
            
            n_e.__timer = 0;
            n_e.set_xsp(-10);
            
            n_e2.__timer = 0;
            n_e2.set_xsp(-10);
            
            let b = function(e)
            {
              let ex = e.get_x();
              let ey = e.get_y();
              
              e.__timer++;
              
              let t = e.__timer;
              
              if (t < 180)
                e.set_xsp(e.get_xsp() * 0.925);
              
              if (t == 60)
              {
                let ang = 120;
                let ff = function(e2)
                {
                  e2.__timer++;
                  
                  if (e2.__timer >= 120 && e2.__timer % 2 == 0)
                  {
                    new Bullet(e2.get_x(), e2.get_y(), random() * 360, 1 + (e2.__timer - 60) / 45, "m", 2);
                    play_sound(snds.shot0);
                  }
                  if (e2.__timer >= 150)
                  {
                    e2.destroys_bullets = false;
                    e2.die(true);
                  }
                }
                while (ang <= 240)
                {
                  let new_f = new Familiar(e,ex, ey, 16, imgs.enem.familiar_a, "idle", 50, 0);
                  let aaaaaaaaa = ang * PI / 180;
                  new_f.set_xsp(2 * Math.cos(aaaaaaaaa));
                  new_f.set_ysp(2 * Math.sin(aaaaaaaaa));
                  new_f.__timer = 0;
                  new_f.add_tick_func(ff);
                  ang += 24;
                }
                play_sound(snds.familiar);
              }
              
              if (t >= 90 && t % 90 == 0)
              {
                let ea = e.get_angle_to(ply);
                new Bullet(ex, ey, ea, 1, "m", 3);
                new Bullet(ex, ey, ea - 10, 1, "m", 3);
                new Bullet(ex, ey, ea + 10, 1, "m", 3);
                play_sound(snds.shot0);
              }
              
              if (t >= 150)
                if (e.get_xsp() > -3)
                  e.set_xsp(e.get_xsp() - 0.0375);
            }
            
            let d = function(e)
            {
              new OrbItem(e.get_x(),e.get_y(),5,0);
            }
            
            n_e.add_tick_func(b);
            n_e2.add_tick_func(b);
            n_e.add_death_func(d);
            n_e2.add_death_func(d);
          }
          
          if (this.loc1 > 750)
            game_handler.next_sequence();
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 == 1)
          {
            clear_bullets();
            lv_vars.midboss = new Boss(width + 48, 0, 32, imgs.enem.familiar_c, "idle", 1000);
            let m = lv_vars.midboss;
            m.has_ply_col = false;
            m.has_atk_col = false;
            m.offscreen_remove = false;
            play_sound(snds.familiar);
          }
          
          let m = lv_vars.midboss;
          
          if (m != null)
          {
            m.set_x(width - 192 + (240 / (this.loc1 / 4)));
            m.set_y(height / 2 - ((height / 2) / (this.loc1 / 4)));
            if (m.get_x() - (width - 192) <= 16 && m.get_y() - (height / 2) <= 16)
            {
              m.has_ply_col = true;
              m.has_atk_col = true;
              // m.set_x(width - 192);
              // m.set_y(height / 2);
              game_handler.next_sequence();
            }
          }
        }
      },
      {
        loc1: 0,
        ccw: false,
        familiars: [],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          let m = lv_vars.midboss;
          
          if (m != null && !m.is_dead())
          {
            let mx = m.get_x();
            let my = m.get_y();
            
            if (this.loc1 >= 60)
            {
              let b = function(e)
              {
                e.__timer++;
                e.__angle += e.__ccw ? 0.5 : -0.5;
                
                let p = e.get_parent();
                let px = p.get_x();
                let py = p.get_y();
                
                let aa = e.__angle * PI / 180;
                
                let et = e.__timer;
                
                e.set_x(px + Math.cos(aa) * et);
                e.set_y(py + Math.sin(aa) * et);
                
                if (et > 20 && et % 75 == 0)
                {
                  let ofs = e.get_angle_to(ply) + (e.__ccw ? 0 : 30);
                  let ang = ofs;
                  
                  while (ang < 360 + ofs)
                  {
                    new Bullet(e.get_x(), e.get_y(), ang, 3, "m", 3);
                    ang += 60;
                  }
                  
                  play_sound(snds.shot0);
                }
                
                if (et >= 360)
                  e.die(true);
              }
              
              for (let i = 0; i < 360; i += 120)
              {
                let f = new Familiar(m, mx, my, 16, imgs.enem.familiar_a, "idle", 20, 0);
                f.__angle = i;
                f.__timer = 0;
                f.__ccw = this.ccw;
                f.add_tick_func(b);
                this.familiars.push(f);
              }
              
              play_sound(snds.familiar);
              this.loc1 = 0;
              this.ccw = !this.ccw;
            }
            
            
            if (m.health <= 750)
            {
              for (let fff of this.familiars)
                fff.die(true);
              m.health = 1000;
              m.invin_timer = 300;
              clear_bullets();
              shake_screen(8,30);
              play_sound(snds.enem_die);
              game_handler.next_sequence();
            }
          }
        }
      },
      {
        loc1: 0,
        loc2: 0,
        familiars: [],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          
          let m = lv_vars.midboss;
          
          if (m != null && !m.is_dead())
          {
            let mx = m.get_x();
            let my = m.get_y();
            
            if (this.loc1 < 0 && this.loc2 == 0)
              this.loc2 = 1;
            
            if (this.loc2 > 0)
            {
              this.loc2++;
              
              if (this.loc2 >= 46)
              {
                let ofs = m.get_angle_to(ply);
                let ang = ofs;
                while (ang < ofs + 360)
                {
                  new Bullet(mx, my, ang, 2, "m", 3);
                  ang += 36;
                }
                play_sound(snds.shot0);
                this.loc2 = 1;
              }
            }
            
            if (this.loc1 == 120 || this.loc1 == 135 || this.loc1 == 150)
            {
              let ofs = this.loc1 == 135 ? 0 : 60;
              let ang = ofs;
              
              let b = function(e)
              {
                e.set_xsp(e.get_xsp() * 0.9);
                e.set_ysp(e.get_ysp() * 0.9);
                
                if (Math.abs(e.get_xsp()) <= 1 && Math.abs(e.get_ysp()) <= 1)
                {
                  e.set_xsp(0);
                  e.set_ysp(0);
                  e.__timer++;
                }
                
                let ex = e.get_x();
                let ey = e.get_y();
                
                let t = e.__timer;
                
                if (t > 30 && e.__ang > -360 + e.__ofs)
                {
                  let aa = e.__ang * PI / 180;
                  let ofs_x = 22 * Math.cos(aa);
                  let ofs_y = -22 * Math.sin(aa);
                  
                  let n_b = new Bullet(ex + ofs_x, ey + ofs_y, e.__ang, 0, "m", 3);
                  e.__petals.push(n_b);
                  e.__ang -= 24;
                  play_sound(snds.shot0);
                }
                
                if (t >= 90)
                {
                  let petal_move = function(e)
                  {
                    if (e.get_speed() < 3)
                      e.set_speed(e.get_speed() + 0.125);
                  }
                  for (let ptl of e.__petals)
                    ptl.add_tick_func(petal_move);
                  e.destroys_bullets = false;
                  e.die(true);
                }
              }
              
              while (ang < 360 + ofs)
              {
                let f = new Familiar(m, mx, my, 22, imgs.enem.familiar_b, "idle", 50, 0);
                let aaaaa = ang * PI / 180;
                let spd = 20 + (this.loc1 - 120) / 5;
                f.__timer = 0;
                f.__ofs = random(90)
                f.__ang = f.__ofs;
                f.__petals = [];
                f.set_xsp(spd * Math.cos(aaaaa));
                f.set_ysp(spd * Math.sin(aaaaa));
                f.add_tick_func(b);
                this.familiars.push(f);
                
                ang += 120;
              }
              
              play_sound(snds.familiar);
            }
            
            if (this.loc1 >= 180)
              this.loc1 = -120;
            
            if (m.health <= 700)
            {
              clear_bullets();
              new OrbItem(mx,my,4,-2 + random(4));
              new BarrierItem(mx,my,4,-2 + random(4));
              m.die(true, false, true);
              lv_vars.midboss = null;
              game_handler.next_sequence();
            }
          }
        }
      },
      {
        loc1: 0,
        enems: [],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          
          if (this.loc1 > 120 && this.loc1 < 600 && (this.loc1 - 119) % 60 == 0)
          {
            let n_e = new Enemy(width + 48, height / 2 + random(-127,127), 24, imgs.enem.basic_d, "idle", 20, 0);
            
            n_e.__timer = 0;
            n_e.__up = round(random()) == 0 ? false : true;
            
            let b = function(e)
            {
              e.__timer++;
              let t = e.__timer;
              let ex = e.get_x();
              let ey = e.get_y();
              
              e.set_xsp(e.get_xsp() * 0.9);
              e.set_ysp(e.get_ysp() * 0.9);
              
              if (t >= 75)
              {
                e.__timer = 0;
                
                if (ex > 0)
                {
                  let a = 0;
                  while (a < 360)
                  {
                    new Bullet(ex, ey, a, 1.5, "m", 2);
                    a += 36;
                  }
                  let pl_a = e.get_angle_to(ply);
                  new Bullet(ex, ey, pl_a, 1.5, "m", 1);
                  new Bullet(ex, ey, pl_a + 10, 1.5, "m", 1);
                  new Bullet(ex, ey, pl_a - 10, 1.5, "m", 1);
                }
                
                e.set_xsp(-10);
                e.set_ysp(e.__up ? -14 : 14);
                e.__up = !e.__up;
                
                play_sound(snds.ping0);
              }
            }
            
            n_e.add_tick_func(b);
            this.enems.push(n_e);
          }
          
          if (this.loc1 > 1200 || this.loc1 > 600 && this.enems.length <= 0)
            game_handler.next_sequence();
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
          
          if (this.loc1 >= 120)
            show_text("that's all I have so far lol",width / 2, height / 2, fonts.ts, 24, [255, 255, 255, 255], CENTER);
          
          if (this.loc1 >= 180)
            show_text("You can consider this a sort of temporary winscreen",width / 2, height / 2 + 32, fonts.ts, 24, [255, 255, 255, 255], CENTER);
        }
      },
      {
        loc1: 0,
        main: function()
        {
          if (game_frozen())
            return;
          
          this.loc1++;
        }
      }
    ];
    return stage_seq;
  }
];

// This is for pasting into the console for skipping things to debug stuff
// for (let i = 0; i < 6; i++) game_handler.next_sequence();