function play_sound(obj)
{
  if (obj.play && obj.stop)
  {
    obj.stop();
    obj.play();
    //obj.onended(clear_sounds);
  }
}

function play_music(m)
{
  if (m != cur_mus)
  {
    if (cur_mus)
      cur_mus.stop();
    cur_mus = m;
    cur_mus.disconnect();
    cur_mus.connect(sound_vars.gain);
    cur_mus.play();
  }
}

function stop_music()
{
  if (cur_mus)
    cur_mus.stop();
  cur_mus = null;
}

let sound_vars = {
  m_vol:1,
  gain: new p5.Gain()
};

function tick_sounds()
{
  if (cur_mus)
    // Pauses music during ᴛimestop
    if (!dialogue_active && game_frozen() || !focused || game_paused)
      cur_mus.pause();
    else
    {
      if (!cur_mus.isPlaying())
        cur_mus.play();
      if (stage_clear)
      {
        sound_vars.m_vol -= (1 / 180);
        if (sound_vars.m_vol < 0)
          sound_vars.m_vol = 0;
      }
      else
        sound_vars.m_vol = 1;
    }
    sound_vars.gain.amp(sound_vars.m_vol);
}