
import Sound from 'react-native-sound'

class Player {

  sounds = [
    new Sound('chimes.mp3', Sound.MAIN_BUNDLE, err => console.log(0, err)),
    new Sound('gong.mp3', Sound.MAIN_BUNDLE, err => console.log(1, err)),
    new Sound('universe.mp3', Sound.MAIN_BUNDLE, err => console.log(2, err)),
    new Sound('humming.mp3', Sound.MAIN_BUNDLE, err => console.log(3, err)),
    new Sound('rain.mp3', Sound.MAIN_BUNDLE, err => console.log(4, err)),
    new Sound('wind.mp3', Sound.MAIN_BUNDLE, err => console.log(5, err)),
    new Sound('summer.mp3', Sound.MAIN_BUNDLE, err => console.log(6, err)),
  ]

  play() {
    this.sounds.forEach(s => {
      s.setNumberOfLoops(-1)
      s.play()
    })
  }

  setVolume(volume) {
    this.sounds.forEach((s, i) => s.setVolume(volume[i]))
  }

  stop() {
    this.sounds.forEach(s => s.stop())
  }
}

const player = new Player()
export default player
