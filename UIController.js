// ==============================
// UI CONTROLLER - As Sombras de Antônio Lunardi
// ==============================
const UI = {
  els: {},
  selectedClues: [],

  init() {
    this.els = {
      app: document.getElementById('app'),
      titleScreen: document.getElementById('title-screen'),
      mapScreen: document.getElementById('map-screen'),
      locationScreen: document.getElementById('location-screen'),
      dialogueScreen: document.getElementById('dialogue-screen'),
      tribunalScreen: document.getElementById('tribunal-screen'),
      dossierScreen: document.getElementById('dossier-screen'),
      gameoverScreen: document.getElementById('gameover-screen'),
      victoryScreen: document.getElementById('victory-screen'),
      terrorOverlay: document.getElementById('terror-overlay'),
      hud: document.getElementById('hud'),
      hudDay: document.getElementById('hud-day'),
      hudTime: document.getElementById('hud-time'),
      hudClues: document.getElementById('hud-clues'),
      hudAccusations: document.getElementById('hud-accusations'),
      notification: document.getElementById('notification')
    };
  },

  showScreen(screenId) {
    const screens = ['title-screen','map-screen','location-screen','dialogue-screen',
      'tribunal-screen','dossier-screen','gameover-screen','victory-screen', 'puzzle-screen', 'pause-screen'];
    screens.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    
    // Sincronizar o estado do jogo
    GameState.currentScreen = screenId.replace('-screen', '');

    // Show HUD on all screens except title, gameover, victory
    if (['title-screen','gameover-screen','victory-screen'].includes(screenId)) {
      this.els.hud.classList.add('hidden');
    } else {
      this.els.hud.classList.remove('hidden');
      this.updateHUD();
    }
  },

  updateHUD() {
    this.els.hudDay.textContent = `Dia ${GameState.day} / ${GameState.maxDays}`;
    this.els.hudTime.textContent = GameState.getTimeLabel();
    this.els.hudClues.textContent = `🔍 ${GameState.cluesFound.length} pistas`;
    this.els.hudAccusations.textContent = `⚖️ ${GameState.accusations}/${GameState.maxAccusations}`;
    // Time-based visual atmosphere
    document.body.className = '';
    if (GameState.isNight()) document.body.classList.add('night-mode');
    if (GameState.day >= 20) document.body.classList.add('late-game');
    if (GameState.day >= 27) document.body.classList.add('critical');
  },

  renderMap() {
    this.showScreen('map-screen');
    const grid = document.getElementById('map-grid');
    grid.innerHTML = '';
    DB.locations.forEach(loc => {
      const card = document.createElement('button');
      card.className = 'location-card';
      card.innerHTML = `
        <span class="loc-icon">${loc.icon}</span>
        <span class="loc-name">${loc.name}</span>
        <span class="loc-hint">${GameState.isNight() ? '⚠️ Noite' : ''}</span>
      `;
      card.onclick = () => this.visitLocation(loc.id);
      grid.appendChild(card);
    });
  },

  visitLocation(locId) {
    if (GameState.isNight() && locId !== 'estalagem') {
      this.showNotification('<div class="accusation-wrong"><h3>🥱 Exausto</h3><p>A noite é muito perigosa. Você deve ir para a Estalagem descansar.</p></div>');
      return;
    }

    // Gastar tempo apenas se estivermos vindo do mapa para um novo local ou o mesmo local
    if (GameState.currentScreen === 'map') {
      GameState.advanceTime();
      this.updateHUD();
      if (GameState.currentScreen === 'tribunal') {
        this.renderTribunal();
        return;
      }
    }
    
    if (typeof AudioManager !== 'undefined') AudioManager.playAmbient(locId);
    GameState.currentLocation = locId;
    const loc = DB.locations.find(l => l.id === locId);
    this.showScreen('location-screen');

    const container = document.getElementById('location-content');
    const desc = GameState.isNight() ? loc.nightDesc : loc.desc;
    const npcsHere = GameState.getAvailableNPCsAtLocation(locId);
    const cluesHere = GameState.getCluesAtLocation(locId);

    let npcsHTML = '';
    npcsHere.forEach(npc => {
      const kn = GameState.knownNPCs[npc.id];
      const displayName = kn && kn.nameRevealed ? npc.name : "???";
      const displayRole = kn && kn.jobRevealed ? npc.role : "???";
      const displayPortrait = kn && kn.nameRevealed ? npc.portrait : "👤";
      npcsHTML += `<button class="npc-btn ${!(kn && kn.nameRevealed) ? 'npc-unknown' : ''}" onclick="UI.startDialogue('${npc.id}')">
        <span class="npc-portrait">${displayPortrait}</span>
        <span class="npc-name">${displayName}</span>
        <span class="npc-role">${displayRole}</span>
      </button>`;
    });

    let searchBtn = '';
    if (cluesHere.length > 0) {
      searchBtn = `<button class="action-btn search-btn" onclick="UI.searchLocation('${locId}')">
        🔍 Investigar o local
      </button>`;
    } else {
      searchBtn = `<button class="action-btn search-btn disabled" disabled>
        🔍 Nada mais a investigar aqui
      </button>`;
    }

    let sleepBtn = '';
    if (locId === 'estalagem' && GameState.isNight()) {
      sleepBtn = `<button class="action-btn" style="background-color: var(--accent-blue); margin-bottom:10px;" onclick="UI.sleepAndAdvanceDay()">🛏️ Dormir e passar a noite</button>`;
    }

    let judgementBtn = '';
    if (locId === 'prefeitura') {
      judgementBtn = `<button class="action-btn accuse-btn" style="background-color: var(--accent-red); margin-bottom:10px;" onclick="UI.renderTribunal()">⚖️ Começar Tribunal Imediatamente</button>`;
    }

    container.innerHTML = `
      <div class="location-header">
        <span class="loc-big-icon">${loc.icon}</span>
        <h2>${loc.name}</h2>
        <span class="time-badge ${GameState.isNight() ? 'night' : ''}">${GameState.getTimeLabel()}</span>
      </div>
      <p class="location-desc ${GameState.isNight() ? 'night-text' : ''}">${desc}</p>
      ${npcsHere.length > 0 ? '<h3>Pessoas presentes:</h3><div class="npc-grid">' + npcsHTML + '</div>' : '<p class="empty-msg">Não há ninguém aqui...</p>'}
      <div class="location-actions">
        ${judgementBtn}
        ${sleepBtn}
        ${searchBtn}
        <button class="action-btn back-btn" onclick="UI.backToMap()">← Voltar ao Mapa</button>
      </div>
    `;

    // Check terror events
    const terrors = GameState.checkTerrorEvent();
    if (terrors.length > 0) {
      setTimeout(() => this.showTerrorEvent(terrors[0]), 1500);
    }
  },

  sleepAndAdvanceDay() {
    // Força o avanço do tempo para o próximo dia
    GameState.advanceTime();
    this.updateHUD();
    this.showNotification('<div class="clue-found" style="border-color:var(--accent-blue);"><h3>🌅 Um novo dia</h3><p>Você sobreviveu à noite. A investigação continua.</p></div>');
    if (GameState.currentScreen === 'tribunal') {
      this.renderTribunal();
    } else if (GameState.gameOver) {
      this.renderGameOver();
    } else {
      this.renderMap();
    }
  },

  searchLocation(locId) {
    const cluesHere = GameState.getCluesAtLocation(locId);
    if (cluesHere.length > 0) {
      const clue = cluesHere[Math.floor(Math.random() * cluesHere.length)];
      if (clue.category === 'redHerring') {
        this.executeFindClue(clue, locId);
      } else {
        this.showPuzzle(clue, locId);
      }
    }
  },

  showPuzzle(clue, locId) {
    this.showScreen('puzzle-screen');
    const container = document.getElementById('puzzle-content');
    
    // Puzzles de dedução pura (sem números aparentes quando possível)
    const puzzles = [
      { q: "Some o número de pecados capitais aos dias de um ciclo lunar completo aproximado.", a: "35" },
      { q: "Qual o ano da grande seca e fundação desta cidade amaldiçoada?", a: "1892" },
      { q: "Se a meia-noite é a hora zero, que hora é quando os ponteiros se sobrepõem exatamente à noite (formato de 24h)?", a: "0" },
      { q: "Reorganize as letras para descobrir a palavra-chave oculta: R M O E T", a: "morte" },
      { q: "Quantas patas no total existem em uma sala com uma aranha, dois humanos e um cachorro?", a: "16" }
    ];
    const pz = puzzles[Math.floor(Math.random() * puzzles.length)];
    
    container.innerHTML = `
      <div class="puzzle-box">
        <h2>🔐 Enigma Oculto</h2>
        <p>Você encontrou um compartimento trancado ou algo que exige concentração para ser revelado.</p>
        <p class="puzzle-question">${pz.q}</p>
        <input type="text" id="puzzle-answer" placeholder="Sua resposta..." autocomplete="off">
        <div class="puzzle-actions">
          <button class="action-btn search-btn" onclick="UI.checkPuzzle('${pz.a}', '${clue.id}', '${locId}')">Tentar Abrir</button>
          <button class="action-btn back-btn" onclick="UI.visitLocation('${locId}')">Desistir</button>
        </div>
        <p id="puzzle-error" style="color:var(--accent-red-glow); margin-top:10px; display:none;">Resposta incorreta.</p>
      </div>
    `;
  },

  checkPuzzle(correctAnswer, clueId, locId) {
    const input = document.getElementById('puzzle-answer').value.trim().toLowerCase();
    if (input === correctAnswer.toLowerCase()) {
      const clue = GameState.clues.find(c => c.id === clueId);
      this.executeFindClue(clue, locId);
    } else {
      document.getElementById('puzzle-error').style.display = 'block';
    }
  },

  executeFindClue(clue, locId) {
      GameState.findClue(clue.id);
      this.updateHUD();

      const isRedHerring = clue.category === 'redHerring';
      const categoryLabel = {
        physical: '🔗 Evidência Física',
        motivation: '🎭 Pista de Motivação',
        redHerring: '❓ Evidência Duvidosa'
      }[clue.category] || '📋 Pista';

      this.showNotification(`
        <div class="clue-found ${isRedHerring ? 'red-herring' : ''}">
          <h3>${categoryLabel}</h3>
          <p>${clue.text}</p>
          <small>Adicionada ao dossiê</small>
        </div>
      `);

      // Check if terror triggered by clue count
      const terrors = GameState.checkTerrorEvent();
      if (terrors.length > 0) {
        setTimeout(() => this.showTerrorEvent(terrors[0]), 2000);
      }

      if (GameState.currentScreen === 'tribunal') {
        setTimeout(() => this.renderTribunal(), 3000);
      } else if (GameState.gameOver) {
        setTimeout(() => this.renderGameOver(), 3000);
      } else {
        setTimeout(() => this.visitLocation(locId), 2500);
      }
  },

  startDialogue(npcId) {
    GameState.talkingTo = npcId;
    const npc = DB.npcs.find(n => n.id === npcId);
    this.showScreen('dialogue-screen');

    const npcClues = GameState.getCluesFromNPC(npcId);
    const topic = DB.dailyTopics[GameState.dailyTopicIndex] || '...';
    const defaultDialogues = DB.dialogueDefaults[npcId] || ['...'];
    const randomDefault = defaultDialogues[Math.floor(Math.random() * defaultDialogues.length)];
    
    const initialText = `"${topic} ${randomDefault}"`;

    let optionsHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <button class="dialogue-option" onclick="UI.askQuestion('${npcId}', 'who')">👤 Quem é você?</button>
        <button class="dialogue-option" onclick="UI.askQuestion('${npcId}', 'job')">💼 O que você faz?</button>
        <button class="dialogue-option" onclick="UI.askQuestion('${npcId}', 'where')">📍 Onde estava à noite?</button>
        <button class="dialogue-option" onclick="UI.askQuestion('${npcId}', 'strange')">👁️ Notou algo estranho?</button>
        <button class="dialogue-option" style="grid-column: span 2;" onclick="UI.askQuestion('${npcId}', 'city')">🏘️ O que acha da cidade?</button>
      </div>
      <button class="dialogue-option" onclick="UI.dialogueTalk('${npcId}')">💬 Assunto do dia</button>
      <button class="dialogue-option" style="border-color:var(--accent-gold); color:var(--accent-gold);" onclick="UI.showEvidenceSelection('${npcId}')">🔍 Mostrar Evidência...</button>
    `;

    if (npcClues.length > 0) {
      optionsHTML += `<button class="dialogue-option clue-option" onclick="UI.dialogueInvestigate('${npcId}')">🔍 Perguntar sobre os desaparecimentos</button>`;
    }

    if (npc.type === 'child') {
      optionsHTML += `<button class="dialogue-option child-option" onclick="UI.dialogueChildLore('${npcId}')">🧸 Perguntar com cuidado</button>`;
    }

    optionsHTML += `<button class="dialogue-option back-option" onclick="UI.visitLocation('${GameState.currentLocation}')">← Voltar</button>`;

    const kn = GameState.knownNPCs[npc.id];
    const displayName = kn && kn.nameRevealed ? npc.name : "???";
    const displayRole = kn && kn.jobRevealed ? npc.role : "???";
    const displayPortrait = kn && kn.nameRevealed ? npc.portrait : "👤";

    const container = document.getElementById('dialogue-content');
    container.innerHTML = `
      <div class="dialogue-header">
        <span class="dialogue-portrait">${displayPortrait}</span>
        <div>
          <h2>${displayName}</h2>
          <span class="dialogue-role">${displayRole}</span>
        </div>
      </div>
      <div class="dialogue-box">
        <p class="dialogue-text" id="dialogue-text">${initialText}</p>
      </div>
      <div class="dialogue-options" id="dialogue-options">
        ${optionsHTML}
      </div>
    `;
  },

  askQuestion(npcId, qType) {
    const response = GameState.interactNpc(npcId, qType);
    document.getElementById('dialogue-text').textContent = `"${response}"`;
    
    // Atualiza o cabeçalho se algo foi revelado
    const npc = DB.npcs.find(n => n.id === npcId);
    const kn = GameState.knownNPCs[npc.id];
    const headerName = document.querySelector('.dialogue-header h2');
    const headerRole = document.querySelector('.dialogue-header .dialogue-role');
    const headerPortrait = document.querySelector('.dialogue-header .dialogue-portrait');
    
    if (kn.nameRevealed && headerName) headerName.textContent = npc.name;
    if (kn.nameRevealed && headerPortrait) headerPortrait.textContent = npc.portrait;
    if (kn.jobRevealed && headerRole) headerRole.textContent = npc.role;
    
    this.updateHUD();
  },

  dialogueTalk(npcId) {
    const topic = DB.dailyTopics[GameState.dailyTopicIndex] || '';
    const defaultDialogues = DB.dialogueDefaults[npcId] || ['...'];
    const text = topic + " " + defaultDialogues[Math.floor(Math.random() * defaultDialogues.length)];
    document.getElementById('dialogue-text').textContent = `"${text}"`;
    this.updateHUD();
    if (GameState.currentScreen === 'tribunal') {
      setTimeout(() => this.renderTribunal(), 1500);
    } else if (GameState.gameOver) {
      setTimeout(() => {
        this.showScreen(GameState.currentScreen === 'gameover' ? 'gameover-screen' : 'victory-screen');
        GameState.currentScreen === 'gameover' ? this.renderGameOver() : this.renderVictory();
      }, 1500);
    }
  },

  showEvidenceSelection(npcId) {
    let evidenceHTML = '<p style="color:var(--text-dim); font-size:14px; margin-bottom:10px;">Selecione uma evidência do seu dossiê para mostrar a ele(a):</p>';
    if (GameState.cluesFound.length === 0) {
      evidenceHTML += '<p class="empty-msg">Nenhuma pista encontrada ainda.</p>';
    } else {
      GameState.cluesFound.forEach(c => {
        evidenceHTML += `<button class="dialogue-option clue-option" onclick="UI.presentEvidence('${npcId}', '${c.id}')">${c.text.substring(0, 40)}...</button>`;
      });
    }
    evidenceHTML += `<button class="dialogue-option back-option" onclick="UI.startDialogue('${npcId}')" style="margin-top:10px;">← Cancelar</button>`;
    document.getElementById('dialogue-options').innerHTML = evidenceHTML;
  },

  presentEvidence(npcId, clueId) {
    const clue = GameState.cluesFound.find(c => c.id === clueId);
    const kn = GameState.knownNPCs[npcId];
    const npc = DB.npcs.find(n => n.id === npcId);
    
    let response = "";
    if (clue.category === 'deduction') {
      response = "Essa sua dedução... é assustadora. Espero que esteja errado.";
    } else if (npcId === GameState.culprit.id && clue.category !== 'redHerring') {
      const isDirectAccusation = clue.text.includes(npc.name);
      if (isDirectAccusation) {
        response = DB.npcDefenses[npcId] + " ...Mas isso não importa, porque eu não vou deixar você estragar meus planos!";
      } else {
        response = "O que é isso?! Onde você achou?! Você está tentando me incriminar? Isso não prova nada!";
      }
      kn.trust = Math.max(0, kn.trust - 2);
    } else if (clue.text && clue.text.includes(npc.name)) {
      response = DB.npcDefenses[npcId] || "Meu nome está aí, mas eu juro que sou inocente! Alguém quer me prejudicar, acredite em mim!";
      kn.trust = Math.max(0, kn.trust - 1);
    } else {
      response = "Isso não tem nada a ver comigo. Por que está me mostrando isso? Vá procurar o verdadeiro culpado.";
      kn.trust = Math.max(0, kn.trust - 1);
    }
    
    document.getElementById('dialogue-text').textContent = `"${response}"`;
    this.updateHUD();
    
    document.getElementById('dialogue-options').innerHTML = `<button class="dialogue-option back-option" onclick="UI.startDialogue('${npcId}')">← Voltar</button>`;
  },

  dialogueInvestigate(npcId) {
    const npcClues = GameState.getCluesFromNPC(npcId);
    if (npcClues.length > 0) {
      const clue = npcClues[0];
      GameState.findClue(clue.id);
      this.updateHUD();

      const categoryLabel = clue.category === 'childHint' ? '🧒 Dica de Criança' : '🗣️ Testemunho';
      document.getElementById('dialogue-text').innerHTML = clue.text;

      this.showNotification(`
        <div class="clue-found">
          <h3>${categoryLabel}</h3>
          <p>${clue.text}</p>
          <small>Adicionada ao dossiê</small>
        </div>
      `);

      // Remove investigate button
      const btns = document.querySelectorAll('.clue-option');
      btns.forEach(b => { b.disabled = true; b.textContent = '✓ Já interrogado'; });

      if (GameState.currentScreen === 'tribunal') {
        setTimeout(() => this.renderTribunal(), 3000);
      } else if (GameState.gameOver) {
        setTimeout(() => this.renderGameOver(), 3000);
      }
    }
  },

  dialogueChildLore(npcId) {
    const npc = DB.npcs.find(n => n.id === npcId);
    const npcClues = GameState.getCluesFromNPC(npcId);
    if (npcClues.length > 0) {
      this.dialogueInvestigate(npcId);
    } else {
      const childLore = [
        '"Os adultos mentem. Eu vejo nos olhos deles."',
        '"Tem algo embaixo da cidade. Eu sinto quando deito no chão."',
        '"Minha avó dizia que esta cidade foi construída sobre um segredo."',
        '"Às vezes eu sonho com uma pessoa de preto. Ela chora sangue."'
      ];
      document.getElementById('dialogue-text').textContent = childLore[Math.floor(Math.random() * childLore.length)];
    }
  },

  renderTribunal() {
    if (typeof AudioManager !== 'undefined') AudioManager.playAmbient('tribunal');
    this.showScreen('tribunal-screen');
    const container = document.getElementById('tribunal-content');
    const suspects = GameState.getSuspects();

    let suspectsHTML = '';
    suspects.forEach(s => {
      const alreadyAccused = GameState.accusations.includes(s.id);
      const kn = GameState.knownNPCs[s.id];
      const displayName = kn && kn.nameRevealed ? s.name : "???";
      const displayRole = kn && kn.jobRevealed ? s.role : "???";
      const displayPortrait = kn && kn.nameRevealed ? s.portrait : "👤";
      
      suspectsHTML += `<button class="suspect-btn ${!(kn && kn.nameRevealed) ? 'npc-unknown' : ''}"
        onclick="UI.confirmAccusation('${s.id}')">
        <span class="suspect-portrait">${displayPortrait}</span>
        <span class="suspect-name">${displayName}</span>
        <span class="suspect-role">${displayRole}</span>
      </button>`;
    });

    const clueCount = GameState.cluesFound.filter(c => c.category !== 'redHerring').length;

    container.innerHTML = `
      <div class="tribunal-header">
        <h2>⚖️ Tribunal de Antônio Lunardi</h2>
        <p>Dia ${GameState.day} — O tribunal exige respostas!</p>
        <p class="tribunal-warning">Se sua acusação e motivação não forem perfeitas, um cidadão desaparecerá.</p>
        <p>Pistas encontradas: <strong>${clueCount}</strong> | Acusações restantes: <strong>${GameState.maxAccusations - GameState.accusations}</strong></p>
      </div>
      <div class="suspects-grid">${suspectsHTML}</div>
      <button class="action-btn skip-btn" onclick="UI.skipTribunal()">
        ⏭️ Pular Acusação (perder tempo)
      </button>
    `;
  },

  confirmAccusation(npcId) {
    const kn = GameState.knownNPCs[npcId];
    const displayName = kn && kn.nameRevealed ? npc.name : "???";
    const displayRole = kn && kn.jobRevealed ? npc.role : "???";
    const displayPortrait = kn && kn.nameRevealed ? npc.portrait : "👤";
    
    const container = document.getElementById('tribunal-content');
    container.innerHTML = `
      <div class="confirm-accusation">
        <h2>⚖️ Confirmar Acusação</h2>
        <div class="accused-card ${!(kn && kn.nameRevealed) ? 'npc-unknown' : ''}">
          <span class="accused-portrait">${displayPortrait}</span>
          <h3>${displayName}</h3>
          <p>${displayRole}</p>
        </div>
        <p class="confirm-warning">Tem certeza que deseja acusar <strong>${displayName}</strong>?</p>
        <p class="confirm-subtext">Se estiver errado, um cidadão inocente desaparecerá.</p>
        <div class="confirm-buttons">
          <button class="action-btn accuse-btn" onclick="UI.executeAccusation('${npcId}')">✋ Acusar!</button>
          <button class="action-btn back-btn" onclick="UI.renderTribunal()">← Voltar</button>
        </div>
      </div>
    `;
  },

  executeAccusation(npcId) {
    // Agora o julgamento é cego. Passamos para a escolha da motivação.
    this.renderMotivationGuess(npcId);
  },

  renderMotivationGuess(npcId) {
    const kn = GameState.knownNPCs[npcId];
    const npc = DB.npcs.find(n => n.id === npcId);
    const displayName = kn && kn.nameRevealed ? npc.name : "???";
    
    let motivationsHTML = '';
    DB.motivations.forEach(m => {
      motivationsHTML += `<button class="dialogue-option" style="margin-bottom:8px;" onclick="UI.confirmFinalAccusation('${npcId}', '${m.id}')">
        ${m.icon} <strong>${m.name}</strong> - ${m.desc}
      </button>`;
    });

    const container = document.getElementById('tribunal-content');
    container.innerHTML = `
      <div class="confirm-accusation">
        <h2>⚖️ Qual foi a Motivação?</h2>
        <p class="confirm-warning">O Tribunal escuta sua acusação contra <strong>${displayName}</strong>.</p>
        <p class="confirm-subtext">Para convencer os juízes, você deve provar a motivação exata. Qual foi o motivo dos crimes?</p>
        <div style="margin-top: 20px; text-align:left;">
          ${motivationsHTML}
        </div>
      </div>
    `;
  },

  confirmFinalAccusation(npcId, motivationId) {
    const result = GameState.makeFinalAccusation(npcId, motivationId);
    if (result === 'correct') {
      this.renderVictory();
    } else {
      const npc = DB.npcs.find(n => n.id === npcId);
      const lastDisappeared = GameState.disappearedNPCs[GameState.disappearedNPCs.length - 1];
      const disappearedNpc = DB.npcs.find(n => n.id === lastDisappeared);

      const terror = DB.terrorEvents.find(e => e.trigger === 'accusation_wrong');
      if (terror && !GameState.terrorTriggered['accusation_wrong_' + GameState.accusations]) {
        GameState.terrorTriggered['accusation_wrong_' + GameState.accusations] = true;
        this.showTerrorEvent(terror);
      }

      this.showNotification(`
        <div class="accusation-wrong">
          <h3>❌ O Tribunal Rejeita as Provas</h3>
          <p>Sua acusação não foi convincente. Como punição pela falha, <strong>${disappearedNpc.name}</strong> desapareceu nas sombras.</p>
          <p class="remaining">Acusações restantes: ${GameState.maxAccusations - GameState.accusations}</p>
        </div>
      `);

      if (GameState.gameOver) {
        setTimeout(() => this.renderGameOver(), 4000);
      } else {
        setTimeout(() => this.renderMap(), 4000);
      }
    }
  },

  skipTribunal() {
    GameState.advanceTime();
    this.renderMap();
  },

  renderDossier() {
    this.showScreen('dossier-screen');
    const container = document.getElementById('dossier-content');
    this.selectedClues = [];

    let cluesHTML = '';
    if (GameState.cluesFound.length === 0) {
      cluesHTML = '<p class="empty-msg">Nenhuma pista encontrada ainda.</p>';
    } else {
      const categories = {
        physical: { label: '🔗 Evidências Físicas', items: [] },
        testimony: { label: '🗣️ Testemunhos', items: [] },
        childHint: { label: '🧒 Dicas das Crianças', items: [] },
        motivation: { label: '🎭 Motivação', items: [] },
        redHerring: { label: '❓ Evidências Duvidosas', items: [] }
      };
      GameState.cluesFound.forEach(c => {
        if (categories[c.category]) categories[c.category].items.push(c);
      });
      Object.values(categories).forEach(cat => {
        if (cat.items.length > 0) {
          cluesHTML += `<div class="dossier-category"><h3>${cat.label}</h3>`;
          cat.items.forEach(item => {
            cluesHTML += `<div class="dossier-clue" id="dossier-clue-${item.id}" onclick="UI.toggleClueSelection('${item.id}')" style="cursor:pointer; transition:all 0.3s;"><p>${item.text}</p></div>`;
          });
          cluesHTML += '</div>';
        }
      });
    }

    let disappearedHTML = '';
    if (GameState.disappearedNPCs.length > 0) {
      disappearedHTML = '<div class="dossier-category"><h3>👻 Desaparecidos</h3>';
      GameState.disappearedNPCs.forEach(id => {
        const npc = DB.npcs.find(n => n.id === id);
        if (npc) disappearedHTML += `<div class="dossier-clue disappeared"><p>${npc.portrait} ${npc.name} — ${npc.role}</p></div>`;
      });
      disappearedHTML += '</div>';
    }

    container.innerHTML = `
      <div class="dossier-header">
        <h2>📋 Dossiê do Investigador</h2>
        <p>Dia ${GameState.day} | ${GameState.cluesFound.length} pistas coletadas</p>
        <p style="font-size:12px; color:var(--text-dim);">Clique em duas pistas para tentar relacioná-las.</p>
      </div>
      ${cluesHTML}
      ${disappearedHTML}
      <div style="margin-top:20px; display:flex; gap:12px;">
        <button id="relate-btn" class="action-btn" style="display:none; border-color:var(--accent-gold); color:var(--accent-gold);" onclick="UI.attemptRelateClues()">🔗 Relacionar Pistas</button>
        <button class="action-btn back-btn" onclick="UI.renderMap()">← Voltar ao Mapa</button>
      </div>
    `;
  },

  toggleClueSelection(clueId) {
    const el = document.getElementById('dossier-clue-' + clueId);
    if (!el) return;
    
    if (this.selectedClues.includes(clueId)) {
      this.selectedClues = this.selectedClues.filter(id => id !== clueId);
      el.style.borderLeftColor = 'var(--accent-green)';
      el.style.backgroundColor = 'var(--bg-card)';
    } else {
      if (this.selectedClues.length >= 2) return;
      this.selectedClues.push(clueId);
      el.style.borderLeftColor = 'var(--accent-gold)';
      el.style.backgroundColor = 'var(--bg-card-hover)';
    }
    
    const relateBtn = document.getElementById('relate-btn');
    if (relateBtn) {
      relateBtn.style.display = this.selectedClues.length === 2 ? 'block' : 'none';
    }
  },

  attemptRelateClues() {
    if (this.selectedClues.length !== 2) return;
    const result = GameState.relateClues(this.selectedClues[0], this.selectedClues[1]);
    if (result.success) {
      this.showNotification(`<div class="clue-found"><h3>🔗 Dedução Correta</h3><p>${result.text}</p></div>`);
      this.renderDossier(); // Re-render to show new deduction
    } else {
      this.showNotification(`<div class="accusation-wrong"><h3>❌ Erro</h3><p>${result.text}</p></div>`);
      // clear selection
      this.selectedClues = [];
      this.renderDossier();
    }
  },

  renderGameOver() {
    this.showScreen('gameover-screen');
    const container = document.getElementById('gameover-content');
    container.innerHTML = `
      <div class="gameover-container">
        <div class="gameover-glitch" data-text="GAME OVER">GAME OVER</div>
        <h2>A cidade de Antônio Lunardi foi consumida pelas sombras.</h2>
        <p>O culpado era <strong>${GameState.culprit.name}</strong> — ${GameState.culprit.role}.</p>
        <p>Motivação: <strong>${GameState.motivation.name}</strong> — ${GameState.motivation.desc}</p>
        <p class="gameover-stats">Dias: ${GameState.day} | Pistas: ${GameState.cluesFound.length} | Acusações feitas: ${GameState.accusations}</p>
        <button class="action-btn restart-btn" onclick="startNewGame()">🔄 Novo Jogo</button>
      </div>
    `;
  },

  renderVictory() {
    this.showScreen('victory-screen');
    const container = document.getElementById('victory-content');
    container.innerHTML = `
      <div class="victory-container">
        <h1>🏆 A Cidade Está Salva!</h1>
        <h2>Você identificou o culpado!</h2>
        <div class="culprit-reveal">
          <span class="culprit-portrait">${GameState.culprit.portrait}</span>
          <h3>${GameState.culprit.name}</h3>
          <p>${GameState.culprit.role}</p>
        </div>
        <p>Motivação: <strong>${GameState.motivation.icon} ${GameState.motivation.name}</strong></p>
        <p>${GameState.motivation.desc}</p>
        <p class="victory-stats">Dias: ${GameState.day} | Pistas: ${GameState.cluesFound.length} | Acusações feitas: ${GameState.accusations}</p>
        <button class="action-btn restart-btn" onclick="startNewGame()">🔄 Jogar Novamente</button>
      </div>
    `;
  },

  showTerrorEvent(event) {
    if (typeof AudioManager !== 'undefined') AudioManager.playJumpscare();
    const overlay = this.els.terrorOverlay;
    overlay.innerHTML = `
      <div class="terror-content ${event.type}">
        <p>${event.text}</p>
      </div>
    `;
    overlay.classList.add('active');
    document.body.classList.add('terror-shake');
    setTimeout(() => {
      overlay.classList.remove('active');
      document.body.classList.remove('terror-shake');
    }, 6000);
  },

  showNotification(html) {
    const notif = this.els.notification;
    notif.innerHTML = html;
    notif.classList.add('active');
    setTimeout(() => notif.classList.remove('active'), 3000);
  },

  backToMap() {
    if (typeof AudioManager !== 'undefined') AudioManager.playAmbient('mapa');
    GameState.currentLocation = null;
    this.updateHUD();
    if (GameState.currentScreen === 'tribunal') {
      this.renderTribunal();
    } else if (GameState.gameOver) {
      this.renderGameOver();
    } else {
      this.renderMap();
    }
  }
};
