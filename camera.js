if (navigator.mediaDevices.getUserMedia){ 
  navigator.mediaDevices. getUserMedia({ video: true }) //
    .then(function (stream){
      video.srcObject = stream; //camera live
  })
    .catch (function (error) {
      console.log ("Something went wrong");
    })
  }
  else {
  console.log("getUserMedia is not supported");
  }


const video = document.querySelector("#camera");
const cameraButton = document.getElementById("camera-button");
const canvas = document.getElementById("canvas");
const capturedPicture = document.getElementById("captured-picture");

cameraButton.addEventListener("click", () => {
  video.classList.add("effect");

  setTimeout(() => {
    video.classList.remove("effect");

    const c = canvas.getContext("2d"); //way to draw canvas
   

    c.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    capturedPicture.src = imageData; //image will be image data
    capturedPicture.style.display = "block"; //show image

  }, 300);
});