import { artObjects } from '/artObjects.js';

// write your code here
let rootE = document.querySelector("body");
rootE.id = "root"

initializeUi(artObjects);

function initializeUi(artObjects) {
  //more than 2 media items of type video
  
  
  let filteredList = filterForVideo(artObjects)



  


}

function filterForVideo(artObjects) {

  let typeVideo = []


  artObjects.forEach(art => {
    let mediaItems = art["mediaItems"]
    
    for (let mediaItem of mediaItems) {
      let type = mediaItem.mediaType

      if (type === "video" &&) {
        typeVideo.push(art)
      }
    }

    
    
  });
  console.log(typeVideo)

}












