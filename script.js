const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const songs = [
    {
        title: "Night Sky",
        artist: "Lofi Beats",
        src: "assets/songs/song1.mp3",
        cover: "assets/images/cover1.png"
    },
    {
        title: "Lofi Dreams",
        artist: "Lofi",
        src: "assets/songs/song2.mp3",
        cover: "assets/images/cover2.png"
    },
    {
        title: "Lofi Girl",
        artist: "Lofi",
        src: "assets/songs/song3.mp3",
        cover: "assets/images/cover3.png"
    }
];

let currentSong = 0;
let isPlaying = false;
let repeat = false;

/* ===========================
   Utility Functions
=========================== */

function formatTime(time) {
    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/* ===========================
   Player Functions
=========================== */

function loadSong(song) {
    title.textContent = song.title;
    artist.textContent = song.artist;
    cover.src = song.cover;
    audio.src = song.src;

    audio.load();

    currentTime.textContent = "0:00";
    progress.value = 0;

    localStorage.setItem("currentSong", currentSong);

    highlightCurrentSong();
}

function playSong() {
    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            cover.classList.add("playing");
        })
        .catch(error => console.log(error));
}

function pauseSong() {
    audio.pause();
    isPlaying = false;

    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    cover.classList.remove("playing");
}

function nextSong() {
    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(songs[currentSong]);

    if (isPlaying) playSong();
}

function prevSong() {
    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(songs[currentSong]);

    if (isPlaying) playSong();
}

function shuffleSong() {
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSong);

    currentSong = randomIndex;

    loadSong(songs[currentSong]);

    if (isPlaying) playSong();
}

function toggleRepeat() {
    repeat = !repeat;
    repeatBtn.classList.toggle("active", repeat);
}

/* ===========================
   Playlist Functions
=========================== */

function createPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${song.title}</strong><br>
            <small>${song.artist}</small>
        `;

        li.addEventListener("click", () => {
            currentSong = index;
            loadSong(songs[currentSong]);
            playSong();
        });

        playlist.appendChild(li);
    });

    highlightCurrentSong();
}

function highlightCurrentSong() {

    const items = playlist.querySelectorAll("li");

    items.forEach((item, index) => {

        if (index === currentSong) {

            item.classList.add("active");

            item.innerHTML = `
                <i class="fa-solid fa-play"></i>
                <strong>${songs[index].title}</strong><br>
                <small>${songs[index].artist}</small>
            `;

        } else {

            item.classList.remove("active");

            item.innerHTML = `
                <strong>${songs[index].title}</strong><br>
                <small>${songs[index].artist}</small>
            `;

        }

    });

}

/* ===========================
   Event Listeners
=========================== */

playBtn.addEventListener("click", () => {
    isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
shuffleBtn.addEventListener("click", shuffleSong);
repeatBtn.addEventListener("click", toggleRepeat);

progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
});

volume.addEventListener("input", () => {
    audio.volume = volume.value / 100;
    localStorage.setItem("volume", volume.value);
});

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
    progress.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);
    progress.value = Math.floor(audio.currentTime);
});

audio.addEventListener("ended", () => {
    if (repeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

/* ===========================
   Initialization
=========================== */

const savedSong = localStorage.getItem("currentSong");

if (savedSong !== null) {
    currentSong = Number(savedSong);
}

const savedVolume = localStorage.getItem("volume");

if (savedVolume !== null) {
    volume.value = savedVolume;
    audio.volume = savedVolume / 100;
} else {
    volume.value = 100;
    audio.volume = 1;
}

createPlaylist();
loadSong(songs[currentSong]);