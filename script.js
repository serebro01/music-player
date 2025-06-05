//
// === EDIT THIS SECTION ===
// Note: The LAST item in the list should NOT have a comma after its closing }
//
const playlist = [
    {
        title: "Generated_song",
        src: "music/TheFileNameOfThisSong.mp3" // Use your actual file names
    },
    {
        title: "Sub Stele de Dor (generated)",
        src: "music/SubSteleDeDor.mp3"
    },
    {
        title: "Последний день весны 1 (generated)",
        src: "music/Vesna_1.mp3"
    },
    {
        title: "Последний день весны 2 (generated)",
        src: "music/Vesna_2.mp3"
    },
    {
        title: "Бибигон II",
        src: "music/Bibigon_II.mp3"
    }
];
//
// === END OF EDIT SECTION ===
//


// --- Player Elements ---
const playerContainer = document.getElementById('player-container');
const audio = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const playlistElement = document.getElementById('playlist');

// --- Player State ---
let currentTrackIndex = 0;
let isPlaying = false;
let hasInteracted = false; // For browser autoplay policies

// --- Helper Functions for Loading Indicator ---
function showLoader() {
    playerContainer.classList.add('is-loading');
    trackTitle.style.display = 'none'; // Hide title to make space for loader
}

function hideLoader() {
    playerContainer.classList.remove('is-loading');
    trackTitle.style.display = 'block'; // Show title again
}

// --- Core Player Logic ---

// Generate playlist in HTML
function generatePlaylist() {
    if (!playlist || playlist.length === 0) {
        trackTitle.textContent = "Playlist is empty";
        playPauseBtn.disabled = true;
        nextBtn.disabled = true;
        prevBtn.disabled = true;
        return;
    }
    playlistElement.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.title || `Untitled Track ${index + 1}`;
        li.setAttribute('data-index', index);
        playlistElement.appendChild(li);
    });
}

// Prepare a track's INFO, but don't load the audio file yet
function prepareTrack(index) {
    if (index < 0 || index >= playlist.length) index = 0;
    
    currentTrackIndex = index;
    const track = playlist[index];
    trackTitle.textContent = track.title || `Untitled Track ${index + 1}`;
    
    // Highlight the active track in the list
    document.querySelectorAll('#playlist li').forEach(li => li.classList.remove('active'));
    const activeLi = playlistElement.querySelector(`li[data-index="${index}"]`);
    if (activeLi) activeLi.classList.add('active');
}

// Fully load and play a track
function playTrack(index) {
    if (!playlist || playlist.length === 0) return;
    if (index < 0 || index >= playlist.length) index = 0;
    
    const track = playlist[index];
    if (!track.src) {
        console.error("Cannot play track: source URL is missing for index", index);
        return;
    }
    
    prepareTrack(index);
    audio.src = track.src;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Playback started successfully
            isPlaying = true;
            playPauseBtn.textContent = '⏸️';
            hasInteracted = true;
        }).catch(error => {
            console.error("Playback failed:", error);
            // Don't hide loader on fail, user needs to click again
            isPlaying = false;
            playPauseBtn.textContent = '▶️';
        });
    }
}

function pauseTrack() {
    audio.pause();
    playPauseBtn.textContent = '▶️';
    isPlaying = false;
}

function togglePlayPause() {
    if (!playlist || playlist.length === 0) return;

    if (!hasInteracted) {
        playTrack(currentTrackIndex);
    } else if (isPlaying) {
        pauseTrack();
    } else {
        // If paused, just resume
        audio.play();
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentTrackIndex);
}

// --- Event Listeners ---

// Main Controls
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Playlist Interaction
playlistElement.addEventListener('click', (e) => {
    if (e.target && e.target.matches('li')) {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        if (index !== currentTrackIndex || !isPlaying) {
            playTrack(index);
        }
    }
});

// Audio Element Event Listeners for Loader and State Management
audio.addEventListener('loadstart', showLoader);
audio.addEventListener('canplay', hideLoader);
audio.addEventListener('playing', () => {
    hideLoader(); // Hide loader as soon as it's truly playing
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
});
audio.addEventListener('pause', () => {
    isPlaying = false;
    playPauseBtn.textContent = '▶️';
});
audio.addEventListener('waiting', showLoader); // Show loader if buffering
audio.addEventListener('ended', nextTrack);   // Go to next song when current one ends
audio.addEventListener('error', (e) => {
    console.error("Audio element error:", e);
    trackTitle.textContent = `Error loading track.`;
    hideLoader();
    pauseTrack();
});

// --- Initialize Player ---
generatePlaylist();
prepareTrack(0); // Prepare the first track's info on page load
