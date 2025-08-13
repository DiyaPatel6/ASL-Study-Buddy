const startButton = document.querySelector("#button-start");
let cameraStream = null;

startButton.addEventListener("click", () => {
  if (navigator.mediaDevices.getUserMedia){ 
    navigator.mediaDevices.getUserMedia({ video: true }) 
      .then(function (stream){
        cameraStream = stream;
        video.srcObject = stream; //camera live
    })
      .catch (function (error) {
        console.log ("Something went wrong");
      })
    }
    else {
    console.log("getUserMedia is not supported");
    }  
})


const stopButton = document.querySelector("#button-stop");
stopButton.addEventListener("click", () => {
  if (cameraStream){   
    cameraStream.getTracks().forEach(track => track.stop());
    video.srcObject = null; 
      console.log("Camera Stopped");
    }
    else {
    console.log("Camera is not on");
    }
})



const dropdown = document.querySelector("select")
let optionSelected = null;

dropdown.addEventListener("change", () =>{
  optionSelected = dropdown.value;
  console.log("Selected Sign:", optionSelected);
})



const video = document.querySelector("#camera");
const cameraButton = document.getElementById("camera-button");
const canvas = document.getElementById("canvas");
const capturedPicture = document.getElementById("captured-picture");
cameraButton.addEventListener("click", () => {

  if (!optionSelected) {
    alert("Select a sign first");
    return;
  }

  const framesToCapture = 20; 
  const delay = 150; // ms between frames
  let frameCount = 0;

  video.classList.add("effect");

  const captureInterval = setInterval(() => {
    const c = canvas.getContext("2d");
    c.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    trainingData[optionSelected].push(imageData);
    downloadImage(imageData, `${optionSelected}${frameCount + 1}.jpg`);

    frameCount++;

    if (frameCount >= framesToCapture) {
      clearInterval(captureInterval);
      video.classList.remove("effect");
      console.log(`Finished capturing ${framesToCapture} frames for ${optionSelected}`);
    }

  }, delay);
});


const trainingData = {
  "hello": [],
  "yes": [],
  "no": []
}


function downloadImage(dataURL, filename) {
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  a.click();
}


