import Sound from 'react-native-sound';

export function PlayLocalSoundFile() {
  Sound.setCategory('Playback');
  var mySound = new Sound('ding.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('Error loading sound: ' + error);
      return;
    } else {
      mySound.play(success => {
        if (success) {
          console.log("soundplayed");
          return true;
        } else {
          console.log('Issue playing file');
        }
      });
    }
  });
  mySound.setVolume(0.9);
  mySound.release();
}
