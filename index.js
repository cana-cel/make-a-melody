
$("#firstname").on("change", changefirstname);
function changefirstname () {
  var firstname = this.value;
  //console.log(firstname);
}

$("#lastname").on("change", changelastname);
function changelastname () {
  var lastname = this.value;
  //console.log(lastname);
}

$("#inputbutton").on("click", clickbutton);

function clickbutton() {
  var initialFirstname = firstname.value.charAt(0);
  var initialLastname = lastname.value.charAt(0);
  var chordFlag = 0;
  var scaleFlag = 0;
  var key = '';
  var scale = '';

  $.getJSON("data/chord.json", function(json){
    for (var i=0; i<json.length; i++) {
      var first = json[i].first;
      var chord = json[i].chord;
      for (var j=0; j<first.length; j++){
        if (initialFirstname === first[j]){
          key = chord;
          //console.log(key);
        }
      }
      if (!key) {
        key = "None";
      }
    }
    chordFlag = 1;
  });

  $.getJSON("data/scale.json", function(json){
    for (i=0; i<json.length; i++){
      var major = json[i].major;
      var minor = json[i].minor;
      for (var j=0; j<major.length; j++){
        if (initialLastname === major[j]){
          scale = "major";
          console.log(scale);
        }
        else if (initialLastname === minor[j]) {
          scale = "minor";
          console.log(scale);
        }
      }
      if (!scale) {
        scale = "None";
      }
    }
    scaleFlag = 1;
    if (scaleFlag && chordFlag == 1) {
      sound(key, scale);
      if (key === "None" || scale === "None"){
        alert("正しく入力してください！");
      }
    }
  });
}

function sound(key, scale) {
  //各ノードを生成するためのオブジェクト
  console.log(key);
  console.log(scale);

  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  var audioContext = new AudioContext;

  var note = {};
  ['C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6', 'Db6', 'D6'].forEach(function (v, i) {
    note[v] = i;
  });

  var play = function (noteId) {
    console.log(note[noteId]);

    //音の発生源
    var osciilatorNode = audioContext.createOscillator();
    //互換性の設定
    osciilatorNode.start = osciilatorNode.start||osciilatorNode.noteOn;

    //音程の設定
    //基準=A4(440Hz)
    //1オクターブを12分割するので、2の12乗根=1.0595の等比級数で音階が上がり下がりする
    //C4はA4の9音下なので、f=440*1.0595^(-9)
    //note[noteID]で、C4+何音みたいにする

    switch (key){
      case 'C': note[noteId] = note[noteId] + 0; break;
      case 'Db': note[noteId] = note[noteId] + 1; break;
      case 'D': note[noteId] = note[noteId] + 2; break;
      case 'Eb': note[noteId] = note[noteId] + 3; break;
      case 'E': note[noteId] = note[noteId] + 4; break;
      case 'F': note[noteId] = note[noteId] + 5; break;
      case 'Gb': note[noteId] = note[noteId] + 6; break;
      case 'G': note[noteId] = note[noteId] + 7; break;
      case 'Ab': note[noteId] = note[noteId] + 8; break;
      case 'A': note[noteId] = note[noteId] + 9; break;
      case 'Bb': note[noteId] = note[noteId] + 10; break;
      case 'B': note[noteId] = note[noteId] + 11; break;
      case 'None': break;
    }

    var frequency = parseInt(440 * Math.pow(Math.pow(2,1/12), (3-12) + note[noteId]), 10);
    osciilatorNode.frequency.value = frequency;

    //音量を少しずつ下げる
    var gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, play.count);
    gainNode.gain.linearRampToValueAtTime(0.5, play.count + 0.01);
    gainNode.gain.linearRampToValueAtTime(0.3, play.count + 0.20);
    gainNode.gain.linearRampToValueAtTime(0.2, play.count + 0.40);
    gainNode.gain.linearRampToValueAtTime(0.0, play.count + 0.80);

    //発生源から加工へ接続
    osciilatorNode.connect(gainNode);

    //加工からを出力装置に接続
    gainNode.connect(audioContext.destination);

    //音を鳴らす
    osciilatorNode.start(play.count || 0);
    play.count = play.count + .2;
    return play;
  }

  play.count = 0;

  if (scale === 'major' & key != 'None') {
    play('C4')('D4')('E4')('G4')('C5')('D5')('E5')('G5')('C6');
  }
  else if(scale === 'minor' & key != 'None'){
    play('C4')('D4')('Eb4')('G4')('C5')('D5')('Eb5')('G5')('C6');
  }
  else if(scale === 'None'){
  }

}
