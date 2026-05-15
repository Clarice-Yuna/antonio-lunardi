// ==============================
// PROCEDURAL GENERATION - As Sombras de Antônio Lunardi
// ==============================
const ProceduralGen = {
  generateMystery() {
    const adults = DB.npcs.filter(n => n.type === 'adult');
    const children = DB.npcs.filter(n => n.type === 'child');
    const culpritIndex = Math.floor(Math.random() * adults.length);
    const culprit = adults[culpritIndex];
    const motIndex = Math.floor(Math.random() * DB.motivations.length);
    const motivation = DB.motivations[motIndex];
    const clueSet = DB.clueTemplates[motivation.id];
    const clues = [];
    const getMixedNames = () => {
      const others = adults.filter(a => a.id !== culprit.id);
      this._shuffle(others);
      
      const rand = Math.random();
      if (rand < 0.3) {
        // 30% de chance: Apenas o nome do culpado (pista real muito direta)
        return culprit.name;
      } else if (rand < 0.7) {
        // 40% de chance: Apenas o nome de um inocente (pista plantada/enganosa)
        return others[0].name;
      } else {
        // 30% de chance: Lista mista para gerar dúvida
        const numToPick = Math.floor(Math.random() * 3) + 1; // 1, 2 ou 3 extras
        const names = [culprit.name];
        for(let i=0; i<numToPick; i++) names.push(others[i].name);
        this._shuffle(names);
        if (names.length === 2) return names.join(' ou ');
        if (names.length === 3) return names[0] + ', ' + names[1] + ' ou ' + names[2];
        return names.slice(0, -1).join(', ') + ' ou ' + names[names.length - 1];
      }
    };

    // Physical clues (3)
    clueSet.physical.forEach(c => {
      clues.push({ ...c, category: 'physical', found: false,
        text: c.text.replace(/\{culprit\}/g, getMixedNames()) });
    });
    // Testimony clues (3) — assign to random non-culprit adults
    const witnesses = adults.filter(a => a.id !== culprit.id);
    this._shuffle(witnesses);
    clueSet.testimony.forEach((c, i) => {
      const witness = witnesses[i % witnesses.length];
      clues.push({ ...c, category: 'testimony', found: false, npcId: witness.id,
        text: c.text.replace(/\{culprit\}/g, getMixedNames()) });
    });
    // Child hints (2)
    const shuffledChildren = [...children];
    this._shuffle(shuffledChildren);
    clueSet.childHints.forEach((c, i) => {
      const child = shuffledChildren[i % shuffledChildren.length];
      clues.push({ ...c, category: 'childHint', found: false, npcId: child.id,
        text: c.text.replace(/\{culprit\}/g, getMixedNames()) });
    });
    // Motivation clues (2)
    clueSet.motivationClues.forEach(c => {
      clues.push({ ...c, category: 'motivation', found: false,
        text: c.text.replace(/\{culprit\}/g, getMixedNames()) });
    });
    // Red herrings (5)
    const herrings = [...DB.redHerrings];
    this._shuffle(herrings);
    const locations = DB.locations.map(l => l.id);
    for (let i = 0; i < 5; i++) {
      clues.push({ id: 'rh_' + i, text: herrings[i % herrings.length], category: 'redHerring',
        found: false, location: locations[Math.floor(Math.random() * locations.length)] });
    }
    return { culprit, motivation, clues };
  },

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
};
