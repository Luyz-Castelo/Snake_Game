export default function playScoreSoundEffect(points) {
  let audio;
  if(points % 100 === 0) audio = new Audio('./audios/score-sound-effect-100.mp4');
  else audio = new Audio('./audios/score-sound-effect.mp4');

  audio.play()
}
