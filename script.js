//
// === EDIT THIS SECTION ===
// Note: The LAST item in the list should NOT have a comma after its closing }
//
const playlist = [
    {
        title: "Generated_song",
        src: "https://drive.google.com/uc?export=download&id=1heasDDInzGLgZeywJaM5e_FL9SBtyKMv"
    },
    {
        title: "Sub Stele de Dor (generated)",
        src: "https://drive.google.com/uc?export=download&id=1RNMCiEsTuO7-Cp4brCb5X981o0kcl5fR"
    },
    {
        title: "Последний день весны 1 (generated)",
        src: "https://drive.google.com/uc?export=download&id=1QEwImybeAOe6Duyf690wrpcsbjiysNFb"
    },
    {
        title: "Последний день весны 2 (generated)",
        src: "https://drive.google.com/uc?export=download&id=1gqpzBe6IOKcYiTAgbiEKZ3tJX7fRY2o5"
    },
    {
        title: "Бибигон II",
        src: "https://drive.google.com/uc?export=download&id=1wGwHsuh6G5kr1sfiNEJ5989Jl-8DFc-D"
    }
   // <-- No comma after the last item!
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
// FIX for Autoplay Policy: Track if the user has interacted yet
let hasInteracted = false; 

// Generate playlist in HTML
function generatePlaylist() {
     if (!playlist || playlist.length === 0) {
         trackTitle.textContent = "Playlist is empty";
         console.warn("Playlist array is empty or not defined.");
         playPauseBtn.disabled = true;
         nextBtn.disabled = true;
         prevBtn.disabled = true;
         return;
     }
    playlistElement.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.title;
        li.setAttribute('data-index', index);
         // Basic error check in case a title is missing
         if (!track.title) { li.textContent = "Untitled Track " + (index + 1); }
         if (!track.src) { 
            li.textContent += " [ERROR: Missing Link]";
            li.style.color = 'red';
            li.style.cursor = 'not-allowed';
         }
        playlistElement.appendChild(li);
    });
}

// Load a track's INFO, but don't set the audio src yet
// This prevents the browser autoplay policy error on page load
function prepareTrack(index) {
     if (!playlist || playlist.length === 0) return; // Guard clause

    // Ensure index is within bounds
     if (index < 0 || index >= playlist.length) {
        index = 0; 
     }
      currentTrackIndex = index;
      const track = playlist[index];
      
      // Update title, handle missing title
      trackTitle.textContent = track.title || "Untitled Track " + (index + 1);
       if (!track.src) {
           trackTitle.textContent += " [ERROR: Missing Link]";
        }
    
    // Highlight active track in the list
    document.querySelectorAll('#playlist li').forEach(li => {
        li.classList.remove('active');
    });
     const activeLi = playlistElement.querySelector(`li[data-index="${index}"]`);
     if(activeLi){
        activeLi.classList.add('active');
     }
}

// Full load and play a track. Only call after user interaction.
function playTrack(index) {
     if (!playlist || playlist.length === 0) return; // Guard clause
    
     // Ensure index is within bounds
      if (index < 0 || index >= playlist.length) {
        index = 0; 
      }
      
      const track = playlist[index];
       if(!track.src) {
         console.error("Cannot play track: source URL is missing for index", index);
         prepareTrack(index); // update UI but don't try to play
         isPlaying = false;
         playPauseBtn.textContent = '▶️';
         return; // Stop if no source link
       }
       
      prepareTrack(index);    // Update UI
      audio.src = track.src; // Set the source right before playing
      
      // audio.play() returns a Promise
      const playPromise = audio.play(); 
      
       if (playPromise !== undefined) {
          playPromise.then(_ => {
             // Playback started successfully
             isPlaying = true;
             playPauseBtn.textContent = '⏸️';
             hasInteracted = true; // Mark as interacted
          })
          .catch(error => {
             // Autoplay was prevented, or other error.
             console.error("Playback failed:", error);
             isPlaying = false;
             playPauseBtn.textContent = '▶️';
              // Show user feedback if needed, e.g., "Click play to start"
          });
        } else {
           // Fallback for older browsers
            isPlaying = true;
            playPauseBtn.textContent = '⏸️';
            hasInteracted = true; 
        }
}

 function pauseTrack() {
      audio.pause();
      playPauseBtn.textContent = '▶️';
      isPlaying = false;
 }


// Play/Pause functionality
function togglePlayPause() {
     if (!playlist || playlist.length === 0 || !playlist[currentTrackIndex].src) return; // Guard clause

    // Check if user has interacted before trying to play
    if (!hasInteracted || !audio.src) {
       // First interaction or source not loaded: load and play
       playTrack(currentTrackIndex);
    } else if (isPlaying) {
       // Already playing: pause
       pauseTrack();
    } else {
       // Paused: resume play (or start if error occurred)
       playTrack(currentTrackIndex); 
    }
}

// Next/Previous track - these automatically try to play
function nextTrack() {
     if (!playlist || playlist.length === 0) return; 
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playTrack(currentTrackIndex);
}

function prevTrack() {
    if (!playlist || playlist.length === 0) return; 
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentTrackIndex);
}

// --- Event Listeners ---

playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Go to next song when current one ends
audio.addEventListener('ended', nextTrack);

 // Error handling for the audio element itself
 audio.addEventListener('error', (e) => {
    console.error("Audio element error:", e, "Track:", playlist[currentTrackIndex]);
     trackTitle.textContent = `Error playing: ${playlist[currentTrackIndex].title || 'track'}`;
      pauseTrack();
 });


// Click on playlist item to play
playlistElement.addEventListener('click', (e) => {
    // Check if the clicked element is an LI and has a data-index
    if (e.target && e.target.matches('li') && e.target.hasAttribute('data-index')) {
         const index = parseInt(e.target.getAttribute('data-index'), 10);
          // Check if the track has a source before trying to play
          if (playlist[index] && playlist[index].src) {
               // Don't replay if the user clicks the currently playing track
                if (index === currentTrackIndex && isPlaying) {
                   return; 
                }
                 playTrack(index);
          } else {
             console.warn("Cannot play: Track or source missing for index", index);
              prepareTrack(index); // Just highlight it
               pauseTrack(); // Ensure player is stopped
          }
    }
});

// --- Initialize ---
generatePlaylist();
// Prepare the first track's info (title, active state), but DO NOT load audio.src
prepareTrack(0); 
// Set initial state explicitly
playPauseBtn.textContent = '▶️';
