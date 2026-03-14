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
              new Bullet(mx,my,a,2 * i / 2);
              new Bullet(mx,my,a - 15,2 * i / 2);
              new Bullet(mx,my,a + 15,2 * i / 2);
              new Bullet(mx,my,a - 30,2 * i / 2);
              new Bullet(mx,my,a + 30,2 * i / 2);
              new Bullet(mx,my,a - 45,2 * i / 2);
              new Bullet(mx,my,a + 45,2 * i / 2);
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
              txt: "Now, you can spend a bit of your own magic in order to perform a special attack.",
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
              b = new Bullet(p_x + len * cos(a * PI / 180),p_y + len * sin(a * PI / 180),0,10,"xl");
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
              b = new Bullet(p_x + len * cos(a * PI / 180),p_y + len * sin(a * PI / 180),0,10,"xl");
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
            if (e.get_x() < width || e.get_xsp() < 0)
              e.set_xsp(e.get_xsp() + 0.125);
            else
              e.destroy();
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
              new OrbItem(c.get_x(),c.get_y(),4,-2 * random() + 4);
              new BarrierItem(c.get_x(),c.get_y(),4,-2 * random() + 4);
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
              new BarrierItem(c.get_x(),c.get_y(),4,-2 * random() + 4);
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
                if (this.loc1 == 250)
                {
                  this.a = c.get_angle_to(ply);
                  shake_screen(7,30);
                }
                if (this.d < width * 0.875)
                {
                  this.d += 32;
                  let loc_ang = this.a / 180 * PI;
                  let xoffset = this.d * cos(loc_ang);
                  let yoffset = -this.d * sin(loc_ang);
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
              new OrbItem(c.get_x(),c.get_y(),4,-2 * random() + 4);
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
          
          this.loc_bullets = this.loc_bullets.filter((b) => !b.can_remove());
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
          
          for (let b of this.loc_bullets)
            b.set_speed(min(2.5,b.get_speed() + 0.03125));
          
          if (c)
          {
            let cx = c.get_x();
            let cy = c.get_y();
            
            if (this.loc1 >= 60)
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
                  let xoffset = this.d * cos(loc_ang);
                  let yoffset = -this.d * sin(loc_ang);
                  let b = new Bullet(cx + xoffset, cy + yoffset, a1, 0, "xl", 0, true, true);
                  b.__ang = a1;
                  b.timer = 0;
                  this.fake_bullets.push(b);
                  
                  a1 = this.a + 45;
                  loc_ang = a1 / 180 * PI;
                  xoffset = this.d * cos(loc_ang);
                  yoffset = -this.d * sin(loc_ang);
                  b = new Bullet(cx + xoffset, cy + yoffset, a1, 0, "xl", 0, true, true);
                  b.__ang = a1;
                  b.timer = 0;
                  this.fake_bullets.push(b);
                  
                  a1 = this.a - 45;
                  loc_ang = a1 / 180 * PI;
                  xoffset = this.d * cos(loc_ang);
                  yoffset = -this.d * sin(loc_ang);
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
              new OrbItem(c.get_x(),c.get_y(),4,-2 * random() + 4);
              new OrbItem(c.get_x(),c.get_y(),4,-2 * random() + 4);
              new BarrierItem(c.get_x(),c.get_y(),4,-2 * random() + 4);
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
        main: function()
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
            for (let i = 0; i < 15; i++)
            {
              let ratio = 0.25 + (i / 10) * 0.75;
              let b = new BGObject(1.5 * width * random(), height - 192 + random(32));
              b.set_xsp(-0.5 * ratio);
              b.set_sprite(imgs.bgo["tree" + round(random(3))]);
              let s = b.get_sprite();
              if (s)
              {
                s.tint[0] = 0;
                s.tint[1] = 0;
                s.tint[2] = 0;
                s.scale_x = 2;
                s.scale_y = 2;
                b.timer = 0;
                b.add_tick_func(function()
                {
                  if (b.timer < 127)
                    b.timer++;
                  s.tint[0] = b.timer;
                  s.tint[1] = b.timer;
                  s.tint[2] = b.timer;
                  if (b.timer >= 127)
                    b.clear_tick_funcs();
                });
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
        enems: [],
        main: function()
        {
          if (game_frozen())
            return;
          
          this.enems = this.enems.filter((e) => !e.can_remove());
          this.loc1++;
          
          if (this.loc1 > 30)
          {
            if (this.loc1 % 60 == 0)
            {
              
            }
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
        }
      }
    ];
    return stage_seq;
  }
];

// This is for pasting into the console for skipping things to debug stuff
// for (let i = 0; i < 6; i++) game_handler.next_sequence();