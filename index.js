const video = document.querySelector("#camera");
const startButton = document.querySelector("#button-start");
const stopButton = document.querySelector("#button-stop");
const transcriptionBox = document.getElementById("placeholder-text");
let cameraStream = null;

startButton.addEventListener("click", () => {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        cameraStream = stream;
        video.srcObject = stream;
        console.log("Camera started");
      })
      .catch(err => console.log("Camera error:", err));
  }
});

stopButton.addEventListener("click", () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    console.log("Camera stopped");
  }
});

const URL = "./tm-my-image-model/";
let model, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  loop();
}

async function loop() {
  if (video.srcObject) {
    await predict();
  }
  requestAnimationFrame(loop);
}

async function predict() {
  if (!model) return;
  const predictions = await model.predict(video);
  let bestPrediction = predictions[0];

  for (let i = 1; i < predictions.length; i++) {
    const currentPrediction = predictions[i];

    if (currentPrediction.probability > bestPrediction.probability) {
      bestPrediction = currentPrediction;
    } 
  }
  transcriptionBox.value = bestPrediction.className;
}

window.addEventListener("load", init);