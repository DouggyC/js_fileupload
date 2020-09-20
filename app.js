let dropArea = document.querySelector("#drop-area");

let uploadProgress = [];
let filesToDo = 0;
let progressBar = document.getElementById("progress-bar");

["dragenter", "dragover"].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", handleDrop, false);

function highlight(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.remove("highlight");
}

function handleFiles(files) {
  files = [...files];
  initializeProgress(files.length);
  files.forEach(uploadFile);
  files.forEach(previewFile);
}

function uploadFile(file, i) {
  let url = "";
  let xhr = new XMLHttpRequest()
  let formData = new FormData();

  xhr.open('POST', url, true)

  xhr.upload.addEventListener('progress', function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if(xhr.readyState == 4 && xhr.status == 200) {
      // Done. Inform the use
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  formData.append("file", file)
  xhr.send(formData)
}

function handleDrop(e) {
  // event dataTransfer
  let dt = e.dataTransfer;
  // files
  let files = dt.files;

  console.log(dt);
  console.log(files);

  handleFiles(files);
}

// Keep in mind that files is not an array, but a FileList.
// So, when we implement handleFiles, we’ll need to convert it to an array,
// in order to iterate over it more easily.

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let img = document.createElement("img");
    img.src = reader.result;
    document.getElementById("gallery").appendChild(img);
  };
}

function initializeProgress(numfiles) {
  progressBar.value = 0;
  uploadProgress = [];

  for (let i = numfiles; i > 0; i--) {
    uploadProgress.push(0)
  }

}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  progressBar.value = total
}


// FormData, FileReader API
// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/