let endGameExecuted = false;
let clicksEnabled = true;
let score = 0;
let currentInstrumentAudio = null;
let correctAnswers = 0;  // Nuevo contador para las respuestas correctas

function endGame() {
    if (!endGameExecuted) {
        endGameExecuted = true;
        clearInterval(timerInterval);
        document.querySelector(".container").style.display = "none";

        const currentDate = new Date().toLocaleDateString();
        const userData = {
            fecha: currentDate,
            usuario: localStorage.getItem("ActualUs"),
            puntaje: score,
            juegonumero: incrementGameNumber(),
            game: "REGFOL_rcnc"
        };
        const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
        gamesHistory.push(userData);
        localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

        showMessage('Fin del Juego', 'fin');
        setTimeout(() => {
            showMessageWithDelay();
        }, 3000);
    }
}

function showMessageWithDelay() {
    const storedScore = JSON.parse(localStorage.getItem("gamesHistory")).pop().puntaje;
    showMessage(`Puntaje obtenido: ${storedScore}`, 'puntaje');
    fadeOutBackgroundMusic(6);
    setTimeout(() => {
        window.location.href = "out.html";
    }, 7000);
}

function showMessage(text, type) {
    clicksEnabled = false;
    const messageElement = document.getElementById("message");
    messageElement.textContent = text;
    messageElement.className = `found-message ${type}`;

    if (type === 'puntaje') {
        messageElement.style.backgroundColor = '#8ec6e6';
    } else {
        messageElement.style.backgroundColor = '';
    }

    messageElement.style.display = "block";

    let sound;
    if (type === 'correct') {
        sound = new Audio('Sound/correcto.mp3');
    } else if (type === 'error') {
        sound = new Audio('Sound/error.mp3');
    } else if (type === 'fin') {
        sound = new Audio('Sound/Fin del Juego.mp3');
    }

    if (sound && type !== 'puntaje') {
        sound.play();
    }

    let duration = 1000;

    if (type === 'fin') {
        duration = 2000;
    } else if (type === 'puntaje') {
        duration = 6000;
    }

    setTimeout(() => {
        messageElement.style.display = "none";
        clicksEnabled = true;
    }, duration);
}

function fadeOutBackgroundMusic(duration) {
    const audio = document.getElementById("background-music");
    const initialVolume = audio.volume;
    const fadeOutInterval = setInterval(() => {
        audio.volume -= initialVolume / (duration * 10);
        if (audio.volume <= 0) {
            clearInterval(fadeOutInterval);
            audio.pause();
            audio.volume = initialVolume;
        }
    }, 100);
}

function incrementGameNumber() {
    let gameNumber = parseInt(localStorage.getItem("gameNumber")) || 0;
    gameNumber++;
    localStorage.setItem("gameNumber", gameNumber);
    return gameNumber;
}

const instruments = [
    { name: "01", type: "CE", sound: "Sound/Ejemplos/01.mp3" },
    { name: "02", type: "CE", sound: "Sound/Ejemplos/02.mp3" },
    { name: "03", type: "CE", sound: "Sound/Ejemplos/03.mp3" },
    { name: "04", type: "CE", sound: "Sound/Ejemplos/04.mp3" },
    { name: "05", type: "CU", sound: "Sound/Ejemplos/05.mp3" },
    { name: "06", type: "CU", sound: "Sound/Ejemplos/06.mp3" },
    { name: "07", type: "LI", sound: "Sound/Ejemplos/07.mp3" },
    { name: "08", type: "LI", sound: "Sound/Ejemplos/08.mp3" },
    { name: "09", type: "LI", sound: "Sound/Ejemplos/09.mp3" },
    { name: "10", type: "LI", sound: "Sound/Ejemplos/10.mp3" },
    { name: "11", type: "LI", sound: "Sound/Ejemplos/11.mp3" },
    { name: "12", type: "LI", sound: "Sound/Ejemplos/12.mp3" },
    { name: "13", type: "LI", sound: "Sound/Ejemplos/13.mp3" },
    { name: "14", type: "NO", sound: "Sound/Ejemplos/14.mp3" },
    { name: "15", type: "NO", sound: "Sound/Ejemplos/15.mp3" },
    { name: "16", type: "NO", sound: "Sound/Ejemplos/16.mp3" },
    { name: "17", type: "NO", sound: "Sound/Ejemplos/17.mp3" },
    { name: "18", type: "NO", sound: "Sound/Ejemplos/18.mp3" },
    { name: "19", type: "LI", sound: "Sound/Ejemplos/19.mp3" },
    { name: "20", type: "PA", sound: "Sound/Ejemplos/20.mp3" },
    { name: "21", type: "CE", sound: "Sound/Ejemplos/21.mp3" },
    { name: "22", type: "PA", sound: "Sound/Ejemplos/22.mp3" },
    { name: "23", type: "PA", sound: "Sound/Ejemplos/23.mp3" },
    { name: "24", type: "CU", sound: "Sound/Ejemplos/24.mp3" },
    { name: "25", type: "CU", sound: "Sound/Ejemplos/25.mp3" },
    { name: "26", type: "PA", sound: "Sound/Ejemplos/26.mp3" },
    { name: "27", type: "PA", sound: "Sound/Ejemplos/27.mp3" },
    { name: "28", type: "CE", sound: "Sound/Ejemplos/28.mp3" },
    { name: "29", type: "CE", sound: "Sound/Ejemplos/29.mp3" },
    { name: "30", type: "NO", sound: "Sound/Ejemplos/30.mp3" }

];

let currentInstrument;
let totalTimeInSeconds = 420;
let errors = 0;
let timerInterval;
let buttonsEnabled = true;

function startGame() {
    endGameExecuted = false;
    totalTimeInSeconds = 420;
    errors = 0;
    correctAnswers = 0;  // Reiniciar el contador de respuestas correctas
    score = 0;
    document.getElementById("reloj").textContent = `Tiempo: 07:00`;
    updateErrorsDisplay();
    shuffleInstruments();

    // Deshabilitar los clics inicialmente
    disableClicks();

    // Pausa de 10 segundos
    setTimeout(() => {
        // Habilitar los clics después de 9 segundos
        enableClicks();
        showNextInstrument();
        startTimer();
    }, 10000);
}

function disableClicks() {
    clicksEnabled = false;
}

function enableClicks() {
    clicksEnabled = true;
}

function shuffleInstruments() {
    for (let i = instruments.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [instruments[i], instruments[j]] = [instruments[j], instruments[i]];
    }
}

function showNextInstrument() {
    if (instruments.length > 0) {
        currentInstrument = instruments.pop();
        document.getElementById("instrument-button").addEventListener("click", playInstrumentSound);
    } else {
        endGame();
    }
}

function playInstrumentSound() {
    if (currentInstrumentAudio) {
        currentInstrumentAudio.pause();
    }
    currentInstrumentAudio = new Audio(currentInstrument.sound);
    currentInstrumentAudio.play();
}

function startTimer() {
    updateTimerDisplay(totalTimeInSeconds);
    timerInterval = setInterval(() => {
        totalTimeInSeconds--;
        updateTimerDisplay(totalTimeInSeconds);

        if (totalTimeInSeconds <= 0 || errors >= 5) {
            clearInterval(timerInterval);
            endGame();
        } else {
            score = correctAnswers * 10 + totalTimeInSeconds * 5;  // Actualizar la fórmula del puntaje
            updateScoreDisplay(score);
        }
    }, 1000);
}

function updateTimerDisplay(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    document.getElementById("reloj").textContent = `Tiempo: ${formattedTime}`;
}

function updateErrorsDisplay() {
    document.getElementById("errores").textContent = `Errores: ${errors}/5`;
}

function updateScoreDisplay(score) {
    document.getElementById("score").textContent = `Puntaje: ${score}`;
}

document.getElementById("PA-button").addEventListener("click", function() {
    if (!clicksEnabled) return;
    checkAnswer("PA");
});

document.getElementById("NO-button").addEventListener("click", function() {
    if (!clicksEnabled) return;
    checkAnswer("NO");
});

document.getElementById("LI-button").addEventListener("click", function() {
    if (!clicksEnabled) return;
    checkAnswer("LI");
});

document.getElementById("CU-button").addEventListener("click", function() {
    if (!clicksEnabled) return;
    checkAnswer("CU");
});

document.getElementById("CE-button").addEventListener("click", function() {
    if (!clicksEnabled) return;
    checkAnswer("CE");
});

function checkAnswer(selectedType) {
    if (!clicksEnabled) return;
    if (selectedType === currentInstrument.type) {
        showMessage('CORRECTO', 'correct');
        totalTimeInSeconds += 10;
        correctAnswers++;  // Incrementar el contador de respuestas correctas
    } else {
        showMessage('ERROR', 'error');
        totalTimeInSeconds -= 15;
        errors++;
        updateErrorsDisplay();
    }
    showNextInstrument();
}

window.addEventListener("load", function() {
    const actualUsername = localStorage.getItem("ActualUs");
    document.getElementById("actualUsername").textContent = `Usuario: ${actualUsername}`;

    // Inicializa el audio y configura el evento ended
    const backgroundMusic = document.getElementById("background-music");
    const loopMusicSource = document.getElementById("loop-music-source");
    
    backgroundMusic.addEventListener("ended", function() {
        // Cambia la fuente del audio al bucle infinito y reproduce
        backgroundMusic.src = loopMusicSource.src;
        backgroundMusic.loop = true;
        backgroundMusic.play();
    });
});

document.getElementById("start-button").addEventListener("click", function() {
    const startButtonContainer = document.getElementById("start-button-container");
    startButtonContainer.style.display = "none";

    const container = document.querySelector(".container");
    container.style.display = "block";

    const audio = document.getElementById("background-music");
    audio.play();

    startGame();
});
