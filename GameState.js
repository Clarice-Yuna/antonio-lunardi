// ==============================
// GAME STATE - As Sombras de Antônio Lunardi
// ==============================
const GameState = {
  day: 1,
  timeOfDay: 0, // 0=Início Manhã, 1=Fim Manhã, 2=Início Tarde, 3=Fim Tarde, 4=Crepúsculo, 5=Noite
  timeLabels: ['Início da Manhã', 'Fim da Manhã', 'Início da Tarde', 'Fim da Tarde', 'Crepúsculo', 'Noite'],
  maxDays: 30,
  culprit: null,
  motivation: null,
  clues: [],
  cluesFound: [],
  inventory: [],
  accusations: 0,
  maxAccusations: 5,
  disappearedNPCs: [],
  currentLocation: null,
  currentScreen: 'title', // title, map, location, dialogue, tribunal, dossier, gameover, victory
  talkingTo: null,
  terrorTriggered: {},
  gameOver: false,
  totalCluesNeeded: 3, // minimum to accuse
  knownNPCs: {},
  activePuzzle: null,
  dailyTopicIndex: 0,

  init() {
    const mystery = ProceduralGen.generateMystery();
    this.culprit = mystery.culprit;
    this.motivation = mystery.motivation;
    this.clues = mystery.clues;
    this.day = 1;
    this.timeOfDay = 0;
    this.cluesFound = [];
    this.inventory = [];
    this.accusations = 0;
    this.disappearedNPCs = [];
    this.currentLocation = null;
    this.currentScreen = 'map';
    this.talkingTo = null;
    this.terrorTriggered = {};
    this.gameOver = false;
    this.knownNPCs = {};
    this.activePuzzle = null;
    this.dailyTopicIndex = 0;
    
    // Initialize knownNPCs
    DB.npcs.forEach(n => {
      this.knownNPCs[n.id] = {
        nameRevealed: n.trustThreshold === 0,
        jobRevealed: n.trustThreshold === 0,
        trust: 0,
        lastTrustPeriod: -1
      };
    });
  },

  advanceTime() {
    this.timeOfDay++;
    if (this.timeOfDay > 5) {
      this.timeOfDay = 0;
      this.day++;
      this.dailyTopicIndex = (this.day - 1) % DB.dailyTopics.length;
      
      // Mover NPCs aleatoriamente no novo dia
      const availableLocations = DB.locations.map(l => l.id);
      DB.npcs.forEach(n => {
        // Culpado pode ter padrão diferente, mas por agora movemos todos
        if (!this.disappearedNPCs.includes(n.id)) {
           n.location = availableLocations[Math.floor(Math.random() * availableLocations.length)];
        }
      });

      if (this.day > this.maxDays) {
        this.gameOver = true;
        this.currentScreen = 'gameover';
      }
    }
    // Tribunal every 7 days at morning
    if (this.day % 7 === 0 && this.timeOfDay === 0 && !this.gameOver) {
      this.currentScreen = 'tribunal';
    }
  },

  getTimeLabel() {
    return this.timeLabels[this.timeOfDay];
  },

  isNight() {
    return this.timeOfDay === 5;
  },

  getAvailableNPCsAtLocation(locationId) {
    if (this.isNight()) return [];
    return DB.npcs.filter(n =>
      n.location === locationId &&
      !this.disappearedNPCs.includes(n.id) &&
      n.id !== (this.culprit ? this.culprit.id : null)
    ).concat(
      // Culprit is always available unless disappeared
      this.culprit && this.culprit.location === locationId && !this.disappearedNPCs.includes(this.culprit.id) ? [this.culprit] : []
    );
  },

  getCluesAtLocation(locationId) {
    return this.clues.filter(c =>
      c.location === locationId && !c.found && (c.category === 'physical' || c.category === 'redHerring' || c.category === 'motivation')
    );
  },

  getCluesFromNPC(npcId) {
    return this.clues.filter(c =>
      c.npcId === npcId && !c.found && (c.category === 'testimony' || c.category === 'childHint')
    );
  },

  findClue(clueId) {
    const clue = this.clues.find(c => c.id === clueId);
    if (clue && !clue.found) {
      clue.found = true;
      this.cluesFound.push(clue);
      this.inventory.push(clue);
      return clue;
    }
    return null;
  },

  makeFinalAccusation(npcId, motivationId) {
    this.accusations++;
    if (npcId === this.culprit.id && motivationId === this.motivation.id) {
      this.currentScreen = 'victory';
      this.gameOver = true;
      return 'correct';
    } else {
      // Wrong accusation (either culprit or motivation is wrong) — disappear a random innocent
      const remaining = DB.npcs.filter(n =>
        n.type === 'adult' &&
        n.id !== this.culprit.id &&
        !this.disappearedNPCs.includes(n.id)
      );
      if (remaining.length > 0) {
        const victim = remaining[Math.floor(Math.random() * remaining.length)];
        this.disappearedNPCs.push(victim.id);
      }
      
      if (this.accusations >= this.maxAccusations) {
        this.currentScreen = 'gameover';
        this.gameOver = true;
      }
      return 'wrong';
    }
  },

  checkTerrorEvent() {
    const events = [];
    if (this.isNight() && this.currentLocation) {
      const key = 'night_' + this.currentLocation;
      const evt = DB.terrorEvents.find(e => e.trigger === key);
      if (evt && !this.terrorTriggered[key]) {
        this.terrorTriggered[key] = true;
        events.push(evt);
      }
    }
    const clueKey = 'clue_found_' + this.cluesFound.length;
    const clueEvt = DB.terrorEvents.find(e => e.trigger === clueKey);
    if (clueEvt && !this.terrorTriggered[clueKey]) {
      this.terrorTriggered[clueKey] = true;
      events.push(clueEvt);
    }
    const dayKey = 'day_' + this.day;
    const dayEvt = DB.terrorEvents.find(e => e.trigger === dayKey);
    if (dayEvt && !this.terrorTriggered[dayKey]) {
      this.terrorTriggered[dayKey] = true;
      events.push(dayEvt);
    }
    return events;
  },

  getSuspects() {
    return DB.npcs.filter(n =>
      n.type === 'adult' && !this.disappearedNPCs.includes(n.id)
    );
  },

  interactNpc(npcId, question) {
    const npc = DB.npcs.find(n => n.id === npcId);
    const kn = this.knownNPCs[npcId];
    
    const currentPeriodAbsolute = (this.day * 6) + this.timeOfDay;
    if (kn.lastTrustPeriod !== currentPeriodAbsolute) {
      kn.trust++;
      kn.lastTrustPeriod = currentPeriodAbsolute;
    }

    if (kn.trust >= npc.trustThreshold) {
      if (question === 'who') kn.nameRevealed = true;
      if (question === 'job') kn.jobRevealed = true;
      return DB.npcResponses[npcId][question] || "...";
    } else {
      return "Não confio em você o suficiente para responder a isso.";
    }
  },

  relateClues(clue1Id, clue2Id) {
    const c1 = this.cluesFound.find(c => c.id === clue1Id);
    const c2 = this.cluesFound.find(c => c.id === clue2Id);
    if (!c1 || !c2) return { success: false, text: "Pistas inválidas." };
    
    const prefix1 = c1.id.split('_')[0];
    const prefix2 = c2.id.split('_')[0];

    if (prefix1 === 'rh' || prefix2 === 'rh') {
      return { success: false, text: "Uma ou ambas as evidências parecem não fazer sentido e não se conectam." };
    }

    if (prefix1 === prefix2) {
      const motMap = { v: 'Vingança', i: 'Imortalidade', o: 'Oferenda Macabra', p: 'Sede de Poder', mc: 'Maldição Ancestral', r: 'Ressurreição' };
      const deductionText = `As pistas se conectam perfeitamente! Elas indicam uma motivação clara: **${motMap[prefix1]}**.`;
      
      const dedId = 'ded_' + prefix1;
      if (!this.cluesFound.find(c => c.id === dedId)) {
        this.cluesFound.push({ id: dedId, category: 'deduction', text: deductionText });
      }
      return { success: true, text: "Você fez uma conexão! " + deductionText };
    } else {
      return { success: false, text: "Estas duas pistas parecem pertencer a quebra-cabeças diferentes." };
    }
  }
};
