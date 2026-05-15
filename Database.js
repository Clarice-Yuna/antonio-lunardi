// ==============================
// DATABASE - As Sombras de Antônio Lunardi
// ==============================
const DB = {
  npcs: [
    // 7 Homens
    { id: 'inacio', name: 'Padre Inácio', gender: 'M', type: 'adult', age: 62, role: 'Padre da Igreja', location: 'igreja', portrait: '⛪', desc: 'O padre da cidade, sempre com o terço na mão.', trustThreshold: 0 },
    { id: 'donato', name: 'Seu Donato', gender: 'M', type: 'adult', age: 55, role: 'Prefeito', location: 'prefeitura', portrait: '🎩', desc: 'O prefeito de Antônio Lunardi. Político astuto.', trustThreshold: 2 },
    { id: 'ze', name: 'Zé da Mata', gender: 'M', type: 'adult', age: 40, role: 'Caçador', location: 'floresta', portrait: '🪓', desc: 'Caçador solitário que conhece cada trilha da floresta.', trustThreshold: 3 },
    { id: 'tobias', name: 'Tobias Ferro', gender: 'M', type: 'adult', age: 48, role: 'Ferreiro', location: 'armazem', portrait: '🔨', desc: 'O ferreiro da cidade. Braços fortes e temperamento explosivo.', trustThreshold: 1 },
    { id: 'mendes', name: 'Dr. Mendes', gender: 'M', type: 'adult', age: 58, role: 'Médico', location: 'praca', portrait: '💊', desc: 'O único médico da cidade. Sempre exausto, sempre vigilante.', trustThreshold: 1 },
    { id: 'augusto', name: 'Augusto Braga', gender: 'M', type: 'adult', age: 35, role: 'Fazendeiro', location: 'rio', portrait: '🌾', desc: 'Jovem fazendeiro cuja esposa desapareceu há dois meses.', trustThreshold: 2 },
    { id: 'cicero', name: 'Cícero Ramos', gender: 'M', type: 'adult', age: 44, role: 'Pescador', location: 'rio', portrait: '🎣', desc: 'Pescador do Rio das Almas. Jura que ouve cantos vindos da água à noite.', trustThreshold: 1 },
    // 5 Mulheres
    { id: 'marta', name: 'Dona Marta', gender: 'F', type: 'adult', age: 65, role: 'Herbalista', location: 'praca', portrait: '🌿', desc: 'A herbalista da cidade. Conhece cada planta.', trustThreshold: 2 },
    { id: 'helena', name: 'Helena Vieira', gender: 'F', type: 'adult', age: 32, role: 'Professora', location: 'praca', portrait: '📖', desc: 'A professora da escola. Inteligente e reservada.', trustThreshold: 1 },
    { id: 'rosalia', name: 'Rosália Santos', gender: 'F', type: 'adult', age: 50, role: 'Estalajadeira', location: 'estalagem', portrait: '🛏️', desc: 'Dona da estalagem onde você se hospeda.', trustThreshold: 0 },
    { id: 'benedita', name: 'Benedita Cruz', gender: 'F', type: 'adult', age: 45, role: 'Costureira', location: 'praca', portrait: '🧵', desc: 'A costureira da cidade.', trustThreshold: 2 },
    { id: 'carmela', name: 'Carmela Oliveira', gender: 'F', type: 'adult', age: 38, role: 'Viúva', location: 'cemiterio', portrait: '🥀', desc: 'Viúva jovem que visita o cemitério todos os dias.', trustThreshold: 3 },
    // 3 Crianças
    { id: 'pedrinho', name: 'Pedrinho', gender: 'M', type: 'child', age: 10, role: 'Menino Curioso', location: 'praca', portrait: '👦', desc: 'Menino travesso que vive explorando onde não deve.', trustThreshold: 0 },
    { id: 'luisa', name: 'Luísa', gender: 'F', type: 'child', age: 8, role: 'Menina Quieta', location: 'igreja', portrait: '👧', desc: 'Menina silenciosa que desenha constantemente.', trustThreshold: 2 },
    { id: 'tico', name: 'Tico', gender: 'M', type: 'child', age: 11, role: 'Órfão', location: 'armazem', portrait: '🧒', desc: 'Órfão que vive no armazém abandonado.', trustThreshold: 1 }
  ],

  locations: [
    { id: 'praca', name: 'Praça Central', icon: '🏛️', desc: 'O coração morto de Antônio Lunardi. A fonte seca acumula folhas secas e murmúrios.', nightDesc: 'A praça está deserta. A névoa rasteja entre os bancos de pedra. Algo observa das sombras.' },
    { id: 'igreja', name: 'Igreja Antiga', icon: '⛪', desc: 'A igreja centenária. Suas paredes rachadas guardam mais confissões do que deviam.', nightDesc: 'As velas tremulam sem vento. Um sussurro ecoa do confessionário vazio.' },
    { id: 'cemiterio', name: 'Cemitério', icon: '⚰️', desc: 'O cemitério da cidade. Algumas lápides têm marcas estranhas, como arranhões desesperados.', nightDesc: 'A terra parece se mover. Luzes azuladas piscam entre as sepulturas mais antigas.' },
    { id: 'floresta', name: 'Floresta Negra', icon: '🌲', desc: 'A densa floresta ao norte. Trilhas que não constam em nenhum mapa levam a clareiras ocultas.', nightDesc: 'Os galhos se retorcem como dedos. Um canto distorcido vem das profundezas.' },
    { id: 'prefeitura', name: 'Prefeitura / Tribunal', icon: '🏛️', desc: 'A prefeitura de Antônio Lunardi. Aqui justiça é feita — ou fabricada.', nightDesc: 'Os corredores vazios amplificam cada passo. Documentos antigos sussurram segredos.' },
    { id: 'rio', name: 'Rio das Almas', icon: '🌊', desc: 'O rio que corta a cidade. Suas águas escuras refletem rostos que não são os seus.', nightDesc: 'A superfície da água ondula sem vento. Sombras deslizam sob a superfície.' },
    { id: 'armazem', name: 'Armazém Abandonado', icon: '🏚️', desc: 'Um armazém velho nos limites da cidade. Cheiro de ferrugem e algo mais... orgânico.', nightDesc: 'Rangidos metálicos ecoam. Marcas de sangue seco formam padrões no chão.' },
    { id: 'estalagem', name: 'Estalagem', icon: '🏠', desc: 'Sua base de operações. Rosália mantém o lugar funcionando, mas os quartos vazios contam histórias.', nightDesc: 'O assoalho range acima de você. Mas seu quarto é o último ocupado.' }
  ],

  motivations: [
    { id: 'vinganca', name: 'Vingança', icon: '🗡️', desc: 'O culpado busca vingança contra a cidade por um crime antigo cometido contra sua família.', clueTheme: 'ódio, cartas antigas, cicatrizes, objetos quebrados' },
    { id: 'imortalidade', name: 'Imortalidade', icon: '⏳', desc: 'O culpado realiza rituais para alcançar a vida eterna, usando os desaparecidos como sacrifício.', clueTheme: 'ervas raras, textos alquímicos, obsessão com juventude' },
    { id: 'oferenda', name: 'Oferenda Macabra', icon: '👁️', desc: 'O culpado serve uma entidade antiga, oferecendo almas em troca de poder sobrenatural.', clueTheme: 'altares, símbolos estranhos, animais mortos, cânticos' },
    { id: 'poder', name: 'Sede de Poder', icon: '👑', desc: 'O culpado busca domínio absoluto sobre a cidade através de magia negra.', clueTheme: 'ambição, grimórios, artefatos estranhos, manipulação' },
    { id: 'maldicao', name: 'Maldição Ancestral', icon: '📜', desc: 'O culpado tenta cumprir — ou quebrar — uma maldição que persegue sua linhagem.', clueTheme: 'árvore genealógica, objetos amaldiçoados, padrões geracionais' },
    { id: 'ressurreicao', name: 'Ressurreição', icon: '💀', desc: 'O culpado tenta trazer de volta um ente querido, sacrificando outros no processo.', clueTheme: 'luto, pertences de falecido, sepulturas perturbadas, preservação' }
  ],

  // Clue templates - will be filled procedurally
  clueTemplates: {
    vinganca: {
      physical: [
        { id: 'v_p1', text: 'Uma carta antiga, manchada de sangue, mencionando uma traição contra a família {culprit}.', location: 'igreja' },
        { id: 'v_p2', text: 'Um boneco de pano com alfinetes espetados, com as iniciais de um cidadão desaparecido.', location: 'floresta' },
        { id: 'v_p3', text: 'Marcas de unhas nas paredes do porão, junto a um diário cheio de rancor escrito por {culprit}.', location: 'armazem' }
      ],
      testimony: [
        { id: 'v_t1', text: '"Eu vi {culprit} queimando papéis na calada da noite atrás da igreja."', npcPool: 'adult' },
        { id: 'v_t2', text: '"A família de {culprit} foi injustiçada há muitos anos... eu nunca esqueci o olhar daquela criança."', npcPool: 'adult' },
        { id: 'v_t3', text: '"{culprit} andava murmurando nomes... os nomes dos desaparecidos, antes deles sumirem."', npcPool: 'adult' }
      ],
      childHints: [
        { id: 'v_c1', text: '"Eu vi {culprit} chorando no cemitério... mas não era tristeza, era raiva."', npcPool: 'child' },
        { id: 'v_c2', text: '"Tinha um desenho de fogo na parede da casa de {culprit}. Fogo e nomes."', npcPool: 'child' }
      ],
      motivationClues: [
        { id: 'v_m1', text: 'Um registro antigo da prefeitura revela que a família do culpado foi expulsa injustamente da cidade há 30 anos.', location: 'prefeitura' },
        { id: 'v_m2', text: 'Fotografias rasgadas mostrando o culpado quando criança, com marcas de violência, escondidas sob o altar.', location: 'igreja' }
      ]
    },
    imortalidade: {
      physical: [
        { id: 'i_p1', text: 'Frascos de substâncias desconhecidas com rótulos em latim, encontrados escondidos. Pertencem a {culprit}.', location: 'armazem' },
        { id: 'i_p2', text: 'Um espelho rachado com símbolos alquímicos gravados na moldura. Tem as digitais de {culprit}.', location: 'estalagem' },
        { id: 'i_p3', text: 'Ervas raras arrancadas violentamente, com pegadas que levam à casa de {culprit}.', location: 'floresta' }
      ],
      testimony: [
        { id: 'i_t1', text: '"{culprit} me pediu ervas estranhas... coisas que não curam, que só servem pra... outra coisa."', npcPool: 'adult' },
        { id: 'i_t2', text: '"Eu notei que {culprit} não envelhece como nós. Há algo errado."', npcPool: 'adult' },
        { id: 'i_t3', text: '"{culprit} foi visto(a) coletando água do rio à meia-noite, murmurando encantamentos."', npcPool: 'adult' }
      ],
      childHints: [
        { id: 'i_c1', text: '"O {culprit} tem um livro escondido... com desenhos de pessoas dormindo pra sempre."', npcPool: 'child' },
        { id: 'i_c2', text: '"Eu vi {culprit} olhando pro espelho e falando com alguém que não tava lá."', npcPool: 'child' }
      ],
      motivationClues: [
        { id: 'i_m1', text: 'Um diário pessoal revela obsessão do culpado com a morte e métodos antigos de prolongar a vida.', location: 'cemiterio' },
        { id: 'i_m2', text: 'Receitas alquímicas complexas, exigindo "essência vital" como ingrediente principal.', location: 'armazem' }
      ]
    },
    oferenda: {
      physical: [
        { id: 'o_p1', text: 'Um altar improvisado com velas negras e ossos de animais. Cabelos de {culprit} entre as oferendas.', location: 'floresta' },
        { id: 'o_p2', text: 'Símbolos pintados com sangue na parede, idênticos a um amuleto que {culprit} usa.', location: 'armazem' },
        { id: 'o_p3', text: 'Animais mortos dispostos em círculo ritualístico. Rastros levam à direção de {culprit}.', location: 'cemiterio' }
      ],
      testimony: [
        { id: 'o_t1', text: '"{culprit} anda falando sozinho(a)... mas parece que está respondendo a alguém."', npcPool: 'adult' },
        { id: 'o_t2', text: '"Eu ouvi cânticos vindos da casa de {culprit} de madrugada. Não era reza, era outra coisa."', npcPool: 'adult' },
        { id: 'o_t3', text: '"Animais somem perto de onde {culprit} passa. Até os cães fogem."', npcPool: 'adult' }
      ],
      childHints: [
        { id: 'o_c1', text: '"O {culprit} deixa comida no mato de noite. Mas não é pra bicho, é pra algo pior."', npcPool: 'child' },
        { id: 'o_c2', text: '"Eu desenhei o que vi na floresta... olha. Parece um olho gigante feito de pedras."', npcPool: 'child' }
      ],
      motivationClues: [
        { id: 'o_m1', text: 'Um pacto escrito em pele curtida, prometendo almas em troca de proteção sobrenatural.', location: 'floresta' },
        { id: 'o_m2', text: 'Registros indicam que desaparecimentos similares ocorreram há 100 anos, ligados à mesma família.', location: 'prefeitura' }
      ]
    },
    poder: {
      physical: [
        { id: 'p_p1', text: 'Um grimório escondido com instruções de controle mental. A caligrafia é de {culprit}.', location: 'prefeitura' },
        { id: 'p_p2', text: 'Bonecos representando cada cidadão da cidade, com fios conectando-os a {culprit}.', location: 'armazem' },
        { id: 'p_p3', text: 'Mapas detalhados das rotinas de cada cidadão, anotados obsessivamente por {culprit}.', location: 'estalagem' }
      ],
      testimony: [
        { id: 'p_t1', text: '"{culprit} tem feito perguntas estranhas... sobre quem na cidade não seria notado se sumisse."', npcPool: 'adult' },
        { id: 'p_t2', text: '"Sinto que {culprit} sabe coisas sobre mim que eu nunca contei a ninguém."', npcPool: 'adult' },
        { id: 'p_t3', text: '"{culprit} mudou... antes era uma pessoa comum, agora... parece que nos olha como peças de xadrez."', npcPool: 'adult' }
      ],
      childHints: [
        { id: 'p_c1', text: '"O {culprit} me deu um doce e pediu pra eu contar onde todo mundo fica de noite."', npcPool: 'child' },
        { id: 'p_c2', text: '"Eu vi {culprit} escondendo coisas brilhantes debaixo do chão da prefeitura."', npcPool: 'child' }
      ],
      motivationClues: [
        { id: 'p_m1', text: 'Cartas não enviadas revelam planos de controlar a cidade através de medo e superstição.', location: 'igreja' },
        { id: 'p_m2', text: 'Um mapa com a cidade redesenhada, com o culpado no centro como "senhor absoluto".', location: 'prefeitura' }
      ]
    },
    maldicao: {
      physical: [
        { id: 'mc_p1', text: 'Uma árvore genealógica da família de {culprit}, com marcas de morte a cada geração no mesmo ano.', location: 'igreja' },
        { id: 'mc_p2', text: 'Objetos amaldiçoados enterrados em pontos cardeais da cidade. Um tem as iniciais de {culprit}.', location: 'cemiterio' },
        { id: 'mc_p3', text: 'Um relicário antigo com cabelo e unhas, selado com cera negra. Pertence à linhagem de {culprit}.', location: 'floresta' }
      ],
      testimony: [
        { id: 'mc_t1', text: '"A família de {culprit} sempre foi estranha. A cada geração, algo terrível acontece."', npcPool: 'adult' },
        { id: 'mc_t2', text: '"A avó de {culprit} morreu gritando sobre uma dívida que precisava ser paga."', npcPool: 'adult' },
        { id: 'mc_t3', text: '"{culprit} procurou registros antigos de batismo, especificamente os de sua família."', npcPool: 'adult' }
      ],
      childHints: [
        { id: 'mc_c1', text: '"O {culprit} me perguntou se eu acredito em maldições de família. Eu disse que não. Ele ficou triste."', npcPool: 'child' },
        { id: 'mc_c2', text: '"Eu achei um colar enterrado perto do rio. Tinha o nome da família de {culprit}."', npcPool: 'child' }
      ],
      motivationClues: [
        { id: 'mc_m1', text: 'Registros paroquiais mostram que em cada geração da família, membros da cidade desaparecem.', location: 'igreja' },
        { id: 'mc_m2', text: 'Um diário ancestral descreve o pacto original: sangue inocente para manter a linhagem viva.', location: 'cemiterio' }
      ]
    },
    ressurreicao: {
      physical: [
        { id: 'r_p1', text: 'Uma sepultura foi aberta e o corpo removido. Pegadas levam à propriedade de {culprit}.', location: 'cemiterio' },
        { id: 'r_p2', text: 'Frascos de formol e instrumentos cirúrgicos improvisados, escondidos por {culprit}.', location: 'armazem' },
        { id: 'r_p3', text: 'Pertences do(a) falecido(a) esposo(a)/filho(a) de {culprit}, dispostos como se a pessoa ainda vivesse.', location: 'estalagem' }
      ],
      testimony: [
        { id: 'r_t1', text: '"{culprit} ainda fala com o(a) falecido(a) como se estivesse vivo(a). Não é luto... é outra coisa."', npcPool: 'adult' },
        { id: 'r_t2', text: '"Eu vi {culprit} carregando algo pesado do cemitério de madrugada."', npcPool: 'adult' },
        { id: 'r_t3', text: '"{culprit} me pediu livros sobre anatomia e preservação. Achei estranho."', npcPool: 'adult' }
      ],
      childHints: [
        { id: 'r_c1', text: '"O {culprit} chora toda noite. Eu ouço de longe. Mas de dia, sorri como se nada fosse."', npcPool: 'child' },
        { id: 'r_c2', text: '"Eu vi uma luz na janela de {culprit} e uma sombra de duas pessoas. Mas {culprit} mora sozinho(a)."', npcPool: 'child' }
      ],
      motivationClues: [
        { id: 'r_m1', text: 'Uma carta desesperada revela que o culpado acredita poder trazer seu ente querido de volta com almas suficientes.', location: 'rio' },
        { id: 'r_m2', text: 'Registros médicos falsificados tentam esconder a causa real da morte do ente querido do culpado.', location: 'prefeitura' }
      ]
    }
  },

  redHerrings: [
    'Um frasco de substância estranha foi encontrado, mas parece ser remédio caseiro comum.',
    'Marcas suspeitas no chão que, após análise, são apenas lama seca.',
    'Um bilhete anônimo ameaçador que parece ter sido escrito por uma criança brincando.',
    'Pegadas estranhas que na verdade pertencem a um animal selvagem.',
    'Um cheiro forte de enxofre que vem de uma fonte termal natural.',
    'Velas negras que são na verdade velas comuns escurecidas pela fumaça.'
  ],

  terrorEvents: [
    { trigger: 'night_floresta', text: 'Ao entrar na floresta, você vê uma silhueta entre as árvores. Ela se vira lentamente... e desaparece.', type: 'visual' },
    { trigger: 'night_cemiterio', text: 'Uma mão pálida emerge da terra por um instante antes de ser puxada de volta.', type: 'visual' },
    { trigger: 'night_igreja', text: 'O órgão da igreja toca uma nota única, longa e dissonante. Não há ninguém sentado ao instrumento.', type: 'audio' },
    { trigger: 'night_armazem', text: 'As correntes do armazém balançam sozinhas. No reflexo de um metal polido, um rosto que não é o seu te observa.', type: 'visual' },
    { trigger: 'night_rio', text: 'A água do rio se aquieta completamente. No silêncio, você ouve seu próprio nome sussurrado das profundezas.', type: 'audio' },
    { trigger: 'clue_found_5', text: 'Ao encontrar a quinta pista, sua visão distorce. Por um segundo, todos os rostos da cidade parecem iguais.', type: 'glitch' },
    { trigger: 'day_7', text: 'No sétimo dia, ao acordar, há marcas de dedos na janela do seu quarto — do lado de dentro.', type: 'visual' },
    { trigger: 'accusation_wrong', text: 'Ao acusar o inocente, as luzes da cidade piscam. Um grito distante corta o silêncio.', type: 'audio' }
  ],

  dialogueDefaults: {
    inacio: ['Deus nos proteja, investigador. Esta cidade precisa de mais do que orações.', 'Eu ouço confissões... mas ultimamente, as pessoas confessam medos, não pecados.', 'Há algo antigo nesta terra. Mais antigo que esta igreja.'],
    donato: ['Bem-vindo a Antônio Lunardi, investigador. Espero que resolva isso antes que eu perca meus eleitores.', 'A cidade está em pânico. Preciso de resultados, não de teorias.', 'Cuidado com o que desenterra. Alguns segredos foram enterrados por boas razões.'],
    ze: ['...', 'A floresta tá diferente. Os bichos fugiram.', 'Eu vi coisas naquela mata que não vou repetir.'],
    tobias: ['Precisa de alguma ferramenta? É o que faço de melhor.', 'As noites andam barulhentas demais pra uma cidade tão quieta.', 'Se achar o culpado, me avise. Tenho um martelo com o nome dele.'],
    mendes: ['Investigador, as pessoas estão doentes de medo. É o pior tipo de doença.', 'Tenho visto marcas estranhas nos pacientes. Não são ferimentos comuns.', 'A ciência me ensinou a ser cético, mas esta cidade testa minha fé na razão.'],
    augusto: ['Minha esposa... ela sumiu há dois meses. Ninguém fez nada.', 'Eu não consigo dormir. Toda noite, sinto que ela está tentando voltar.', 'Se você encontrar quem fez isso, me diga. Por favor.'],
    cicero: ['O rio tá estranho. A água mudou de cor na semana passada.', 'Eu pesco há 30 anos neste rio, mas nunca vi o que vi ontem à noite.', 'Tem algo embaixo daquela água. Algo que não deveria existir.'],
    marta: ['Minhas ervas não curam o medo, investigador.', 'Conheço cada planta desta região. Alguém anda colhendo coisas que não servem pra remédio.', 'A natureza está avisando. Os sinais estão por toda parte.'],
    helena: ['As crianças estão com medo de ir à escola.', 'Eu encontrei desenhos perturbadores nas mesas dos alunos.', 'Esta cidade tem uma história que ninguém quer contar.'],
    rosalia: ['Seu quarto está pronto, investigador. Tranque bem a porta.', 'Eu vejo quem entra e quem sai desta cidade. Ultimamente, só vejo quem sai.', 'As paredes desta estalagem guardam muitos segredos.'],
    benedita: ['Minhas mãos tremem demais pra costurar ultimamente.', 'Eu faço roupas pra toda a cidade. Conheço o corpo de cada um. E alguns corpos mudaram.', 'Há algo errado com o tecido desta cidade. Os fios estão se desfazendo.'],
    carmela: ['Eu visito meu marido todos os dias. Mas ultimamente... a sepultura parece diferente.', 'Tem gente que acha que luto é loucura. Eu sei a diferença.', 'O cemitério não é mais um lugar de descanso.'],
    pedrinho: ['Moço, eu vi uma coisa estranha ontem!', 'Os adultos acham que criança não entende nada. Mas eu vejo tudo.', 'Quer que eu te mostre um lugar secreto?'],
    luisa: ['...', '*Luísa te mostra um desenho silenciosamente*', 'Os monstros dos meus desenhos são reais. Eu sei porque eu vi.'],
    tico: ['Eu moro aqui no armazém. Ninguém se importa.', 'De noite, eu ouço barulhos estranhos. Mas já me acostumei.', 'Eu sei de um segredo, mas se eu contar, pode ser perigoso.']
  },

  npcResponses: {
    inacio: {
      who: "Sou o Padre Inácio. Cuido das almas desta cidade esquecida.",
      job: "Ofereço conforto aos aflitos. Ultimamente, o rebanho só aumenta de medo.",
      where: "Estava na igreja, rezando pelos que se foram.",
      strange: "As velas se apagam sozinhas. Há um frio que não é natural.",
      city: "Antônio Lunardi é um purgatório na Terra."
    },
    donato: {
      who: "Sou Donato, o Prefeito. E quem seria você para me interrogar?",
      job: "Mantenho a ordem. Algo muito difícil quando todos perdem a razão.",
      where: "Na prefeitura, trabalhando. Ao contrário de alguns.",
      strange: "O estranho é a histeria do povo. Apenas isso.",
      city: "É minha cidade. E eu a protegerei, de um jeito ou de outro."
    },
    ze: {
      who: "Zé da Mata. Apenas isso.",
      job: "Caço, sobrevivo.",
      where: "Na floresta. Onde mais?",
      strange: "Os animais desapareceram. A mata está em silêncio absoluto.",
      city: "Tem uma maldição aqui. É palpável."
    },
    tobias: {
      who: "Tobias. Cuido do ferro.",
      job: "Sou ferreiro. Faço coisas que quebram o que deve ser quebrado.",
      where: "No meu armazém. O fogo me acalma.",
      strange: "Tem gente pedindo facas ao invés de enxadas.",
      city: "Gente fraca. Quando o perigo vem, eles choram."
    },
    mendes: {
      who: "Doutor Mendes. Sou o médico da cidade.",
      job: "Curo os vivos e atesto a morte dos que não têm salvação.",
      where: "Fazendo rondas. A doença não dorme.",
      strange: "Vi marcas nos cadáveres. Nenhuma besta faz aquilo.",
      city: "Um corpo apodrecendo."
    },
    augusto: {
      who: "Augusto. Apenas um homem que perdeu tudo.",
      job: "Era fazendeiro. Agora, só procuro minha esposa.",
      where: "Buscando por ela. Toda noite.",
      strange: "O choro. Eu ouço o choro dela vindo do rio.",
      city: "Um cemitério de pessoas vivas."
    },
    cicero: {
      who: "Cícero. Pescador.",
      job: "Trago peixes do Rio das Almas. Ou tentava.",
      where: "No rio, onde sempre estou.",
      strange: "O rio tá cuspindo coisas ruins. Sombras nadam na água.",
      city: "Estamos afundando. E a água tá gelada."
    },
    marta: {
      who: "Marta. Você pode me chamar de Dona Marta.",
      job: "Conheço as raízes e as folhas. Ajudo a curar.",
      where: "Colhendo. A noite traz as melhores ervas.",
      strange: "A natureza está com raiva. Alguém a ofendeu.",
      city: "A terra aqui está podre por baixo."
    },
    helena: {
      who: "Helena. Sou a professora.",
      job: "Ensino as crianças. Mas ultimamente, elas têm me ensinado sobre o medo.",
      where: "Corrigindo tarefas. Sozinha.",
      strange: "As crianças estão desenhando coisas... monstruosas.",
      city: "Um lugar sem futuro."
    },
    rosalia: {
      who: "Rosália. Bem-vindo à minha estalagem.",
      job: "Hospedo viajantes. E ouço histórias.",
      where: "Aqui. Sempre aqui.",
      strange: "Tem gente que entra na cidade à noite e não sai de dia.",
      city: "Um caldeirão prestes a ferver."
    },
    benedita: {
      who: "Benedita. A costureira.",
      job: "Faço roupas. E mortalhas, recentemente.",
      where: "Costurando. Tenho muito trabalho.",
      strange: "Achei sangue nos tecidos de algumas pessoas.",
      city: "Um tecido se rasgando."
    },
    carmela: {
      who: "Carmela. Mas não sou mais a mesma.",
      job: "Sou viúva. Minha profissão agora é o luto.",
      where: "No cemitério. Fazendo companhia a ele.",
      strange: "A terra das covas parece ter sido remexida.",
      city: "Uma cidade morta. Só falta o enterro."
    },
    pedrinho: {
      who: "Sou o Pedrinho!",
      job: "Eu exploro! Conheço todos os lugares secretos.",
      where: "Escondido. Tem monstros à noite.",
      strange: "Eu vi um homem alto sem rosto na floresta!",
      city: "Um parquinho cheio de armadilhas."
    },
    luisa: {
      who: "Luísa.",
      job: "Eu desenho as coisas que vejo quando fecho os olhos.",
      where: "Embaixo da cama.",
      strange: "A sombra do padre tem chifres.",
      city: "O monstro vai comer todo mundo."
    },
    tico: {
      who: "Tico. Só Tico.",
      job: "Eu me escondo. É o melhor trabalho aqui.",
      where: "No teto do armazém.",
      strange: "As pessoas mentem. Eu ouço elas sozinhas.",
      city: "Um labirinto escuro."
    }
  },

  npcDefenses: {
    inacio: "Meu nome? Mas eu estava rezando no cemitério para afastar o mal, não o causando! O sangue... é vinho sagrado que derramei em pânico!",
    donato: "Que absurdo! Tentam me incriminar porque invejam minha posição. Eu estava em reunião a portas fechadas, e tenho como provar!",
    ze: "Eu uso minhas ferramentas pra esfolar bicho! Alguém deve ter pegado da minha cabana enquanto eu estava longe. Não tente me culpar pelos monstros da cidade.",
    tobias: "Meu nome nisso?! Fui roubado semana passada! Alguém levou minhas coisas da forja. Se eu pego quem fez isso...",
    mendes: "Sou um médico, pelo amor de Deus! Minha caligrafia e meus instrumentos salvam vidas. Se estão no meio disso, fui sabotado!",
    augusto: "Eu sou a vítima aqui! Minha esposa sumiu e agora tentam colocar a culpa em mim? Isso é crueldade de quem a levou!",
    cicero: "Eu nem saio do meu barco à noite! As coisas que encontro na água já estavam mortas, não fui eu quem as matou!",
    marta: "Minhas ervas?! Eu ensino receitas para todos nesta cidade. Qualquer um poderia ter preparado isso e colocado meu nome para me difamar.",
    helena: "Um aluno deve ter pegado minhas coisas... Eu jamais machucaria alguém. Sou professora! Estão usando meu acesso contra mim.",
    rosalia: "Minhas chaves ficam à mostra, qualquer um que se hospeda aqui pode pegá-las e abrir portas no meu nome. Isso é injusto!",
    benedita: "Os fios são da minha loja, sim, mas eu vendo para todo mundo! E as manchas no tecido... eu cortei meu dedo costurando de madrugada!",
    carmela: "Eu estava no cemitério apenas chorando pelo meu marido! Não tenho motivo para fazer mal a mais ninguém, minha vida já acabou.",
    pedrinho: "Não fui eu! Eu só peguei escondido pra brincar e deixei cair lá! Eu juro que não vi mais nada!",
    luisa: "O monstro desenhou isso... ele usa meu nome pra tentar me levar também.",
    tico: "Eu moro lá, mas não sei de nada! Eu durmo e deixo minhas coisas espalhadas, alguém pegou de maldade!"
  },

  dailyTopics: [
    "Ontem choveu. Uma chuva com cheiro de ferro.",
    "Alguém viu corvos rodeando a praça hoje cedo.",
    "A névoa está mais espessa. Não dá pra ver um palmo à frente.",
    "Disseram que ouviram gritos na floresta na última noite.",
    "O sol não apareceu hoje. Parece que não quer nos ver.",
    "As portas estavam todas trancadas, mas encontrei janelas abertas de manhã."
  ]
};
