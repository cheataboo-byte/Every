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
    { title: 'Sun Has Set', src: 'Sun Has Set.mp3' },
    { title: 'Estranged', src: 'estrranged.mp3' },
    { title: 'In Motion', src: 'In Motion.mp3' },
    { title: "It's Alright", src: "It's Alright.mp3" },
    { title: 'Nothing To Prove', src: 'Nothing to prove.mp3' },
    { title: 'Powerlines', src: 'Powerlines.mp3' },
    { title: 'Radio', src: 'Radio.mp3' },
    { title: 'Spark', src: 'Spark.mp3' },
    { title: 'Switchblade', src: 'Switchblade.mp3' },
    { title: 'Write Me A Letter', src: 'Write me a letter.mp3' },
    { title: 'Despite That', src: 'Despite That.mp3' },
    { title: 'Pylon', src: 'pylon.mp3' }
];

const breakAfterTrack = new Map([[2, 1], [5, 2], [8, 3]]);
const playbackQueue = [];

tracklist.forEach((track, songIndex) => {
    playbackQueue.push({ ...track, type: 'song', songIndex });

    const breakNumber = breakAfterTrack.get(songIndex);
    if (breakNumber) {
        playbackQueue.push({
            title: `Break ${breakNumber}`,
            src: `break ${breakNumber}.mp3`,
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
const memoryAudioElement = document.getElementById('memory-audio');

audioPlayer.volume = 0.7;
if (memoryAudioElement) memoryAudioElement.volume = audioPlayer.volume;
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
        if (memoryAudioElement) memoryAudioElement.volume = value;
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

const memoryLetters = {
    'birthday-cutie': {
        title: 'Birthday cutie',
        message: 'Looking back at this, I still think about the school community trip in 8th grade where everything started. I clicked with you instantly, and discovering you was a chapter of my life I genuinely cherished. For a long time, we built beautiful, irreplaceable memories in those early days, and no matter what changed later, the sincerity of that friendship was 100% real. I keep this photo here because it represents the version of us that made me glad we crossed paths.'
    },
    'game-night': {
        title: 'Game night',
        message: 'That day when you told me Rainsey had turned his back at me, meant more to me than I think you ever fully understood. When Rainsey betrayed my trust after all those years, I was completely broken down. But when you stepped up and rawly told me the truth, In that exact moment, I truly believed you were a keeper. You showed up for me when I felt completely discarded by someone else, and the fact that i could have never known and lived with a liar. That loyalty is something I will never forget or take for granted, regardless of where we stand now.'
    },
    'silly-moments': {
        title: 'Silly moments',
        requiresPassword: true,
        message: 'If you are reading this, you figured out the code. I wanted to use this space to finally say the things I couldn\'t say while I was busy trying to survive my own head. The truth is, I loved you deeply—but I loved you sincerely as my person and companion. I think you fell in love with a mask: the pretty, confident, perfect version of me that everyone else sees from the outside. But real love means seeing the critical, realistic, and unpolished parts underneath. I spent 20 hours coding this entire website for you because the friend you were to me mattered. Even if you chose to walk away from the group chat and from our friendship after the label was gone, I wanted to finish this to honor the person I thought you were. Take care of yourself, and grow into the person I always knew you had the potential to be.\n\nP.S Don\'t treat the next girl like how you treated me, maybe she could tolerate it. But for the best, I suggest you become the absolute perfect and best person for whoever this new girl could be'
    },
    'cutest-ever': {
        title: 'Cutest ever',
        message: 'I know you spend so much of your time wrapped up in romance anime, looking for those perfect, scripted storylines. But real life isn\'t an anime, Piseth. It\'s messy, it\'s serious, and sometimes it\'s full of heavy, complex things that make us uncomfortable. My situations are indeed hard for you to relate, but seeing you associate with the people that ruined my teenage years do sting sometimes. Sometimes, it showed me how hard it is for you to look past the surface. I never fit into the easy, perfect box you wanted me to be in, because I am a real person with my own battles to fight. Idk how to save this connection when I\'m so hyperfixated if I\'m gonna go stupid and crazy after i hit my head. It was a very interesting week Piseth. I thought you were trying to kill me on purpose, or were you? Lmfao'
    },
    'little-familiar': {
        title: 'Little familiar',
        message: 'The night, My head was pounding, my knee was scraped up, and we had just closed the door on our relationship. But then, the most unbelievable thing happened! Xiaomi came back! With a interesting looking ear...and three legs only. Idk what happened to the other one. Bro has been living on the roofs of houses that are at the streets wayyyy behind us. He was fed by a christian couple who owned a little churche back there and they didnt let him out. Yes Xiaomi, who had been missing for months, suddenly walked back through the door. While you were leaving the group chat and cutting ties, Xiaomi came back and It felt like a quiet apology from the universe for everything I had been put through this past week. It reminded me that even when things fall apart, the things that truly belong in my life will always find their way back.'
    }
};

const memoryDialog = document.getElementById('memory-modal');
const memoryTitleElement = document.getElementById('memory-title');
const memoryPasswordForm = document.getElementById('memory-password-form');
const memoryPasswordElement = document.getElementById('memory-password');
const memoryPasswordError = document.getElementById('memory-password-error');
const memoryLetterElement = document.getElementById('memory-letter');
const memoryMessageElement = document.getElementById('memory-message');
let resumePlaylistAfterMemory = false;
let focusBeforeMemory = null;

function openMemory(memoryId) {
    const memory = memoryLetters[memoryId];
    if (!memory || !memoryDialog || memoryDialog.open) return;

    focusBeforeMemory = document.activeElement;
    resumePlaylistAfterMemory = !audioPlayer.paused;
    if (resumePlaylistAfterMemory) audioPlayer.pause();

    memoryTitleElement.textContent = memory.title;
    memoryMessageElement.textContent = memory.message;
    memoryPasswordForm.hidden = !memory.requiresPassword;
    memoryLetterElement.hidden = Boolean(memory.requiresPassword);
    memoryPasswordError.hidden = true;
    memoryPasswordElement.value = '';
    memoryDialog.showModal();
    if (customCursor) memoryDialog.append(customCursor);

    if (memoryAudioElement) {
        memoryAudioElement.volume = audioPlayer.volume;
        memoryAudioElement.currentTime = 0;
        memoryAudioElement.play().catch(() => {});
    }

    if (memory.requiresPassword) {
        memoryPasswordElement.focus();
    } else {
        document.getElementById('memory-close').focus();
    }
}

document.querySelectorAll('.memory-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => openMemory(trigger.dataset.memory));
    trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openMemory(trigger.dataset.memory);
        }
    });
});

memoryPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const enteredDate = memoryPasswordElement.value.trim().toLowerCase().replace(/\s+/g, ' ');
    const validDates = new Set([
        '17th december 2024',
        '17 december 2024',
        '17/12/2024',
        '17-12-2024',
        '2024-12-17'
    ]);

    if (validDates.has(enteredDate)) {
        memoryPasswordForm.hidden = true;
        memoryPasswordError.hidden = true;
        memoryLetterElement.hidden = false;
        document.getElementById('memory-close-footer').focus();
    } else {
        memoryPasswordError.hidden = false;
        memoryPasswordElement.focus();
        memoryPasswordElement.select();
    }
});

function closeMemory() {
    if (memoryDialog.open) memoryDialog.close();
}

document.getElementById('memory-close').addEventListener('click', closeMemory);
document.getElementById('memory-close-footer').addEventListener('click', closeMemory);
memoryDialog.addEventListener('click', (event) => {
    if (event.target === memoryDialog) closeMemory();
});
memoryDialog.addEventListener('close', () => {
    if (customCursor) document.body.prepend(customCursor);

    if (memoryAudioElement) {
        memoryAudioElement.pause();
        memoryAudioElement.currentTime = 0;
    }

    if (resumePlaylistAfterMemory) {
        audioPlayer.play().catch(() => {});
    }

    if (focusBeforeMemory instanceof HTMLElement) focusBeforeMemory.focus();
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


