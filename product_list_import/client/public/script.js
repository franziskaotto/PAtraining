import { products } from '/data.js';


// const divElement = function (content){
//   return `<div>${content}</div>`;
// }
let rootE = document.getElementById("root")

const loadEvent = function() {

  // Write your JavaScript code after this line
  
  //createOldRequiredElements(products)
  let noComposerArray = filterNoComposer(products)
  
  
  // Write your JavaScript code before this line

}


function filterNoComposer(products) {
  let noComposers = [];

  products.forEach(album => {
    let details = album.details;

    details.forEach(track => {
      let composer = track.composer;
      let trackName = track.name
      
      if(composer === null) {
        noComposers.push(trackName);
      }
      
      
    });
    
  });
  console.log(noComposers)
  longestTrackObject(products)
  
  createButton(noComposers, "click to add to DOM")
  return noComposers;
}



function longestTrackObject(products) {
  let longestTrack = "";
  let starter = 0;
  
  
  
  products.forEach(album => {
    let details = album.details

    details.forEach(track => {
      
      
      let time = track.milliseconds
      
      if (starter < time) {
        starter = time 
        longestTrack = track.name
      }
      

    });
    
  });
  console.log(longestTrack)

  
  return longestTrack
};

function createButton(noComposersArray, text) {
  let button = document.createElement("button") 
  button.innerHTML = text;
  button.addEventListener("click", (e)=> {
    let clicked = createHTMLElements(noComposersArray)
  })
  rootE.appendChild(button)

  
  
}



function createHTMLElements (noComposersArray) {
  
  noComposersArray.forEach(names => {
    let noCompH1 = document.createElement("h1")
    noCompH1.innerHTML = names
    rootE.appendChild(noCompH1)
    
  });

};




/*
function createOldRequiredElements(products) {

  rootE = document.getElementById("root");
  products.forEach(album => {
    let name = album.name;
    let nameH1 = document.createElement("h1");
    nameH1.innerHTML = name;
    nameH1.style.fontWeight = "bold";
    rootE.appendChild(nameH1);
    
    //more ablbum details task
    let interpret = album.vendor.name;
    let interpretH2 = document.createElement("h2");
    interpretH2.innerHTML = "by: " + interpret;
    rootE.appendChild(interpretH2);

    let status = album.status;
    let statusH3 = document.createElement("h3");
    statusH3.innerHTML = status;
    statusH3.style.fontStyle = "italic";
    rootE.appendChild(statusH3);

    let price = album.price;
    let priceDiv = document.createElement("div");
    priceDiv.innerHTML = "$: " + price;
    rootE.appendChild(priceDiv)


    let details = album.details;
    details.forEach(track => {
      let trackTitle = track.name;

      let trackDiv = document.createElement("div");
      trackDiv.innerHTML = "track: " + trackTitle;
      trackDiv.style.fontWeight = "bold";
      rootE.appendChild(trackDiv);

      //last task add more details
      let composer = track.composer;
      let compDiv = document.createElement("div");
      compDiv.innerHTML = "composer: " + composer;
      rootE.appendChild(compDiv);

      let sec = track.milliseconds;
      let secDiv = document.createElement("div");
      secDiv.innerHTML = "millisec: " + sec
      rootE.appendChild(secDiv)

    });

  });


}
*/













window.addEventListener("load", loadEvent);
