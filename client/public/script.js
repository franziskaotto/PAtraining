import { artObjects } from '/artObjects.js';

// write your code here

//TASKS////////////////////////////////////////////////////////////
// Refactor your code such that all the code is contained in functions. Add a function `initializeUi(artObjects)` that displays all the art objects on the page. The only code outside of functions is a call to this function (i.e. `initilaizeUi`). The art objects should be passed as a parameter to the `initializeUi` function.

//on the top of the page is a dropdown that shows all the art objects that were filtered previously. The user can select one of the art objects and it is shown on the page bellow the drop down.
let insertId = document.querySelector("body")
insertId.id = `root`;

let rootE = document.getElementById("root")
let dataHolder = document.getElementById("dataHolder")

initializeUi(artObjects)

function initializeUi(artObjects) {
  
  //from task  Refactor your code....
  //displayArtObjects(artObjects)
  
  // more than 2 media items of type audio,
  let moreThanTwoAudios = filteredAudioList(artObjects)
  createDropDown(moreThanTwoAudios);
  // the longest single media item of type audio,
  let longestArtObject = longestAudioTitle(moreThanTwoAudios);
  createButtonForTheLongestObject(longestArtObject)
  

  

  
}

// function displayArtObjects(artObjects) {
//   artObjects.forEach(object => {
//     let artTitles = object.title

//     console.log(artTitles)

//     let allArtObjects = document.createElement("div")
//     allArtObjects.innerHTML = artTitles
//     rootE.appendChild(allArtObjects)
    
//   });
//   return
// }

// more than 2 media items of type audio,
function filteredAudioList(inputList) {
  let audioList = [];

  inputList.forEach(artObject => {
    
    let media = artObject["mediaItems"];
    for (let key of media) {
     
      let type = key.mediaType;
      if (type === "audio" && media.length > 2) {
        audioList.push(artObject)
        
        break
      }
    }
  });
  return audioList
}

// the longest single media item of type audio,
function longestAudioTitle(filteredList) {
  let longestTitle = filteredList[0].mediaItems[0].duration;
  //console.log(filteredList[0].mediaItems[0].duration)
  //console.log(filteredList)

  filteredList.forEach(audioObject => {
    let media = audioObject["mediaItems"]
    
    for (let key of media) {
      
      let type = key.mediaType;
      let duration = key.duration;

      if (type === "audio" && duration > longestTitle) {
        longestTitle = audioObject
      }
    }
  });
  console.log(longestTitle)
  return longestTitle
}

function createDropDown(list) {
  let menu = document.createElement("select");
  
  menu.addEventListener("change", (e) => {
    console.log("Click here happend");
    showOneArtObject(e.target.value)
  })

  list.forEach(artObject => {
    let option = document.createElement("option");
    option.innerHTML = artObject.title;
    menu.appendChild(option)
  });
  rootE.appendChild(menu)
}

function createButtonForTheLongestObject(longestObject) {
  
  let button = document.createElement("button")
  button.innerHTML = "Click me to show the longest object"
  button.style.background = "blue"
  button.style.color = "white"
  button.addEventListener("click", (e) => {
      showOneArtObject(`the longest ArtObject is: ${longestObject.title}`)
  })
  rootE.appendChild(button);
}


function showOneArtObject (artTitle) {
  dataHolder.innerHTML = "";
  dataHolder.appendChild(createOneViewFromArtObject(artTitle))
}

function createOneViewFromArtObject(artTitle) {
  let element = document.createElement("div")
  element.innerHTML = artTitle;
  return element;
}