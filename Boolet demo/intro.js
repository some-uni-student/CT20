let intro = {"timer1": new Timer(180,true,true)};

function tick_intro()
{
  let v = intro.timer1.cur_val();
  if (v > 30)
  {
    let c = [174,162,222,255];
    if (v >= 175)
      c = [255,255,255,255];
    else if (v <= 60)
      c = [174,162,222,(v - 30) / 30 * 255];
    show_text("Nondescript Uni Student B",width / 2, height / 2, fonts.ts, 22, c, CENTER);
  }
  
  if (intro.timer1.finished())
    gamestate = 1;
}

// Debug stuff
// Remember to remove when game's finished
function mouseClicked(ev)
{
  if (gamestate == 0 && keyIsDown('KeyR'))
  {
    removeItem("tutorial_finished");
    print("killed save file");
  }
}