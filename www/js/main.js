(() => {
  const recordButton = document.getElementById("record");
  const playerHolder = document.getElementById("playerHolder");
  let mediaStreamSource;
  let isRecording = false;
  let audioObject;
  const session = {
    audio: true,
    video: false,
  };

  let recordRTC = null;

  const onError = (error) => {
    alert("Can't get audio");
  };

  function toggleRecord() {
    if (isRecording) {
      stopRecording();
    } else {
      getMedia();
    }
  }

  const getMedia = () => {
    console.log("Starting");
    navigator.getUserMedia(session, record, onError);
  };

  const record = (mediaStream) => {
    isRecording = true;
    playerHolder.innerHTML = "";
    //
    recordButton.classList.add("btn-danger");
    recordButton.classList.remove("btn-primary");
    //
    recordRTC = RecordRTC(mediaStream);
    recordRTC.startRecording();
    mediaStreamSource = mediaStream;
  };

  const stopRecording = () => {
    isRecording = false;
    recordButton.classList.add("btn-primary");
    recordButton.classList.remove("btn-danger");
    //
    recordRTC.stopRecording(function (audioURL) {
      //Release Microphone
      mediaStreamSource.stop();

      //Convert to Blob
      createAudioElement(audioURL);
      setTimeout(() => {
        uploadAudio();
      }, 1000);
    });
  };

  const uploadAudio = () => {
    //Create formData
    const formData = new FormData();
    formData.append("audio", recordRTC.getBlob());
    formData.append("test", "TEST");

    //Upload
    fetch("/", { method: "POST", body: formData })
      .then((res) => {
        console.log(res);
        console.log(res.body);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const createAudioElement = (audioURL) => {
    const audio = document.createElement("audio");
    audio.src = audioURL;
    audio.controls = true;
    audio.autoplay = true;
    audioObject = audio;
    playerHolder.appendChild(audio);
    return audio;
  };

  recordButton.addEventListener("click", toggleRecord);
})();
