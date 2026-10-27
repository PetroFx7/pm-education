import {
  mdiCastle, mdiTent, mdiPineTree, mdiBookOpenPageVariant, mdiScriptText, mdiMapLegend,
  mdiTelescope, mdiScaleBalance, mdiShieldAccount, mdiCrown, mdiGlassMugVariant,
  mdiTreasureChest, mdiTowerFire, mdiAnvil, mdiWeatherFog, mdiMagnify, mdiLighthouseOn,
  mdiChessRook, mdiChessKnight, mdiChessQueen, mdiGhost, mdiSpider, mdiBug, mdiSkull,
  mdiSnake, mdiBat, mdiVolcano, mdiMushroom, mdiCloud, mdiFire, mdiEye, mdiFish,
  mdiWizardHat, mdiShieldSword, mdiBowArrow, mdiOwl, mdiCat, mdiUnicorn, mdiNinja, mdiPenguin,
  mdiCrystalBall, mdiCandle, mdiBottleTonicPlus, mdiKeyVariant, mdiRing, mdiCompassRose,
  mdiFeather, mdiMagicStaff, mdiDiamondStone, mdiHexagonMultiple, mdiFountainPen, mdiTimerSand,
  mdiMirror, mdiStarShooting, mdiMedal, mdiTrophy, mdiFlagCheckered, mdiBookOpenVariant,
  mdiLightningBolt, mdiFlash, mdiSwordCross, mdiCampfire, mdiNotebook, mdiCalendarCheck,
  mdiShieldCrown, mdiMapSearch, mdiTrophyVariant, mdiSeal, mdiBrain, mdiStadium, mdiWeatherLightning,
} from '@mdi/js'
import type { Achievement, Artifact, Avatar, HeroClass, ModuleMeta, Rarity, Region, Reward, SkillId } from '../domain/types'

// Три класи персонажа = три групи PM-навичок
export const CLASSES: Record<SkillId, HeroClass> = {
  planner: {
    id: 'planner',
    name: 'Планувальник',
    tagline: 'Майстер карт, графіків та оцінок',
    icon: mdiChessRook,
    color: '#B47A9A',
    perk: '+20% досвіду в локаціях планування',
  },
  strategist: {
    id: 'strategist',
    name: 'Стратег',
    tagline: 'Бачить ризики, цінність і гроші наперед',
    icon: mdiChessQueen,
    color: '#D8A7C0',
    perk: '+20% досвіду в стратегічних локаціях',
  },
  communicator: {
    id: 'communicator',
    name: 'Комунікатор',
    tagline: 'Згуртовує команди і приборкує стейкхолдерів',
    icon: mdiChessKnight,
    color: '#9C6F9A',
    perk: '+20% досвіду в локаціях про людей',
  },
}

export const AVATARS: Avatar[] = [
  { id: 'wizard', icon: mdiWizardHat, name: 'Чарівник' },
  { id: 'knight', icon: mdiShieldSword, name: 'Лицар' },
  { id: 'ranger', icon: mdiBowArrow, name: 'Слідопит' },
  { id: 'owl', icon: mdiOwl, name: 'Мудра Сова' },
  { id: 'cat', icon: mdiCat, name: 'Кіт-бард' },
  { id: 'unicorn', icon: mdiUnicorn, name: 'Єдиноріг' },
  { id: 'ninja', icon: mdiNinja, name: 'Тінь' },
  { id: 'penguin', icon: mdiPenguin, name: 'Пінгвін-мандрівник' },
]

export const REGIONS: Region[] = [
  { id: 1, name: 'Світанкова Долина', desc: 'Тут починається кожна пригода', modules: [1, 2] },
  { id: 2, name: 'Ліс Методологій', desc: 'Стежки Waterfall, Agile, Scrum і Kanban', modules: [3] },
  { id: 3, name: 'Королівство Сувоїв', desc: 'Документи, договори, вимоги', modules: [4, 5] },
  { id: 4, name: 'Картографічні Пагорби', desc: 'Плани, оцінки, пріоритети', modules: [6, 7, 8] },
  { id: 5, name: 'Землі Гільдій', desc: 'Команда, стейкхолдери, люди', modules: [9, 10, 11] },
  { id: 6, name: 'Золоті Копальні', desc: 'Контракти й бюджети', modules: [12] },
  { id: 7, name: 'Варта Порядку', desc: 'Контроль і якість', modules: [13, 14] },
  { id: 8, name: 'Тіньові Болота', desc: 'Ризики і першопричини', modules: [15, 16] },
  { id: 9, name: 'Берег Завершення', desc: 'Останній маяк подорожі', modules: [17] },
  { id: 10, name: 'Арена Практики', desc: 'Справжні робочі ситуації: конфлікти, клієнти, кризи', modules: [18] },
]

// Мета кожного модуля: назва локації, іконка, навичка і бос
export const MODULE_META: Record<number, ModuleMeta> = {
  1: { location: 'Цитадель Основ', icon: mdiCastle, skill: 'planner', boss: { name: 'Голем Трикутника', icon: mdiSkull } },
  2: { location: 'Ярмарок Гільдій', icon: mdiTent, skill: 'strategist', boss: { name: 'Туманний Посередник', icon: mdiCloud } },
  3: { location: 'Ліс Методологій', icon: mdiPineTree, skill: 'strategist', boss: { name: 'Водоспадний Хаос', icon: mdiSnake } },
  4: { location: 'Бібліотека Сувоїв', icon: mdiBookOpenPageVariant, skill: 'planner', boss: { name: 'Пожирач Документів', icon: mdiGhost } },
  5: { location: 'Скрипторій Вимог', icon: mdiScriptText, skill: 'planner', boss: { name: 'Химера Нечітких Вимог', icon: mdiSpider } },
  6: { location: 'Вежа Картографа', icon: mdiMapLegend, skill: 'planner', boss: { name: 'Гідра Декомпозиції', icon: mdiSnake } },
  7: { location: 'Обсерваторія Оцінок', icon: mdiTelescope, skill: 'planner', boss: { name: 'Оракул Хибних Оцінок', icon: mdiEye } },
  8: { location: 'Ринок Цінностей', icon: mdiScaleBalance, skill: 'strategist', boss: { name: 'Жадібний Беклог', icon: mdiMushroom } },
  9: { location: 'Казарми Гільдії', icon: mdiShieldAccount, skill: 'communicator', boss: { name: 'Шторм Такмана', icon: mdiFlash } },
  10: { location: 'Тронна Зала Радників', icon: mdiCrown, skill: 'communicator', boss: { name: 'Забутий Стейкхолдер', icon: mdiGhost } },
  11: { location: 'Таверна Розмов', icon: mdiGlassMugVariant, skill: 'communicator', boss: { name: 'Привид Конфлікту', icon: mdiBat } },
  12: { location: 'Золота Скарбниця', icon: mdiTreasureChest, skill: 'strategist', boss: { name: 'Лихвар Перевитрат', icon: mdiSkull } },
  13: { location: 'Вежа Спостерігача', icon: mdiTowerFire, skill: 'planner', boss: { name: 'Дракон Scope Creep', icon: mdiFire } },
  14: { location: 'Кузня Якості', icon: mdiAnvil, skill: 'planner', boss: { name: 'Королева Багів', icon: mdiBug } },
  15: { location: 'Тіньові Болота', icon: mdiWeatherFog, skill: 'strategist', boss: { name: 'Відьма Невизначеності', icon: mdiCrystalBall } },
  16: { location: 'Печера Першопричин', icon: mdiMagnify, skill: 'strategist', boss: { name: 'Риб’ячий Скелет', icon: mdiFish } },
  17: { location: 'Маяк Завершення', icon: mdiLighthouseOn, skill: 'communicator', boss: { name: 'Вартовий Порогу', icon: mdiVolcano } },
  18: { location: 'Арена Випробувань', icon: mdiStadium, skill: 'communicator', boss: { name: 'Буря Понеділка', icon: mdiWeatherLightning } },
}

export const REWARDS: Record<'lesson' | 'reflection' | 'bossPerAnswer' | 'bossPerfect', Reward> = {
  lesson: { xp: 20, gold: 5 },
  reflection: { xp: 30, gold: 10 },
  bossPerAnswer: { xp: 12, gold: 3 },
  bossPerfect: { xp: 50, gold: 25 },
}

export const RARITY: Record<Rarity, { name: string; color: string }> = {
  common: { name: 'Звичайний', color: '#C9B6C0' },
  rare: { name: 'Рідкісний', color: '#B47A9A' },
  epic: { name: 'Епічний', color: '#E3A6FF' },
  legendary: { name: 'Легендарний', color: '#FFD6A5' },
}

// Артефакти, що випадають зі скринь
export const ARTIFACTS: Artifact[] = [
  { id: 'candle', name: 'Свічка Нічного Дедлайну', icon: mdiCandle, rarity: 'common', lore: 'Горить, доки є незакриті задачі.' },
  { id: 'feather', name: 'Перо Протоколу', icon: mdiFeather, rarity: 'common', lore: 'Само записує домовленості зустрічі.' },
  { id: 'tonic', name: 'Еліксир Daily Scrum', icon: mdiBottleTonicPlus, rarity: 'common', lore: '15 хвилин бадьорості. Не більше.' },
  { id: 'timer', name: 'Пісочний Годинник Таймбоксу', icon: mdiTimerSand, rarity: 'common', lore: 'Пісок ніколи не сиплеться довше спринту.' },
  { id: 'pen', name: 'Ручка Підписаного SOW', icon: mdiFountainPen, rarity: 'rare', lore: 'Її чорнило робить обсяг незмінним.' },
  { id: 'compass', name: 'Компас Roadmap', icon: mdiCompassRose, rarity: 'rare', lore: 'Завжди вказує на Product Goal.' },
  { id: 'key', name: 'Ключ Definition of Done', icon: mdiKeyVariant, rarity: 'rare', lore: 'Відмикає лише по-справжньому готові інкременти.' },
  { id: 'mirror', name: 'Дзеркало Ретроспективи', icon: mdiMirror, rarity: 'rare', lore: 'Показує, що піти краще наступного разу.' },
  { id: 'honeycomb', name: 'Соти WBS', icon: mdiHexagonMultiple, rarity: 'rare', lore: 'Кожна комірка — робочий пакет.' },
  { id: 'ring', name: 'Перстень RACI', icon: mdiRing, rarity: 'epic', lore: 'Лише один Accountable може його носити.' },
  { id: 'orb', name: 'Сфера EVM', icon: mdiCrystalBall, rarity: 'epic', lore: 'Бачить CPI і SPI крізь туман звітів.' },
  { id: 'staff', name: 'Посох Пріоритизації', icon: mdiMagicStaff, rarity: 'epic', lore: 'Одним помахом розділяє Must і Won’t.' },
  { id: 'diamond', name: 'Діамант MVP', icon: mdiDiamondStone, rarity: 'legendary', lore: 'Мінімальний, але неймовірно цінний.' },
  { id: 'star', name: 'Падаюча Зірка Релізу', icon: mdiStarShooting, rarity: 'legendary', lore: 'Загадай Go — і реліз відбудеться.' },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-quest', name: 'Перший крок', desc: 'Завершити перший квест', icon: mdiFlagCheckered },
  { id: 'scholar', name: 'Книжник', desc: 'Завершити 25 квестів', icon: mdiBookOpenVariant },
  { id: 'sage', name: 'Мудрець Гільдії', desc: 'Завершити всі квести курсу', icon: mdiBrain },
  { id: 'first-boss', name: 'Переможець', desc: 'Здолати першого боса', icon: mdiSwordCross },
  { id: 'flawless', name: 'Бездоганно', desc: 'Здолати боса без жодної помилки', icon: mdiLightningBolt },
  { id: 'journal', name: 'Літописець', desc: 'Записати 3 рефлексії в журнал', icon: mdiNotebook },
  { id: 'chest', name: 'Шукач скарбів', desc: 'Відкрити першу скриню', icon: mdiTreasureChest },
  { id: 'collector', name: 'Колекціонер', desc: 'Зібрати 7 різних артефактів', icon: mdiMedal },
  { id: 'region', name: 'Володар Регіону', desc: 'Повністю пройти будь-який регіон', icon: mdiShieldCrown },
  { id: 'streak-3', name: 'Вогнище не гасне', desc: 'Навчатися 3 дні поспіль', icon: mdiCampfire },
  { id: 'streak-7', name: 'Тиждень пригод', desc: 'Навчатися 7 днів поспіль', icon: mdiCalendarCheck },
  { id: 'explorer', name: 'Дослідник', desc: 'Відвідати 9 різних локацій', icon: mdiMapSearch },
  { id: 'level-5', name: 'Ватажок', desc: 'Досягти 5 рівня', icon: mdiTrophy },
  { id: 'legend', name: 'Легенда', desc: 'Здолати всіх босів', icon: mdiTrophyVariant },
  { id: 'glossary', name: 'Знавець Кодексу', desc: 'Вивчити 15 термінів у Кодексі', icon: mdiSeal },
]
