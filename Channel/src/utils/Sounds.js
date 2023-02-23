import Sound from 'react-native-sound';

export function PlayLocalSoundFile() {
  Sound.setCategory('Playback');
  var mySound = new Sound('ding.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      return;
    } else {
      mySound.play(success => {
        if (success) {
          return true;
        } else {
          console.warn(error)
        }
      });
    }
  });
  mySound.setVolume(0.9);
  mySound.release();
}
