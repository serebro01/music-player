//
// === EDIT THIS SECTION ===
//
const playlist = [
    {
        title: "Generated_song",
        src: "https://drive.google.com/file/d/1heasDDInzGLgZeywJaM5e_FL9SBtyKMv/view?usp=sharing"
    },
    {
        title: "Corporate Ukulele & Whistle",
        src: "https://drive.google.com/uc?export=download&id=1h5G6uikO8m5yDvo522aBPYQ2V3f2w-iG"
    },
    {
        title: "Peaceful & Relaxing",
        src: "https://drive.google.com/uc?export=download&id=1tS_J2aGvif2o-sIjkVvV4y5u1I1A0_7a"
    }
    // Add more songs here following the same format
    // {
    //     title: "Your Song Title",
    //     src: "YOUR_DIRECT_GOOGLE_DRIVE_LINK"
    // },
];
//
// === END OF EDIT SECTION ===
//


// Player elements
const audio = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const playlistElement = document.getElementById('playlist');

// Player state
let currentTrackIndex = 0;
let isPlaying = false;

// Generate playlist in HTML
function generatePlaylist() {
    playlistElement.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.title;
        li.setAttribute('data-index', index);
        playlistElement.appendChild(li);
    });
}

// Load a track
function loadTrack(index) {
    const track = playlist[index];
    trackTitle.textContent = track.title;
    audio.src = track.src;
    currentTrackIndex = index;
    
    // Highlight active track
    document.querySelectorAll('#playlist li').forEach(li => {
        li.classList.remove('active');
    });
    playlistElement.querySelector(`li[data-index="${index}"]`).classList.add('active');
}

// Play/Pause functionality
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.textContent = '▶️';
    } else {
        audio.play();
        playPauseBtn.textContent = '⏸️';
    }
    isPlaying = !isPlaying;
}

// Next/Previous track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Go to next song when current one ends
audio.addEventListener('ended', nextTrack);

// Click on playlist item to play
playlistElement.addEventListener('click', (e) => {
    if (e.target && e.target.matches('li')) {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        loadTrack(index);
        audio.play();
        isPlaying = true;
        playPauseBtn.textContent = '⏸️';
    }
});

// Initialize
generatePlaylist();
loadTrack(0); // Load the first track by default
