const gameLevels = [
    {
        id: 1,
        words: ["آب", "نان"], // water, bread
        wheelLetters: ["ا", "ب", "ن", "م", "ت", "س"]
    },
    {
        id: 2,
        words: ["دست", "پا"], // hand, foot
        wheelLetters: ["د", "س", "ت", "پ", "ا", "ک", "ر"]
    },
    {
        id: 3,
        words: ["خاک", "باد"], // soil, wind
        wheelLetters: ["خ", "ا", "ک", "ب", "د", "ل", "ی"]
    },
    {
        id: 4,
        words: ["شب", "روز"], // night, day
        wheelLetters: ["ش", "ب", "ر", "و", "ز", "گ", "چ"]
    },
    {
        id: 5,
        words: ["کتاب", "درس"], // book, lesson
        wheelLetters: ["ک", "ت", "ا", "ب", "د", "ر", "س", "ق"]
    },
    {
        id: 6,
        words: ["مادر", "پدر"], // mother, father
        wheelLetters: ["م", "ا", "د", "ر", "پ", "ن", "و"]
    },
    {
        id: 7,
        words: ["بازی", "شادی"], // game, happiness
        wheelLetters: ["ب", "ا", "ز", "ی", "ش", "د", "ه", "ط"]
    },
    {
        id: 8,
        words: ["گرما", "سرما"], // heat, cold
        wheelLetters: ["گ", "ر", "م", "ا", "س", "د", "ف", "ع"]
    },
    {
        id: 9,
        words: ["ایران", "تهران"], // Iran, Tehran
        wheelLetters: ["ا", "ی", "ر", "ا", "ن", "ت", "ه", "ز", "ج"] // Note: 'ا' repeated for wheel is fine
    },
    {
        id: 10,
        words: ["بهار", "گل"], // spring, flower
        wheelLetters: ["ب", "ه", "ا", "ر", "گ", "ل", "ص", "ض"]
    }
];

// To make it accessible if game.js and levels.js are treated as separate modules in some environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gameLevels;
}
