const video = document.querySelector("#camera");
    const startButton = document.querySelector("#button-start");
    const stopButton = document.querySelector("#button-stop");
    const cameraButton = document.getElementById("camera-button");
    const canvas = document.getElementById("canvas");
    const capturedPicture = document.getElementById("captured-picture");
    const dropdown = document.getElementById("sign-select");
    const transcriptionBox = document.getElementById("placeholder-text");
    const labelContainer = document.getElementById("label-container");


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

    dropdown.addEventListener("change", () => {
      optionSelected = dropdown.value;
      console.log("Selected Sign:", optionSelected);
    });

    cameraButton.addEventListener("click", () => {
      if (!optionSelected) {
        alert("Select a sign first");
        return;
      }

      const framesToCapture = 20;
      const delay = 150;
      let frameCount = 0;

      video.classList.add("effect");

      const captureInterval = setInterval(() => {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        trainingData[optionSelected].push(imageData);

        frameCount++;
        if (frameCount >= framesToCapture) {
          clearInterval(captureInterval);
          video.classList.remove("effect");
          console.log(`Captured ${framesToCapture} frames for ${optionSelected}`);
        }
      }, delay);
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
        } else {
        }
      }
    
      transcriptionBox.value = bestPrediction.className;
    }
    
    window.addEventListener("load", init);

    