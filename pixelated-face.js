// first select all the elements that are on our page (video, canvas, and another canvas)
 const video = document.querySelector('.webcam')
 const canvas = document.querySelector('.video')
//size the canvases to match the video
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

 const faceCanvas = document.querySelector('.face')

faceCanvas.width = video.videoWidth;
faceCanvas.height = video.videoHeight;
// pull the context out of each canvas element
 const ctx = canvas.getContext('2d')
 const faceCtx = faceCanvas.getContext('2d')
// make a new face detector
 const faceDetector = new window.FaceDetector()

 const optionsInputs = document.querySelectorAll(
  '.controls input[type="range"]'
);

 const SIZE = 10;

 function handleOption(event) {
  const { value, name } = event.currentTarget;
  options[name] = parseFloat(value);
}
optionsInputs.forEach(input => input.addEventListener('input', handleOption));


// Write a function that populates the user's video (it grabs the feed off the user's webcam)
    // grab the stream from the user's webcam
async function populateVideo() {
    //set the object to be the stream then play it
    const stream = await navigator.mediaDevices.getUserMedia({
        video : { width: 1280, height: 720}
    })
    //pass the video(webcam) the stream then call play() on it
    video.srcObject = stream;
    await video.play();
    // size the canvases to be the same size as the video
  console.log(video.videoWidth, video.videoHeight);
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}
populateVideo()

//To detect faces that are in the shot
    //use the faceDetector variable created earlier and call .detect() on it (passe detect reference to the video)
async function detect() {
  const faces = await faceDetector.detect(video);
  faces.forEach(drawFace)
  faces.forEach(censor)
  //ask the browser when the next animation frame is and tell it to run detect for us
    //this is the same as calling detect()
  requestAnimationFrame(detect)
}
// write a function that draws triangles around the faces
function drawFace(face) {
    const { width, height, top, left } = face.boundingBox;
    // clear the amount, the width and the height, based on starting at the top left hand corner (which clears the canvas every time it runs)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    //call ctx.strokeRect() which is the API for drawing a rectangle
    ctx.strokeRect(left, top, width, height);
}

// create a function that will censor the face by pixelating the area around the face
// Destructure the bounding box properties
function censor({ boundingBox: face }) {
    faceCtx.imageSmoothingEnabled = false
    faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height)
  // draw the small face
    faceCtx.drawImage(
        // 5 source args
        video, // where does the source come from?
        face.x, // where do we start the source pull from?
        face.y,
        face.width,
        face.height,
        // 4 draw args
        face.x, // where should we start drawing the x and y?
        face.y,
        SIZE,
        SIZE
    )
    

    //draw the small face back on
    const width = face.width ;
  const height = face.height ;
  faceCtx.drawImage(
    faceCanvas, // source
    face.x, // where do we start the source pull from?
    face.y,
    SIZE,
    SIZE,
    // Drawing args
    face.x - (width - face.width) / 2,
    face.y - (height - face.height) / 2,
    width,
    height
  );
  }

    //tag a .then() onto populateVideo and run detect (so it can find faces)
    populateVideo().then(detect);