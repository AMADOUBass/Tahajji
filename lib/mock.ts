/**
 * Données mock typées comme la future base Supabase.
 * Sert à construire toute l'UI avant l'intégration backend.
 * Curriculum inspiré de la Qaïda Nourania (alphabet → syllabes).
 *
 * ⚠️ Provisoire : remplacé par des requêtes Supabase à l'étape d'intégration.
 * Aucune valeur audio réelle ici (audioUrl = null) — l'UI gère l'absence d'audio.
 */
import type {
  Level,
  Lesson,
  LessonItem,
  Profile,
  ProgressStatus,
  QuizQuestion,
  Surah,
  UserProgress,
  Verse,
} from '@/types/models';

export const mockProfile: Profile = {
  id: 'mock-user',
  displayName: 'Yacine',
  locale: 'fr',
  currentLevel: 1,
  xp: 340,
  streakCount: 5,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  isPremium: false,
};

export const mockLevels: Level[] = [
  { id: 1, position: 1, title: "Les lettres de l'alphabet", description: 'Reconnais et nomme les 28 lettres dans leur forme isolée.', isPremium: false },
  { id: 2, position: 2, title: 'Les lettres connectées', description: 'Les formes début, milieu et fin de mot.', isPremium: false },
  { id: 3, position: 3, title: 'Les voyelles courtes', description: 'Fatha, kasra, damma et les premières syllabes.', isPremium: false },
  { id: 4, position: 4, title: 'Voyelles longues & règles', description: 'Soukoun, chadda, tanwîn et voyelles longues.', isPremium: true },
];

// Leçons du niveau 1 (paires de lettres, façon maquette « chapitres »).
export const mockLessons: Lesson[] = [
  { id: 1, levelId: 1, position: 1, title: 'Alif & Bā', lessonType: 'learn', isPremium: false },
  { id: 2, levelId: 1, position: 2, title: 'Tā & Thā', lessonType: 'learn', isPremium: false },
  { id: 3, levelId: 1, position: 3, title: 'Jīm & Ḥā', lessonType: 'learn', isPremium: false },
  { id: 4, levelId: 1, position: 4, title: 'Dāl & Rā', lessonType: 'learn', isPremium: false },
  { id: 5, levelId: 1, position: 5, title: 'Révision — Unité 1', lessonType: 'exam', isPremium: false },
  // Niveau 2
  { id: 6, levelId: 2, position: 1, title: 'Début de mot', lessonType: 'learn', isPremium: false },
  { id: 7, levelId: 2, position: 2, title: 'Milieu & fin', lessonType: 'learn', isPremium: false },
  { id: 8, levelId: 2, position: 3, title: 'Mots simples', lessonType: 'practice', isPremium: false },
  // Niveau 3
  { id: 9, levelId: 3, position: 1, title: 'La fatha', lessonType: 'learn', isPremium: false },
  { id: 10, levelId: 3, position: 2, title: 'Kasra & damma', lessonType: 'learn', isPremium: false },
  // Niveau 4 (premium)
  { id: 11, levelId: 4, position: 1, title: 'Le soukoun', lessonType: 'learn', isPremium: true },
  { id: 12, levelId: 4, position: 2, title: 'La chadda', lessonType: 'learn', isPremium: true },
];

// Items des leçons (lettres + variantes vocalisées).
export const mockLessonItems: LessonItem[] = [
  // Leçon 1 — Alif & Bā
  { id: 1, lessonId: 1, position: 1, itemType: 'letter', arabicText: 'ا', transliteration: 'Alif', translationFr: 'la 1ʳᵉ lettre', audioUrl: null },
  { id: 2, lessonId: 1, position: 2, itemType: 'letter', arabicText: 'بـ', transliteration: 'Bā', translationFr: 'la 2ᵉ lettre — se prononce « b »', audioUrl: null },
  // Leçon 2 — Tā & Thā
  { id: 3, lessonId: 2, position: 1, itemType: 'letter', arabicText: 'تـ', transliteration: 'Tā', translationFr: 'se prononce « t »', audioUrl: null },
  { id: 4, lessonId: 2, position: 2, itemType: 'letter', arabicText: 'ثـ', transliteration: 'Thā', translationFr: 'se prononce « th » (anglais « think »)', audioUrl: null },
  // Leçon 3 — Jīm & Ḥā
  { id: 5, lessonId: 3, position: 1, itemType: 'letter', arabicText: 'جـ', transliteration: 'Jīm', translationFr: 'se prononce « dj »', audioUrl: null },
  { id: 6, lessonId: 3, position: 2, itemType: 'letter', arabicText: 'حـ', transliteration: 'Ḥā', translationFr: 'se prononce « h » expiré', audioUrl: null },
  // Leçon 4 — Dāl & Rā
  { id: 7, lessonId: 4, position: 1, itemType: 'letter', arabicText: 'د', transliteration: 'Dāl', translationFr: 'se prononce « d »', audioUrl: null },
  { id: 8, lessonId: 4, position: 2, itemType: 'letter', arabicText: 'ر', transliteration: 'Rā', translationFr: 'se prononce « r » roulé', audioUrl: null },
];

// Quiz (un par leçon « learn »).
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 1, lessonId: 1, position: 1, questionType: 'recognize_letter',
    prompt: 'Quelle lettre se prononce « Bā » ?', arabicText: null, audioUrl: null,
    correctAnswer: 'بـ', options: ['تـ', 'بـ', 'نـ', 'ثـ'],
  },
  {
    id: 2, lessonId: 1, position: 2, questionType: 'recognize_letter',
    prompt: 'Quelle est la première lettre de l\'alphabet ?', arabicText: null, audioUrl: null,
    correctAnswer: 'ا', options: ['ر', 'د', 'ا', 'بـ'],
  },
  {
    id: 3, lessonId: 2, position: 1, questionType: 'recognize_letter',
    prompt: 'Quelle lettre se prononce « Thā » ?', arabicText: null, audioUrl: null,
    correctAnswer: 'ثـ', options: ['تـ', 'ثـ', 'بـ', 'نـ'],
  },
];

// Sourates (Al-Fatiha + début + fin du Coran, échantillon du Juz 'Amma).
export const mockSurahs: Surah[] = [
  { id: 1, number: 1, nameAr: 'الفاتحة', nameFr: "L'Ouverture", revelationType: 'meccan', verseCount: 7 },
  { id: 2, number: 2, nameAr: 'البقرة', nameFr: 'La Vache', revelationType: 'medinan', verseCount: 286 },
  { id: 3, number: 3, nameAr: 'آل عمران', nameFr: "La Famille d'Imran", revelationType: 'medinan', verseCount: 200 },
  { id: 112, number: 112, nameAr: 'الإخلاص', nameFr: 'Le Monothéisme pur', revelationType: 'meccan', verseCount: 4 },
  { id: 113, number: 113, nameAr: 'الفلق', nameFr: "L'Aube naissante", revelationType: 'meccan', verseCount: 5 },
  { id: 114, number: 114, nameAr: 'الناس', nameFr: 'Les Hommes', revelationType: 'meccan', verseCount: 6 },
];

export const mockVerses: Verse[] = [
  // Al-Fatiha (sourate 1)
  { id: 1, surahId: 1, number: 1, arabicText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', translationFr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.", translationEn: null, audioUrl: null },
  { id: 2, surahId: 1, number: 2, arabicText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', translationFr: "Louange à Allah, Seigneur de l'univers.", translationEn: null, audioUrl: null },
  { id: 3, surahId: 1, number: 3, arabicText: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', translationFr: 'Le Tout Miséricordieux, le Très Miséricordieux.', translationEn: null, audioUrl: null },
  { id: 4, surahId: 1, number: 4, arabicText: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', translationFr: 'Maître du Jour de la rétribution.', translationEn: null, audioUrl: null },
  { id: 5, surahId: 1, number: 5, arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translationFr: "C'est Toi que nous adorons, et c'est Toi dont nous implorons secours.", translationEn: null, audioUrl: null },
  { id: 6, surahId: 1, number: 6, arabicText: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', translationFr: 'Guide-nous dans le droit chemin.', translationEn: null, audioUrl: null },
  { id: 7, surahId: 1, number: 7, arabicText: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', translationFr: 'Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.', translationEn: null, audioUrl: null },
  // Al-Ikhlas (sourate 112)
  { id: 8, surahId: 112, number: 1, arabicText: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translationFr: 'Dis : « Il est Allah, Unique.', translationEn: null, audioUrl: null },
  { id: 9, surahId: 112, number: 2, arabicText: 'ٱللَّهُ ٱلصَّمَدُ', translationFr: 'Allah, Le Seul à être imploré pour ce que nous désirons.', translationEn: null, audioUrl: null },
  { id: 10, surahId: 112, number: 3, arabicText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translationFr: "Il n'a jamais engendré, n'a pas été engendré non plus.", translationEn: null, audioUrl: null },
  { id: 11, surahId: 112, number: 4, arabicText: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', translationFr: "Et nul n'est égal à Lui. »", translationEn: null, audioUrl: null },
];

// Progression mock : niveau 1 entamé (1 & 2 terminés, 3 en cours, reste verrouillé).
const progressByLesson: Record<number, { status: ProgressStatus; stars: number }> = {
  1: { status: 'completed', stars: 3 },
  2: { status: 'completed', stars: 2 },
  3: { status: 'in_progress', stars: 0 },
};

export const mockProgress: UserProgress[] = mockLessons.map((lesson) => {
  const p = progressByLesson[lesson.id];
  return {
    lessonId: lesson.id,
    status: p?.status ?? 'locked',
    stars: p?.stars ?? 0,
    completedAt: p?.status === 'completed' ? new Date().toISOString() : null,
  };
});
