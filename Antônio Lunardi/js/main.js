// ==============================
// MAIN - As Sombras de Antônio Lunardi
// ==============================
// ==============================
// AUDIO MANAGER
// ==============================
const AudioManager = {
  currentBgMusic: null,
  playAmbient(locId) {
    if (this.currentBgMusic) {
      this.currentBgMusic.pause();
    }
    const audio = new Audio(`assets/audio/${locId}.mp3`);
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(e => {
      // Ignora erro se o arquivo não existir ou se o navegador bloquear autoplay
      console.warn(`[Audio] Arquivo assets/audio/${locId}.mp3 não encontrado ou bloqueado.`);
    });
    this.currentBgMusic = audio;
  },
  playJumpscare() {
    const audio = new Audio(`assets/audio/jumpscare.mp3`);
    audio.volume = 1.0;
    audio.play().catch(e => {
      console.warn(`[Audio] Arquivo assets/audio/jumpscare.mp3 não encontrado ou bloqueado.`);
    });
  }
};

function startNewGame() {
  GameState.init();
  UI.renderMap();
}

function showTitle() {
  UI.showScreen('title-screen');
  const saved = localStorage.getItem('lunardi_save');
  if (saved) {
    document.getElementById('load-btn').style.display = 'inline-block';
  } else {
    document.getElementById('load-btn').style.display = 'none';
  }
}

let isPaused = false;
let screenBeforePause = null;

function pauseGame() {
  if (GameState.currentScreen === 'title' || GameState.gameOver) return;
  isPaused = true;
  screenBeforePause = GameState.currentScreen;
  document.getElementById('pause-screen').classList.add('active');
}

function resumeGame() {
  isPaused = false;
  document.getElementById('pause-screen').classList.remove('active');
}

function saveGame() {
  try {
    const saveData = {
      day: GameState.day, timeOfDay: GameState.timeOfDay,
      culpritId: GameState.culprit ? GameState.culprit.id : null,
      motivationId: GameState.motivation ? GameState.motivation.id : null,
      clues: GameState.clues, cluesFound: GameState.cluesFound,
      inventory: GameState.inventory, accusations: GameState.accusations,
      disappearedNPCs: GameState.disappearedNPCs, currentLocation: GameState.currentLocation,
      currentScreen: GameState.currentScreen, talkingTo: GameState.talkingTo,
      terrorTriggered: GameState.terrorTriggered, gameOver: GameState.gameOver,
      knownNPCs: GameState.knownNPCs, dailyTopicIndex: GameState.dailyTopicIndex
    };
    localStorage.setItem('lunardi_save', JSON.stringify(saveData));
    UI.showNotification('<div class="clue-found"><h3>💾 Jogo Salvo</h3><p>Seu progresso foi salvo com sucesso.</p></div>');
    resumeGame();
  } catch(e) {
    console.error('Error saving game:', e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem('lunardi_save');
    if (saved) {
      const data = JSON.parse(saved);
      GameState.day = data.day; GameState.timeOfDay = data.timeOfDay;
      GameState.culprit = DB.npcs.find(n => n.id === data.culpritId);
      GameState.motivation = DB.motivations.find(m => m.id === data.motivationId);
      GameState.clues = data.clues; GameState.cluesFound = data.cluesFound;
      GameState.inventory = data.inventory || []; GameState.accusations = data.accusations;
      GameState.disappearedNPCs = data.disappearedNPCs; GameState.currentLocation = data.currentLocation;
      GameState.currentScreen = data.currentScreen; GameState.talkingTo = data.talkingTo;
      GameState.terrorTriggered = data.terrorTriggered; GameState.gameOver = data.gameOver;
      GameState.knownNPCs = data.knownNPCs; GameState.dailyTopicIndex = data.dailyTopicIndex;
      
      UI.updateHUD();
      if (GameState.currentScreen === 'map') UI.renderMap();
      else if (GameState.currentScreen === 'location' && GameState.currentLocation) UI.visitLocation(GameState.currentLocation);
      else UI.renderMap();
    }
  } catch(e) {
    console.error('Error loading game:', e);
  }
}

function quitToMenu() {
  resumeGame();
  showTitle();
}

window.addEventListener('DOMContentLoaded', () => {
  UI.init();
  showTitle();

  // Keyboard shortcut for dossier and pause
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'd' || e.key === 'D') && !isPaused) {
      if (!GameState.gameOver && GameState.currentScreen !== 'title') {
        UI.renderDossier();
      }
    }
    if (e.key === 'Escape') {
      if (isPaused) {
        resumeGame();
      } else if (GameState.currentScreen !== 'title' && !GameState.gameOver) {
        if (GameState.currentScreen === 'dossier' || GameState.currentScreen === 'location') {
           // If we are in dossier, maybe we want to pause instead of go back?
           // The prompt said: "tecla esc abre uma aba para Voltar ao Menu e Salvar Jogo"
           pauseGame();
        } else {
           pauseGame();
        }
      }
    }
  });
});
