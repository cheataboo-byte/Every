/* ==========================================================================
   1. CUSTOM LAUFEY MOUSE POINTER TRACKER
   ========================================================================== */
const customCursor = document.getElementById('laufey-cursor-container');

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
    'Yoyoyo, Piseth! What day is it?💖',
    'Why did the poop not cross the road? Because...it had a crappy day! gugugugugugu 🎀',
    'Wobble Wobble, Joggle Joggle Joggle, Diggi Di Doo, Dag Dag! 🍰',
    'Happy Birthday & Christmas! You have been a very good subject this year. 💕',
    'Keep guessing that password if you want more music! 👀'
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
   3. BEABADOOBEE PLAYER CONTROLS & AUDIO ATTACHMENT
   ========================================================================== */
const tracklist = [
    { title: 'Sun Has Set', src: '../Sun Has Set.mp3' },
    { title: 'Estranged', src: '../beabadoobee - Estranged (Official Lyric Video).mp3' },
    { title: 'In Motion', src: '../beabadoobee - In Motion (Official Lyric Video).mp3' },
    { title: "It's Alright", src: "../beabadoobee - It's Alright (Official Lyric Video).mp3" },
    { title: 'Nothing To Prove', src: '../beabadoobee - Nothing To Prove (Official Lyric Video).mp3' },
    { title: 'Powerlines', src: '../beabadoobee - Powerlines (Official Lyric Video).mp3' },
    { title: 'Radio', src: '../beabadoobee - Radio (Official Lyric Video).mp3' },
    { title: 'Spark', src: '../beabadoobee - Spark (Official Lyric Video).mp3' },
    { title: 'Switchblade', src: '../beabadoobee - Switchblade (Official Lyric Video).mp3' },
    { title: 'Write Me A Letter', src: '../Beabadoobee - Write Me A Letter (Official Video).mp3' },
    { title: 'Despite That', src: '../Despite That.mp3' },
    { title: 'Pylon', src: '../pylon.mp3' }
];

const breakAfterTrack = new Map([[2, 1], [5, 2], [8, 3]]);
const playbackQueue = [];

tracklist.forEach((track, songIndex) => {
    playbackQueue.push({ ...track, type: 'song', songIndex });

    const breakNumber = breakAfterTrack.get(songIndex);
    if (breakNumber) {
        playbackQueue.push({
            title: `Break ${breakNumber}`,
            src: `../break ${breakNumber}.mp3`,
            type: 'break',
            breakNumber
        });
    }
});

let runningQueueIndex = 0;
let isMusicPlaying = false;
let isPlaylistUnlocked = false;
let isLooping = false;

const songTitleElement = document.getElementById('current-song-title');
const playButtonElement = document.getElementById('btn-play');
const nextButtonElement = document.getElementById('btn-next');
const prevButtonElement = document.getElementById('btn-prev');
const albumDiskGraphic = document.getElementById('album-art-placeholder');
const progressBarElement = document.getElementById('player-progress');
const volumeSliderElement = document.getElementById('player-volume');
const timeDisplayElement = document.getElementById('time-display');
const repeatButtonElement = document.getElementById('btn-repeat');
const audioPlayer = new Audio();

audioPlayer.volume = 0.7;
if (volumeSliderElement) {
    volumeSliderElement.value = String(audioPlayer.volume);
}

function formatTime(totalSeconds) {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
        return '0:00';
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function updateProgressBar() {
    if (!audioPlayer.duration || Number.isNaN(audioPlayer.duration)) {
        if (progressBarElement) progressBarElement.value = 0;
        if (timeDisplayElement) timeDisplayElement.textContent = '0:00 / 0:00';
        return;
    }

    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    if (progressBarElement) progressBarElement.value = String(progress);
    if (timeDisplayElement) {
        timeDisplayElement.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
    }
}

function updateSongDisplay() {
    if (songTitleElement) {
        const currentEntry = playbackQueue[runningQueueIndex];
        songTitleElement.innerText = currentEntry.type === 'break'
            ? `Break ${currentEntry.breakNumber} of 3 - Please listen`
            : currentEntry.title;
    }
}

function setPlayButtonLabel() {
    if (!playButtonElement) return;
    const currentEntry = playbackQueue[runningQueueIndex];
    const label = currentEntry.type === 'break' ? 'Break' : 'Track';
    playButtonElement.innerText = isMusicPlaying ? `⏸️ Pause ${label}` : `▶️ Play ${label}`;
}

function updateControlsForCurrentEntry() {
    const isBreak = playbackQueue[runningQueueIndex].type === 'break';
    if (nextButtonElement) nextButtonElement.disabled = isBreak;
    if (prevButtonElement) prevButtonElement.disabled = isBreak;
    if (progressBarElement) progressBarElement.disabled = isBreak;
}

function loadTrack(index, autoPlay = false) {
    const entry = playbackQueue[index];
    if (!entry) return;

    runningQueueIndex = index;
    audioPlayer.loop = false;
    audioPlayer.src = entry.src;
    audioPlayer.load();
    updateSongDisplay();
    updateControlsForCurrentEntry();
    updateProgressBar();

    if (autoPlay) {
        audioPlayer.play().catch(() => {
            console.log('Audio playback was blocked until user interaction.');
        });
    }
}

if (playButtonElement && albumDiskGraphic) {
    playButtonElement.addEventListener('click', () => {
        const currentEntry = playbackQueue[runningQueueIndex];
        if (!isPlaylistUnlocked && currentEntry.type === 'song' && currentEntry.songIndex > 0) {
            if (speechBubbleElement) {
                speechBubbleElement.innerHTML = '<p>💬 <em>"Access Denied! Solve the puzzle first, subject! 🔒"</em></p>';
            }
            return;
        }

        isMusicPlaying = !isMusicPlaying;
        setPlayButtonLabel();

        if (isMusicPlaying) {
            albumDiskGraphic.style.animationPlayState = 'running';
            if (audioPlayer.src) {
                audioPlayer.play().catch(() => {
                    console.log('Audio playback was blocked until user interaction.');
                });
            } else {
                loadTrack(runningTrackIndex, true);
            }
        } else {
            albumDiskGraphic.style.animationPlayState = 'paused';
            audioPlayer.pause();
        }
    });
}

if (prevButtonElement) {
    prevButtonElement.addEventListener('click', () => {
        if (playbackQueue[runningQueueIndex].type === 'break') return;

        const previousIndex = (runningQueueIndex - 1 + playbackQueue.length) % playbackQueue.length;
        const previousEntry = playbackQueue[previousIndex];
        if (!isPlaylistUnlocked && previousEntry.type === 'song' && previousEntry.songIndex > 0) return;
        loadTrack(previousIndex, isMusicPlaying);
    });
}

if (nextButtonElement) {
    nextButtonElement.addEventListener('click', () => {
        if (playbackQueue[runningQueueIndex].type === 'break') return;

        const nextIndex = (runningQueueIndex + 1) % playbackQueue.length;
        const nextEntry = playbackQueue[nextIndex];
        if (!isPlaylistUnlocked && nextEntry.type === 'song' && nextEntry.songIndex > 0) {
            if (speechBubbleElement) {
                speechBubbleElement.innerHTML = '<p>💬 <em>"Access Denied! Solve the puzzle first, subject! 🔒"</em></p>';
            }
            return;
        }

        loadTrack(nextIndex, isMusicPlaying);
    });
}

if (progressBarElement) {
    progressBarElement.addEventListener('input', (event) => {
        const targetPercent = Number(event.target.value);
        if (!audioPlayer.duration || Number.isNaN(audioPlayer.duration)) return;
        audioPlayer.currentTime = (targetPercent / 100) * audioPlayer.duration;
        updateProgressBar();
    });
}

if (volumeSliderElement) {
    volumeSliderElement.addEventListener('input', (event) => {
        const value = Number(event.target.value);
        audioPlayer.volume = value;
    });
}

if (repeatButtonElement) {
    repeatButtonElement.addEventListener('click', () => {
        isLooping = !isLooping;
        audioPlayer.loop = isLooping;
        repeatButtonElement.textContent = isLooping ? '🔁 Repeat On' : '🔁 Repeat Off';
    });
}

audioPlayer.addEventListener('play', () => {
    isMusicPlaying = true;
    setPlayButtonLabel();
});

audioPlayer.addEventListener('pause', () => {
    isMusicPlaying = false;
    setPlayButtonLabel();
});

audioPlayer.addEventListener('timeupdate', updateProgressBar);

audioPlayer.addEventListener('ended', () => {
    const currentEntry = playbackQueue[runningQueueIndex];
    const nextIndex = (runningQueueIndex + 1) % playbackQueue.length;
    const nextEntry = playbackQueue[nextIndex];

    if (isLooping && currentEntry.type === 'song' && nextEntry.type !== 'break') {
        loadTrack(runningQueueIndex, true);
        return;
    }

    loadTrack(nextIndex, true);
});

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

        if (userInput.trim() === 'Chair was here.') {
            isPlaylistUnlocked = true;

            if (nextButtonElement) {
                nextButtonElement.innerText = 'Next ⏭️';
                nextButtonElement.style.backgroundColor = 'var(--pastel-peach)';
                nextButtonElement.style.opacity = '1';
            }

            if (speechBubbleElement) {
                speechBubbleElement.innerHTML = '<p>💬 <em>"Impressive! You cracked it. You may now enjoy the rest of the playlist! 🔓"</em></p>';
            }

            if (lockSectionBox) {
                lockSectionBox.style.borderColor = 'var(--pastel-mint)';
            }

            if (hintSectionBox) {
                hintSectionBox.innerHTML = '<p style="color: green; margin:0; font-weight: bold;">🎉 Unlocked Successfully! Enjoy the tracks, Piseth!</p>';
            }
        } else {
            if (speechBubbleElement) {
                speechBubbleElement.innerHTML = '<p>💬 <em>"Wrong phrase! Try harder, dear subject... ❌"</em></p>';
            }
        }
    });
}

updateSongDisplay();
loadTrack(0, false);
setPlayButtonLabel();
if (repeatButtonElement) repeatButtonElement.textContent = '🔁 Repeat Off';
if (progressBarElement) progressBarElement.value = '0';
if (timeDisplayElement) timeDisplayElement.textContent = '0:00 / 0:00';


