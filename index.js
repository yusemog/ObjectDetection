// Below this line, create a variable storing your account token from Hugging Face. Name it ACCOUNT_TOKEN.
const ACCOUNT_TOKEN = "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";

// Below this line, create a variable storing the Hugging Face API Endpoint. Name it API_ENDPOINT.
/* Your code here */
const API_ENDPOINT="https://api-inference.huggingface.co/models/facebook/detr-resnet-50";



/* ========================= Code to setup getting webcam permissions ========================= */

// Below this line, place the code to get the video element. Name it video.
/* Your code here */
const video = document.getElementById("video");

// Below this line, place the code to get the canvas element. Name it canvas.
/* Your code here */
const canvas = document.getElementById("canvas");

// Getting camera permissions
let videoInterval;
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
}).catch(() => {});

const display = () => {
    // You might need to change this "scale" variable to make its size appropriate.
    const scale = 1.25;

    // Scaling video appropriately
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

// Edit the following event listener for the correct event that it should listen for 
video.addEventListener('Your code here', () => {
    clearInterval(videoInterval);
    videoInterval = setInterval(display, 1);
});






/* ========================= Code for handling click ========================= */
const callAPI = () => {
    return new Promise((resolve) => {
        // Get current canvas
        canvas.toBlob((async blob => {
            // Call API
            // Edit the code below to make the API call work
            const response = await fetch(
                API_ENDPOINT,
                {
                    headers: { Authorization: `Bearer ${ACCOUNT_TOKEN}` },
                    method: "POST",
                    body: blob,
                }
            );
            const result = await response.json();

            resolve(result);
        }));
    });
}

const drawBoxes = (results) => {
    // Loop through all detected boxes
    for (const result of results) {
        // Get name of object
        const object = result['label'];
        // Get location of object
        const { xmin, ymin, xmax, ymax } = result['box'];

        // Edit the code below to determine the width and height of the box
        const width = xmax-xmin;
        const height = ymax-ymin;
        
        // Draw and label boxes
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';
        ctx.font = '20px Arial';
        ctx.strokeRect(xmin, ymin, width, height);
        ctx.fillText(object, xmin, ymin - 5);
    }
}

let detecting = false;

const handleClick = async () => {
    // If currently not detecting, detect objects
    if (!detecting) {
        button.textContent = "DETECTING...";
        
        detecting = true;

        // Stop updating canvas
        clearInterval(videoInterval);

        // Call API and get results
        const results = await callAPI();
        
        // Draw boxes around detected objects
        drawBoxes(results);

        button.textContent = "RESTART";
    } else {
        detecting = false;

        // Restart video
        videoInterval = setInterval(display, 1);

        button.textContent = "DETECT OBJECTS";
    }
}

// Below this line, place the code to get the button element.
/* Your code here */

const button = document.getElementById("detectButton");

// Below this line, add an event listener with the handleClick function for the appropriate event
/* Your code here */

button.addEventListener("click",handleClick);