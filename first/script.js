/* ==========================================================================
   1. CUSTOM LAUFEY MOUSE POINTER TRACKER
   ========================================================================== */
const customCursor = document.getElementById('laufey-cursor-container');

// Instantly align style anchors so it renders smoothly over hidden system paths
if (customCursor) {
    customCursor.style.position = 'fixed';
    customCursor.style.zIndex = '9999';
    customCursor.style.pointerEvents = 'none';

    document.addEventListener('mousemove', (event) => {
        customCursor.style.left = event.clientX + 'px';
        customCursor.style.top = event.clientY + 'px';
    });
}

/* ==========================================================================
   2. THE SUPREME LEADER TALKING INTERACTIONS
   ========================================================================== */
const goddessQuotesList = [
    "Greetings, dear subject. You may now offer praise! 👑",
    "Did you remember to appreciate your Goddess today, Piseth? 🎀",
    "I allow you to listen to Beabadoobee in my divine presence. 🍰",
    "Happy Birthday & Christmas! You have been a very good subject this year. 💕",
    "Keep guessing that password if you want more music! 👀"
];
let currentQuoteIndex = 0;
const avatarSection = document.getElementById('avatar-section');
const speechBubbleElement = document.getElementById('goddess-speech-bubble');

if (avatarSection && speechBubbleElement) {
    avatarSection.addEventListener('click', () => {
        currentQuoteIndex = (currentQuoteIndex + 1) % goddessQuotesList.length;
        speechBubbleElement.innerHTML = `<p>💬 <em>"${goddessQuotesList[currentQuoteIndex]}"</em></p>`;
    });
}

/* ==========================================================================
   3. BEABADOOBEE PLAYER CONTROLS & ALBUM SHUFFLING
   ========================================================================== */
const tracklist = [
    "Sun Has Set (Track 1)", 
    "Real Man (Track 2)", 
    "Beaches (Track 3)", 
    "Ever Seen (Track 4)", 
    "One Time (Track 5)"
];
let runningTrackIndex = 0;
let isMusicPlaying = false;
let isPlaylistUnlocked = false; // System lock gate states initialize to active

const songTitleElement = document.getElementById('current-song-title');
const playButtonElement = document.getElementById('btn-play');
const nextButtonElement = document.getElementById('btn-next');
const prevButtonElement = document.getElementById('btn-prev');
const albumDiskGraphic = document.getElementById('album-art-placeholder');

// Playback Trigger Mechanism
if (playButtonElement && albumDiskGraphic) {
    playButtonElement.addEventListener('click', () => {
        isMusicPlaying = !isMusicPlaying;
        if (isMusicPlaying) {
            playButtonElement.innerText = "⏸️ Pause Track";
            albumDiskGraphic.style.animationPlayState = "running"; // Tells CSS disc animation to rotate
        } else {
            playButtonElement.innerText = "▶️ Play Track";
            albumDiskGraphic.style.animationPlayState = "paused";  // Freezes CSS disc animation
        }
    });
}

// Previous Song Cycle Button Router
if (prevButtonElement && songTitleElement) {
    prevButtonElement.addEventListener('click', () => {
        runningTrackIndex = (runningTrackIndex - 1 + tracklist.length) % tracklist.length;
        songTitleElement.innerText = tracklist[runningTrackIndex];
    });
}

// Next Song Cycle Button Router (Monitors gate vault states)
if (nextButtonElement && songTitleElement) {
    nextButtonElement.addEventListener('click', () => {
        if (!isPlaylistUnlocked) {
            if (speechBubbleElement) {
                speechBubbleElement.innerHTML = `<p>💬 <em>"Access Denied! Solve the puzzle first, subject! 🔒"</em></p>`;
            }
            return;
        }
        runningTrackIndex = (runningTrackIndex + 1) % tracklist.length;
        songTitleElement.innerText = tracklist[runningTrackIndex];
    });
}

/* ==========================================================================
   4. THE PASSWORD CRYPT INTEGRATION SYSTEM
   ========================================================================== */
const unlockButton = document.getElementById('btn-unlock');
const passwordInputElement = document.getElementById('playlist-password');
const lockSectionBox = document.getElementById('playlist-lock');
const hintSectionBox = document.getElementById('hint-section');

if (unlockButton && passwordInputElement) {
    unlockButton.addEventListener('click', () => {
        const userInput = passwordInputElement.value;
        
        // .trim() strips away accidental whitespace spacing breaks
        if (userInput.trim() === "Chair was here.") {
            isPlaylistUnlocked = true;
            
            // Visual conversion adjustments for buttons once vault clears
            if (nextButtonElement) {
                nextButtonElement.innerText = "Next ⏭️";
                nextButtonElement.style.backgroundColor = "var(--pastel-peach)";
                nextButtonElement.style.opacity = "1";
            }
            if (speechBubbleElement) {
                speechBubbleElement.innerHTML = `<p>💬 <em>"Impressive! You cracked it. You may now enjoy the rest of the playlist! 🔓"</em></p>`;
            }
            if (lockSectionBox) {
                lockSectionBox.style.borderColor = "var(--pastel-mint)";
            }
            if (hintSectionBox) {
                hintSectionBox.innerHTML = `<p style="color: green; margin:0; font-weight: bold;">🎉 Unlocked Successfully! Enjoy the tracks, Piseth!</p>`;
            }
        } else {
            // Rejection dialogue states if user mismatch occurs
            if (speechBubbleElement) {
                speechBubbleElement.innerHTML = `<p>💬 <em>"Wrong phrase! Try harder, dear subject... ❌"</em></p>`;
            }
        }
    });
}
