//-------------------------------- Defining required variavles --------------------------//
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");
const repeatBtn = wrapper.querySelector("#repeat-plist");
let musicIndex = 1;


//---------------------------------- addEventListener function for load ------------------//
window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingNow()
})

//---------------------------------- loadMusic function ----------------------------------//
function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mpeg`;
}

//--------------------------------- playMusic function -----------------------------------//
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//--------------------------------- pauseMusic function ----------------------------------//
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//--------------------------------- nextMusic function -----------------------------------//
function nextMusic(){
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  //------------------------------- function calls ---------------------------------------//
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//--------------------------------- prevMusic function -----------------------------------//
function prevMusic(){
  musicIndex--;
  musicIndex < 1 ?  musicIndex = allMusic.length  : musicIndex = musicIndex;
  //------------------------------- function calls ---------------------------------------//
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//---------------------------------- addEventListener function for click -----------------//
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", ()=>{
  //-------------------------------- nextMusic function call -----------------------------//
  nextMusic();
});

prevBtn.addEventListener("click", ()=>{
  //-------------------------------- prevMusic function call -----------------------------//
  prevMusic();
});

//---------------------------------- addEventListener function for timeupdation ----------//
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; 
  const duration = e.target.duration; 
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  let musicCurrentTime = wrapper.querySelector(".current"),
  musicDuartion = wrapper.querySelector(".duration");

  //------------------------------- addEventListener function for loadeddata -------------//
  mainAudio.addEventListener("loadeddata", ()=>{
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec < 10){
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//---------------------------------- addEventListener function for click -----------------//
progressArea.addEventListener("click", (e)=>{
  let progressWidthval = progressArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  //------------------------------- function calls ---------------------------------------//
  playMusic();
  playingNow();
});

//---------------------------------- addEventListener function for click -----------------//
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; 
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//---------------------------------- addEventListener function for ended ----------------//
mainAudio.addEventListener("ended", ()=>{
  let getText = repeatBtn.innerText; 
  switch(getText){
    case "repeat":
      //-------------------------------- nextMusic function call ------------------------//
      nextMusic(); 
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; 
      //------------------------------- function calls ----------------------------------//
      loadMusic(musicIndex); 
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); 
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }
      while(musicIndex == randIndex); 
      musicIndex = randIndex; 
      //------------------------------- function calls ----------------------------------//
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

showMoreBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
  showMoreBtn.click();
});
  
const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mpeg"></audio>
                <span id="${allMusic[i].src}" class="duration">3:41</span> 
              </li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag);
  let liAudioDuartion = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", ()=>{
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    }
    liAudioDuartion.innerText = `${totalMin} : ${totalSec}`;
  });
}

//------------------------------------ playingNow function ------------------------------//
function playingNow(){
  const allLiTags = ulTag.querySelectorAll("li");
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTags = allLiTags[j].querySelector(".duration");
    if(allLiTags[j].classList.contains("playing")){
      allLiTags[j].classList.remove("playing");
      audioTags.innerText = "";
    }
    if(allLiTags[j].getAttribute("li-index") == musicIndex){
      allLiTags[j].classList.add("playing");
      audioTags.innerText = "Playing";
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

//------------------------------------- cliked function -------------------------------//
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  //----------------------------------- function calls --------------------------------//
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//------------------------------------- END --------------------------------------------//