import { GrammarCard } from '../types';

export const INITIAL_GRAMMAR: GrammarCard[] = [
  {
    id: 'gram-8',
    title: 'Present Simple — простое настоящее (регулярные действия, факты, расписания)',
    level: 'A1',
    category: 'Времена глагола',
    formula: '+ I/You/We/They + V1 | He/She/It + V1-s(es) • - don\'t / doesn\'t + V1 • ? Do / Does + S + V1',
    explanation: 'Present Simple описывает регулярные, повторяющиеся действия (привычки, тренировки по графику), общеизвестные факты, постоянные состояния и точное расписание занятий (даже если речь идет о будущем расписании клуба).',
    keyRule: 'Для местоимений He, She, It (или одного человека: the coach, the child) к глаголу в утверждении добавляется окончание -s / -es (he arrives, she teaches). В вопросах и отрицаниях (Does / doesn\'t) это окончание «убегает» в does, а основной глагол остается чистым (Does he arrive?).',
    examples: [
      {
        en: 'We offer a wide range of activities for kids.',
        ru: 'Мы предлагаем широкий спектр занятий для детей (постоянный факт о клубе).',
        highlight: 'offer',
      },
      {
        en: 'The toddler class starts at 10 AM every Saturday.',
        ru: 'Занятие для малышей начинается в 10 утра каждую субботу (расписание).',
        highlight: 'starts',
      },
      {
        en: 'Make sure he arrives 10 minutes prior to class.',
        ru: 'Убедитесь, что он приходит за 10 минут до начала занятия (регулярное правило).',
        highlight: 'arrives',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Does she arrives early to warm up?',
        correct: 'Does she arrive early to warm up?',
        why: 'Когда в предложении уже есть вспомогательный глагол does / doesn\'t, окончание -s у основного глагола не пишется!',
      },
      {
        wrong: 'What age you accept?',
        correct: 'What age do you accept?',
        why: 'В вопросах Present Simple (кроме вопросов с глаголом be / can) обязательно нужен вспомогательный глагол do или does.',
      },
    ],
    quiz: {
      question: 'Выберите правильный вариант для расписания и регулярного правила: "Наш главный тренер _____ разминку в 4 часа"',
      options: [
        'Our head coach start the warm-up at 4 PM',
        'Our head coach starts the warm-up at 4 PM',
        'Our head coach is start the warm-up at 4 PM',
        'Our head coach starting the warm-up at 4 PM',
      ],
      correctIndex: 1,
      explanation: 'Для регулярного расписания используется Present Simple; "our head coach" = he/she, поэтому добавляем -s: starts.',
    },
    builderTask: {
      targetRu: 'Мы предлагаем широкий спектр занятий для детей.',
      scrambledWords: ['We', 'offer', 'a', 'wide', 'range', 'of', 'activities', 'for', 'kids'],
      correctSentence: 'We offer a wide range of activities for kids',
      hint: 'Present Simple с подлежащим We...',
    },
  },

  {
    id: 'gram-9',
    title: 'Present Continuous — настоящее длительное (процесс сейчас и временный период)',
    level: 'A2',
    category: 'Времена глагола',
    formula: '+ S + am / is / are + V-ing • - am / is / are + not + V-ing • ? Am / Is / Are + S + V-ing',
    explanation: 'Present Continuous используется в двух главных случаях: (1) действие происходит прямо сейчас, в момент речи (Look! She is doing a cartwheel!); (2) временный процесс или этап, который длится в текущем периоде — на этой неделе, в этом месяце (This month we are training for the showcase; She is making steady progress).',
    keyRule: 'Нельзя терять глагол-связку am / is / are! Неправильно: "She training now". Правильно: "She is training now". Глаголы состояния (know, want, need, love, appreciate) обычно НЕ используются в Continuous.',
    examples: [
      {
        en: 'This month we are training hard for the winter showcase.',
        ru: 'В этом месяце мы усердно готовимся (тренируемся) к зимнему выступлению.',
        highlight: 'are training',
      },
      {
        en: 'She is making steady progress with her balance.',
        ru: 'Она стабильно прогрессирует в удержании равновесия (текущий процесс развития).',
        highlight: 'is making',
      },
      {
        en: 'Look, the preschoolers are warming up on the mats right now!',
        ru: 'Смотрите, дошкольники прямо сейчас разминаются на матах!',
        highlight: 'are warming up',
      },
    ],
    commonMistakes: [
      {
        wrong: 'This month we training every Tuesday.',
        correct: 'This month we are training every Tuesday.',
        why: 'Форма -ing без вспомогательного глагола am/is/are — грамматическая ошибка. С местоимением we обязательно ставим are.',
      },
      {
        wrong: 'I am appreciating your feedback very much.',
        correct: 'I appreciate your feedback very much.',
        why: 'Глаголы чувств и оценки (appreciate, want, know, understand) — статичные глаголы (stative verbs), они ставятся в Present Simple.',
      },
    ],
    quiz: {
      question: 'Как правильно сказать о временной программе в этом месяце: "В этом месяце мы изучаем кувырки вперед"?',
      options: [
        'This month we learn forward rolls.',
        'This month we are learning forward rolls.',
        'This month we learning forward rolls.',
        'This month we is learning forward rolls.',
      ],
      correctIndex: 1,
      explanation: 'Временная ситуация в текущем периоде ("this month") выражается через Present Continuous: we are learning.',
    },
    builderTask: {
      targetRu: 'В этом месяце мы тренируемся на новых мягких матах.',
      scrambledWords: ['This', 'month', 'we', 'are', 'training', 'on', 'new', 'soft', 'mats'],
      correctSentence: 'This month we are training on new soft mats',
      hint: 'Начните с временного маркера This month...',
    },
  },

  {
    id: 'gram-10',
    title: 'Past Simple — простое прошедшее (завершенные действия в прошлом)',
    level: 'A2',
    category: 'Времена глагола',
    formula: '+ S + V2 (V-ed или 2-я форма) • - S + didn\'t + V1 • ? Did + S + V1',
    explanation: 'Past Simple обозначает действие, которое началось и полностью завершилось в прошлом. Часто в предложении есть конкретное указание на прошедшее время: yesterday (вчера), last week (на прошлой неделе), 10 minutes ago (10 минут назад), on Monday (в прошлый понедельник), или оценка только что выполненного трюка ("You did it!").',
    keyRule: 'В утверждении используем 2-ю форму глагола: к правильным добавляем -ed (learned, improved, confirmed), а у неправильных берем особую форму из таблицы V2 (do → did, hold → held, make → made). В отрицаниях и вопросах с did / didn\'t глагол возвращается в 1-ю форму (Did she do it? — не Did she did it!).',
    examples: [
      {
        en: 'You held the handstand for five seconds — you did it!',
        ru: 'Ты удержал стойку на руках пять секунд — у тебя получилось!',
        highlight: 'held ... did',
      },
      {
        en: 'We received your inquiry yesterday and confirmed your spot.',
        ru: 'Мы получили ваш запрос вчера и подтвердили ваше место.',
        highlight: 'received ... confirmed',
      },
      {
        en: 'Did he fall during the backward roll? No, he didn\'t fall!',
        ru: 'Он упал во время кувырка назад? Нет, он не упал!',
        highlight: 'Did ... fall / didn\'t fall',
      },
    ],
    commonMistakes: [
      {
        wrong: 'She didn\'t came to class yesterday.',
        correct: 'She didn\'t come to class yesterday.',
        why: 'Вспомогательный глагол didn\'t уже несет значение прошедшего времени, поэтому основной глагол ставится строго в 1-й форме (come, а не came).',
      },
      {
        wrong: 'We goed to the competition last week.',
        correct: 'We went to the competition last week.',
        why: 'Go — неправильный глагол! Его форма прошедшего времени (V2) — went, а не goed.',
      },
    ],
    quiz: {
      question: 'Как правильно сказать: "Она вчера нашла свое равновесие на бревне"? (find — неправильный глагол)',
      options: [
        'She finded her balance on the beam yesterday.',
        'She found her balance on the beam yesterday.',
        'She did found her balance on the beam yesterday.',
        'She has find her balance on the beam yesterday.',
      ],
      correctIndex: 1,
      explanation: 'В утвердительном предложении Past Simple используется 2-я форма глагола find → found.',
    },
    builderTask: {
      targetRu: 'Вчера мы подтвердили вашу запись на пробное занятие.',
      scrambledWords: ['Yesterday', 'we', 'confirmed', 'your', 'enrollment', 'for', 'the', 'trial', 'class'],
      correctSentence: 'Yesterday we confirmed your enrollment for the trial class',
      hint: 'Начните с Yesterday we confirmed...',
    },
  },

  {
    id: 'gram-11',
    title: 'Инфинитив (Infinitive: "to + V1" и голый инфинитив без "to")',
    level: 'A2',
    category: 'Грамматика действий',
    formula: 'Полный: to + [Verb 1] | Голый (Bare): [Verb 1] после let, make, can/must/should',
    explanation: 'Инфинитив — это начальная форма глагола («что делать?»). В английском есть два варианта: с частицей to (полный инфинитив) и без нее (голый инфинитив). С частицей to он используется: (1) чтобы назвать цель — «для того чтобы» (We warm up to prevent injuries); (2) после глаголов намерения и просьбы (want to sign up, try to balance, expect to improve); (3) после прилагательных (convenient to reschedule, happy to welcome, free to ask).',
    keyRule: 'ЗАПОМНИТЕ ИСКЛЮЧЕНИЯ (без частицы to!): после глаголов побуждения let (Let me spot you, Let\'s warm up), make (в значении «заставлять») и модальных глаголов can, must, should, will частица to НИКОГДА не ставится!',
    examples: [
      {
        en: 'We are happy to welcome you and provide safe guidance.',
        ru: 'Мы рады поприветствовать вас (прилагательное + to V1) и обеспечить безопасное сопровождение.',
        highlight: 'happy to welcome',
      },
      {
        en: 'Would you like to sign up for a trial class to test the group?',
        ru: 'Хотели бы вы записаться (глагол + to V1) на пробное занятие, чтобы (цель: to V1) протестировать группу?',
        highlight: 'to sign up ... to test',
      },
      {
        en: 'Let me walk you through our schedule — you can reschedule anytime.',
        ru: 'Позвольте мне ознакомить вас (let + без to!) с расписанием — вы можете перенести (can + без to!) в любое время.',
        highlight: 'walk ... reschedule',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Feel free ask any questions!',
        correct: 'Feel free to ask any questions!',
        why: 'После прилагательных (free, happy, easy, convenient) всегда требуется полный инфинитив с частицей to: free to ask.',
      },
      {
        wrong: 'Let me to spot you on the handstand!',
        correct: 'Let me spot you on the handstand!',
        why: 'После глагола let используется голый инфинитив без частицы to: let + лицо + V1.',
      },
    ],
    quiz: {
      question: 'В каком предложении инфинитив использован абсолютно правильно?',
      options: [
        'We warm up for to improve flexibility.',
        'Let\'s to stretch before the splits!',
        'Parents often want to confirm the schedule before signing up.',
        'She can to do a clean cartwheel now.',
      ],
      correctIndex: 2,
      explanation: 'После глагола want ставится полный инфинитив (want to confirm). После let\'s и can частица to запрещена, а "for to" — грубая ошибка.',
    },
    builderTask: {
      targetRu: 'Не стесняйтесь задавать любые вопросы, чтобы подтвердить расписание.',
      scrambledWords: ['Feel', 'free', 'to', 'ask', 'any', 'questions', 'to', 'confirm', 'the', 'schedule'],
      correctSentence: 'Feel free to ask any questions to confirm the schedule',
      hint: 'Используйте связки free to ask ... to confirm...',
    },
  },

  {
    id: 'gram-1',
    title: 'Повелительное наклонение (Imperatives: Do, Don\'t, No + V-ing)',
    level: 'A2',
    category: 'Команды & Инструкции',
    formula: 'Утверждение: [Verb 1] / Отрицание: Don\'t + [Verb 1] / Строгий запрет: No + [Verb-ing]',
    explanation: 'В спорте и тренировках команды отдаются без местоимения "you". Для строгого запрета в спортивном зале часто используется краткая форма "No + герундий", а для предупреждения — "Don\'t".',
    keyRule: 'Команда начинается сразу с начальной формы глагола (инфинитив без to). Отрицание ВСЕГДА строится через "Don\'t", даже если обращаемся к одному человеку или группе.',
    examples: [
      {
        en: 'Point your toes and lock your arms!',
        ru: 'Натяни носочки и зафиксируй руки!',
        highlight: 'Point ... lock',
      },
      {
        en: 'Don\'t drop your chest!',
        ru: 'Не опускай грудь (не сутулься)!',
        highlight: 'Don\'t drop',
      },
      {
        en: 'No running in the mat area!',
        ru: 'Никакой беготни в зоне матов!',
        highlight: 'No running',
      },
    ],
    commonMistakes: [
      {
        wrong: 'You point your toes!',
        correct: 'Point your toes!',
        why: 'В английских командах местоимение "you" опускается, чтобы фраза звучала как четкая инструкция, а не констатация факта.',
      },
      {
        wrong: 'Not run in the gym!',
        correct: 'Don\'t run in the gym! / No running in the gym!',
        why: 'Отрицание в повелительном наклонении требует вспомогательного глагола "Don\'t", либо конструкции "No + герундий".',
      },
    ],
    quiz: {
      question: 'Как тренер скажет гимнасту: "Не смотри вниз во время стойки"?',
      options: [
        'Not looking down during the handstand!',
        'Don\'t look down during the handstand!',
        'Doesn\'t look down during the handstand!',
        'No look down during the handstand!',
      ],
      correctIndex: 1,
      explanation: 'Отрицательный императив образуется строго через "Don\'t + глагол" (Don\'t look down).',
    },
    builderTask: {
      targetRu: 'Держи ноги прямыми и не сгибай колени!',
      scrambledWords: ['straight', 'legs', 'your', 'and', 'don\'t', 'bend', 'Keep', 'knees'],
      correctSentence: 'Keep your legs straight and don\'t bend knees',
      hint: 'Начните с глагола действия Keep...',
    },
  },

  {
    id: 'gram-2',
    title: 'Конструкция "Make sure + Present Simple" (Убедитесь, что...)',
    level: 'B1',
    category: 'Безопасность & Контроль',
    formula: 'Make sure + [Subject] + [Present Simple Verb]',
    explanation: 'Ключевая конструкция тренера для соблюдения регламентов и безопасности. Важная грамматическая особенность: даже если действие относится к будущему времени (завтра, перед соревнованием), в придаточном предложении после "make sure" используется строго НАСТОЯЩЕЕ время (Present Simple).',
    keyRule: 'После "Make sure" никогда не ставится will! Например: "Make sure he arrives..." (а не "will arrive").',
    examples: [
      {
        en: 'Make sure the mat is fixed properly.',
        ru: 'Убедитесь, что мат надежно закреплен.',
        highlight: 'Make sure ... is fixed',
      },
      {
        en: 'Make sure he arrives 10 minutes prior to class.',
        ru: 'Убедитесь, что он приходит за 10 минут до начала занятия.',
        highlight: 'Make sure he arrives',
      },
      {
        en: 'Make sure you warm up before tumbling.',
        ru: 'Убедитесь, что вы размялись перед акробатикой.',
        highlight: 'Make sure you warm up',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Make sure he will arrive on time.',
        correct: 'Make sure he arrives on time.',
        why: 'В придаточных времени и условия после Make sure используется Present Simple (he arrives), а не Future Simple (will arrive).',
      },
      {
        wrong: 'Do sure the equipment is safe.',
        correct: 'Make sure the equipment is safe.',
        why: 'В английском языке это фиксированная идиома: "Make sure" (не do sure).',
      },
    ],
    quiz: {
      question: 'Выберите правильный вариант: "Убедись, что страховочный мат надежно лежит"',
      options: [
        'Make sure the safety mat will be properly placed',
        'Make sure the safety mat is properly placed',
        'Do sure that safety mat placed properly',
        'Make sure safety mat being placed properly',
      ],
      correctIndex: 1,
      explanation: 'После "Make sure" используется Present Simple: "the safety mat is properly placed".',
    },
    builderTask: {
      targetRu: 'Убедитесь, что он приходит за 10 минут до начала занятия.',
      scrambledWords: ['Make', 'sure', 'he', 'arrives', '10', 'minutes', 'prior', 'to', 'class'],
      correctSentence: 'Make sure he arrives 10 minutes prior to class',
      hint: 'Помните: Make sure + he arrives...',
    },
  },

  {
    id: 'gram-3',
    title: 'Конструкции побуждения: Let\'s & Let me (Совместное действие и страховка)',
    level: 'A2',
    category: 'Командное взаимодействие',
    formula: 'Let\'s + [Verb 1] (давай сделаем) / Let me + [Verb 1] (позволь мне / дай я)',
    explanation: 'В спортивном зале тренер постоянно использует "Let\'s" для вовлечения учеников в общее упражнение ("Let\'s warm up!"), а "Let me" — для предложения личной помощи и профессиональной страховки ("Let me spot you").',
    keyRule: 'После Let\'s и Let me глагол ВСЕГДА идет в инфинитиве БЕЗ частицы "to". Глагол "to spot" в гимнастике означает "страховать ученика руками".',
    examples: [
      {
        en: 'Let\'s warm up together on the gymnastics floor.',
        ru: 'Давайте разомнемся вместе на гимнастическом ковре.',
        highlight: 'Let\'s warm up',
      },
      {
        en: 'Let me spot you on your backward roll.',
        ru: 'Дай я подстрахую тебя на кувырке назад.',
        highlight: 'Let me spot you',
      },
      {
        en: 'Let\'s find your balance first.',
        ru: 'Давай сначала найдем твое равновесие.',
        highlight: 'Let\'s find',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Let\'s to warm up!',
        correct: 'Let\'s warm up!',
        why: 'После конструкции let\'s никогда не используется частица to.',
      },
      {
        wrong: 'Let me to help you with the handstand.',
        correct: 'Let me help you with the handstand.',
        why: 'Глагол let требует голого инфинитива: let me help (без to).',
      },
    ],
    quiz: {
      question: 'Как тренер предложит подстраховать спортсмена на стойке на руках?',
      options: [
        'Let me to spot you on the handstand.',
        'Let me spot you on the handstand.',
        'Let\'s spotting you on the handstand.',
        'Let me to protect you on handstand.',
      ],
      correctIndex: 1,
      explanation: 'Правильная форма: "Let me spot you" (без частицы to, профессиональный глагол spot = страховать).',
    },
    builderTask: {
      targetRu: 'Давай я подстрахую тебя, чтобы ты чувствовал себя в безопасности.',
      scrambledWords: ['Let', 'me', 'spot', 'you', 'so', 'you', 'feel', 'safe'],
      correctSentence: 'Let me spot you so you feel safe',
      hint: 'Начните с Let me spot you...',
    },
  },

  {
    id: 'gram-4',
    title: 'Фразовые глаголы в тренировках (Line up, Warm up, Fill out, Lock out)',
    level: 'B1',
    category: 'Фразовые глаголы',
    formula: '[Verb] + [Preposition / Adverb]: warm up, line up, fill out, lock out',
    explanation: 'Фразовые глаголы — основа живой английской речи тренера. Предлог меняет или усиливает значение глагола: "warm" (теплый) → "warm up" (разминаться); "line" (линия) → "line up" (строиться в шеренгу); "fill" (наполнять) → "fill out" (заполнять бланк / анкету).',
    keyRule: 'Частица "up" часто указывает на завершенность или подъем энергии: warm up (разогреться), line up (выстроиться), jump up (подпрыгнуть).',
    examples: [
      {
        en: 'Line up, please, facing the mirror!',
        ru: 'Строимся, пожалуйста, лицом к зеркалу!',
        highlight: 'Line up',
      },
      {
        en: 'Please, fill out the registration form before class.',
        ru: 'Пожалуйста, заполните регистрационную форму перед занятием.',
        highlight: 'fill out',
      },
      {
        en: 'Lock out your elbows at the top.',
        ru: 'Выпрями до конца (зафиксируй) локти вверху.',
        highlight: 'Lock out',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Please fill in the registration form (in US gym usually fill out).',
        correct: 'Please fill out the registration form.',
        why: 'В американском спортивном английском для документов и бланков стандартно используется "fill out".',
      },
      {
        wrong: 'Stand in line, please (менее естественно для тренера).',
        correct: 'Line up, please!',
        why: '"Line up!" — это четкая, энергичная спортивная команда для построения.',
      },
    ],
    quiz: {
      question: 'Какой фразовый глагол означает "выстроиться в шеренгу / построиться"?',
      options: [
        'Line in',
        'Line up',
        'Line out',
        'Line on',
      ],
      correctIndex: 1,
      explanation: '"Line up" — универсальная команда построения шеренги.',
    },
    builderTask: {
      targetRu: 'Пожалуйста, заполните регистрационную форму перед началом.',
      scrambledWords: ['Please', 'fill', 'out', 'the', 'registration', 'form', 'before', 'starting'],
      correctSentence: 'Please fill out the registration form before starting',
      hint: 'Начните с Please fill out...',
    },
  },

  {
    id: 'gram-5',
    title: 'Описание прогресса (Present Continuous: She is making steady progress)',
    level: 'B1',
    category: 'Времена & Развитие',
    formula: '[Subject] + am/is/are + [Verb-ing] + steady progress',
    explanation: 'Для описания текущих тренировочных тенденций, улучшений и долгосрочного развития используется Present Continuous с устойчивым выражением "to make progress".',
    keyRule: 'КРИТИЧЕСКИ ВАЖНО: со словом progress ВСЕГДА используется глагол MAKE, а не DO! Нельзя сказать "she is doing progress". Правильно: "She is making progress". Слово progress неисчисляемое (без артикля a).',
    examples: [
      {
        en: 'She is making steady progress in her splits.',
        ru: 'Она стабильно прогрессирует в шпагатах.',
        highlight: 'is making steady progress',
      },
      {
        en: 'He is getting much better at balancing.',
        ru: 'Он становится гораздо лучше в удержании баланса.',
        highlight: 'is getting much better',
      },
      {
        en: 'They are working on their handstands this week.',
        ru: 'На этой неделе они работают над стойками на руках.',
        highlight: 'are working on',
      },
    ],
    commonMistakes: [
      {
        wrong: 'She is doing a good progress.',
        correct: 'She is making steady progress.',
        why: 'Коллокация: "make progress" (не do!), и без артикля "a", так как progress неисчисляемое существительное.',
      },
      {
        wrong: 'She makes progress currently.',
        correct: 'She is making progress currently.',
        why: 'Для развивающегося процесса и текущих изменений требуется форма Present Continuous (is making).',
      },
    ],
    quiz: {
      question: 'Как грамматически правильно сказать: "Она стабильно прогрессирует"?',
      options: [
        'She is doing steady progress',
        'She is making a steady progress',
        'She is making steady progress',
        'She does make the steady progress',
      ],
      correctIndex: 2,
      explanation: 'Правильная устойчивая коллокация: "make progress" без артикля a (She is making steady progress).',
    },
    builderTask: {
      targetRu: 'Она стабильно прогрессирует с каждым новым занятием.',
      scrambledWords: ['She', 'is', 'making', 'steady', 'progress', 'with', 'every', 'class'],
      correctSentence: 'She is making steady progress with every class',
      hint: 'Используйте She is making steady progress...',
    },
  },

  {
    id: 'gram-6',
    title: 'Герундий после предлогов: "Thank you for reaching out" & "Look forward to + V-ing"',
    level: 'B1',
    category: 'Общение с клиентами',
    formula: 'for / about / to (в look forward to) + [Verb-ing]',
    explanation: 'В переписке с родителями часто встречаются благодарности и выражения ожидания ("Thank you for reaching out", "We look forward to seeing you"). Если после предлога стоит действие (глагол), оно ВСЕГДА принимает окончание -ing (герундий). Особая ловушка — фразовый глагол "look forward to", где "to" является предлогом, а не частицей инфинитива!',
    keyRule: 'Никогда не пишите "Thank you for reach out" или "Look forward to see you". Правильно: "Thank you for reaching out" и "Look forward to seeing you"!',
    examples: [
      {
        en: 'Thank you for reaching out to us!',
        ru: 'Спасибо, что обратились к нам!',
        highlight: 'for reaching out',
      },
      {
        en: 'We look forward to welcoming your child!',
        ru: 'Мы с нетерпением ждем возможности поприветствовать вашего ребенка!',
        highlight: 'look forward to welcoming',
      },
      {
        en: 'Please ask any questions before signing up.',
        ru: 'Пожалуйста, задавайте любые вопросы перед записью.',
        highlight: 'before signing up',
      },
    ],
    commonMistakes: [
      {
        wrong: 'We look forward to see you at the trial class.',
        correct: 'We look forward to seeing you at the trial class.',
        why: 'В конструкции look forward to слово "to" — это предлог, поэтому следующий за ним глагол обязан иметь окончание -ing.',
      },
      {
        wrong: 'Thank you for reach out to us!',
        correct: 'Thank you for reaching out to us!',
        why: 'После предлога "for" (как и after, before, without) используется герундий (-ing).',
      },
    ],
    quiz: {
      question: 'Как правильно завершить сообщение родителю после записи на пробное занятие?',
      options: [
        'We look forward to see you on Saturday!',
        'We look forward to seeing you on Saturday!',
        'We looking forward see you on Saturday!',
        'We look forward for seeing you on Saturday!',
      ],
      correctIndex: 1,
      explanation: 'После фразового глагола "look forward to" всегда ставится глагол с -ing: "to seeing you".',
    },
    builderTask: {
      targetRu: 'Спасибо, что обратились к нам, мы ждем встречи с вами!',
      scrambledWords: ['Thank', 'you', 'for', 'reaching', 'out,', 'we', 'look', 'forward', 'to', 'seeing', 'you'],
      correctSentence: 'Thank you for reaching out, we look forward to seeing you',
      hint: 'Помните: for reaching out ... look forward to seeing...',
    },
  },

  {
    id: 'gram-7',
    title: 'Деловые обороты с родителями: "Is there...", "Convenient", "Feel free to"',
    level: 'B1',
    category: 'Бизнес-лексика & Этикет',
    formula: 'Is there [a spot / space] available? / Feel free to + [Verb 1] / Let me walk you through...',
    explanation: 'При обсуждении расписания и записи важны три детали: (1) для наличия места используется оборот "Is there..."; (2) о времени и расписании говорят "convenient" (удобный по графику), а не "comfortable" (уютный физически); (3) "Feel free to..." — мягкое, гостеприимное приглашение к действию.',
    keyRule: 'Место в группе: "a spot" (исчисляемое, с артиклем a) или "space" (неисчисляемое, без артикля). Удобное время: "convenient time" (не comfortable time!).',
    examples: [
      {
        en: 'Is there a spot available in the toddler group?',
        ru: 'Есть ли свободное место в группе для малышей?',
        highlight: 'Is there a spot available',
      },
      {
        en: 'Which day is most convenient for your schedule?',
        ru: 'Какой день наиболее удобен для вашего расписания?',
        highlight: 'most convenient',
      },
      {
        en: 'Let me walk you through our monthly package.',
        ru: 'Позвольте подробно ознакомить вас с нашим месячным абонементом.',
        highlight: 'walk you through',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Is Tuesday comfortable for you?',
        correct: 'Is Tuesday convenient for you?',
        why: 'Comfortable относится к физическому комфорту (одежда, стул, мат). Для времени, встреч и расписания используется convenient.',
      },
      {
        wrong: 'Do you have a free place in the group?',
        correct: 'Is there a spot available in the group?',
        why: '"Free place" — калька с русского. В англоязычных студиях говорят "a spot available" или "an open slot".',
      },
    ],
    quiz: {
      question: 'Как естественно спросить родителя: "Какое время наиболее удобно для вас?"',
      options: [
        'What time is most comfortable for you?',
        'What time is most convenient for you?',
        'What time is most cozy for you?',
        'Which hour does fit you comfortable?',
      ],
      correctIndex: 1,
      explanation: 'Для времени и расписания в английском языке используется прилагательное "convenient".',
    },
    builderTask: {
      targetRu: 'Позвольте ознакомить вас с нашим расписанием.',
      scrambledWords: ['Let', 'me', 'walk', 'you', 'through', 'our', 'schedule'],
      correctSentence: 'Let me walk you through our schedule',
      hint: 'Используйте конструкцию Let me walk you through...',
    },
  },
];
