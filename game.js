// Kaboom initialization (assuming it's at the top)
kaboom({
    global: true,
    canvas: document.getElementById("gameCanvas"),
    width: 390,
    height: 844,
    scale: 1,
    background: [220, 220, 220],
    touchToMouse: true,
});

// --- Game Configuration & Assets (constants remain the same) ---
const GAME_FONT = 'Vazirmatn'; // Define the font globally

const TILE_SIZE = 60;
const GRID_START_X = width() / 2;
const GRID_START_Y = 100;
const WORD_SPACING = TILE_SIZE * 1.5;

const WHEEL_CENTER_X = width() / 2;
const WHEEL_CENTER_Y = height() - 200;
const WHEEL_RADIUS = 100;
const LETTER_BUTTON_SIZE = 50;
const SUBMIT_BUTTON_WIDTH = 120;
const SUBMIT_BUTTON_HEIGHT = 50;

// --- Game State Variables ---
let currentLevelIndex = 0;
let currentLevelData = null;
let foundWords = []; // Words found in the current level (strings)

// References to UI elements
let activeLetterButtons = [];
let activeGridCells = []; // Stores the Kaboom objects for grid cells
let currentSelectionText = null;

// --- Grid Variables & Functions ---
function drawWordSlots(words) {
    activeGridCells.forEach(cellGroupContainer => {
        cellGroupContainer.bg.forEach(destroy); // Destroy background cells
        cellGroupContainer.letters.forEach(destroy); // Destroy letter texts
    });
    activeGridCells = [];
    let currentY = GRID_START_Y;

    words.forEach((word, wordIdx) => {
        const wordLength = word.length;
        const totalWordWidth = wordLength * TILE_SIZE;
        let currentX = GRID_START_X - totalWordWidth / 2;

        let cellBgGroup = []; // Store cell background objects
        let letterTextGroup = []; // Store letter text objects

        for (let i = 0; i < wordLength; i++) {
            const cellBg = add([
                rect(TILE_SIZE * 0.9, TILE_SIZE * 0.9, { radius: 5 }),
                pos(currentX + (TILE_SIZE * i), currentY),
                outline(2, color(100, 100, 100)),
                anchor("topleft"),
                {
                    originalChar: word[i], // Store the original character for this cell
                    isRevealed: false, // Tracks if this specific cell is showing a letter
                    id: `cell-${wordIdx}-${i}`
                },
                "gridCellBg" // Tag for background cells
            ]);
            cellBgGroup.push(cellBg);
        }
        // Store the group of cell BGs and an empty array for letter text objects
        activeGridCells.push({ bg: cellBgGroup, letters: letterTextGroup });
        currentY += WORD_SPACING;
    });
}

// Modified to handle the new activeGridCells structure
function revealLetterInGrid(wordStr, wordIndexInLevel) {
    const wordChars = wordStr.split('');
    if (activeGridCells[wordIndexInLevel]) {
        const cellGroupContainer = activeGridCells[wordIndexInLevel];

        cellGroupContainer.letters.forEach(destroy);
        cellGroupContainer.letters = [];

        wordChars.forEach((char, charIndex) => {
            if (cellGroupContainer.bg[charIndex]) {
                const cellBg = cellGroupContainer.bg[charIndex];
                cellBg.isRevealed = true;

                const letterText = add([
                    text(char, { size: TILE_SIZE * 0.6, font: GAME_FONT }), // Use GAME_FONT
                    pos(cellBg.pos.x + (TILE_SIZE * 0.9) / 2, cellBg.pos.y + (TILE_SIZE * 0.9) / 2),
                    anchor("center"),
                    color(0,0,0),
                    "revealedLetter"
                ]);
                cellGroupContainer.letters.push(letterText);
            }
        });
    }
}


// --- Letter Wheel Variables & Functions (mostly same) ---
let selectedLetters = [];

function drawLetterWheel(letters) {
    activeLetterButtons.forEach(destroy);
    activeLetterButtons = [];
    const angleStep = (2 * Math.PI) / letters.length;
    letters.forEach((letter, i) => {
        const angle = i * angleStep - (Math.PI / 2);
        const x = WHEEL_CENTER_X + WHEEL_RADIUS * Math.cos(angle);
        const y = WHEEL_CENTER_Y + WHEEL_RADIUS * Math.sin(angle);
        const letterButton = add([
            rect(LETTER_BUTTON_SIZE, LETTER_BUTTON_SIZE, { radius: LETTER_BUTTON_SIZE / 2 }),
            pos(x, y), anchor("center"),
            outline(2, color(50, 50, 50)),
            { char: letter }, area(), color(255, 255, 255),
            "letterButton"
        ]);
        letterButton.add([
            text(letter, { size: LETTER_BUTTON_SIZE * 0.6, font: GAME_FONT }), // Use GAME_FONT
            anchor("center"), color(0, 0, 0)
        ]);
        letterButton.onClick(() => handleLetterSelection(letterButton));
        activeLetterButtons.push(letterButton);
    });
}

function handleLetterSelection(letterObj) {
    selectedLetters.push(letterObj.char);
    updateCurrentSelectionDisplay();
}

function updateCurrentSelectionDisplay() {
    if (currentSelectionText) { destroy(currentSelectionText); }
    currentSelectionText = add([
        text(selectedLetters.join(""), { size: 30, font: GAME_FONT, align: "center" }), // Use GAME_FONT
        pos(WHEEL_CENTER_X, WHEEL_CENTER_Y - WHEEL_RADIUS - 40),
        anchor("center"), color(0,0,0),
        "currentSelectionDisplay"
    ]);
}

function clearSelection() {
    selectedLetters = [];
    updateCurrentSelectionDisplay();
}

function submitWord() {
    const submittedWordStr = selectedLetters.join("");
    if (submittedWordStr.length === 0) {
        return;
    }

    const wordIndexInLevel = currentLevelData.words.indexOf(submittedWordStr);

    if (wordIndexInLevel !== -1) {
        if (!foundWords.includes(submittedWordStr)) {
            foundWords.push(submittedWordStr);
            revealLetterInGrid(submittedWordStr, wordIndexInLevel);

            if (foundWords.length === currentLevelData.words.length) {
                wait(1.5, () => {
                     loadLevel(currentLevelIndex + 1);
                });
            }
        } else {
            // Word already found - visual feedback can be added here
        }
    } else {
        // Incorrect word - visual feedback can be added here
    }

    clearSelection();
}

// --- Level Management ---
function cleanupOldLevelUI() {
    every("gridCellBg", destroy);
    every("revealedLetter", destroy);
    every("letterButton", destroy);
    every("currentSelectionDisplay", destroy);
    every("completionMessage", destroy);

    activeGridCells = [];
    activeLetterButtons = [];

    if (currentSelectionText) {
        destroy(currentSelectionText);
        currentSelectionText = null;
    }
}

function loadLevel(levelIdx) {
    cleanupOldLevelUI();

    if (levelIdx >= gameLevels.length) {
        add([
            text("آفرین! همه مراحل تمام شد", {size: 28, font: GAME_FONT, align: "center", width: width() * 0.8}), // Use GAME_FONT
            pos(width()/2, height()/2),
            anchor("center"),
            "completionMessage"
        ]);
        return;
    }

    currentLevelIndex = levelIdx;
    currentLevelData = gameLevels[currentLevelIndex];
    foundWords = [];

    drawWordSlots(currentLevelData.words);
    drawLetterWheel(currentLevelData.wheelLetters);

    selectedLetters = [];
    updateCurrentSelectionDisplay();

    console.log(`Level ${currentLevelData.id} loaded. Words: ${currentLevelData.words.join(', ')}`);
}

// --- Main Scene ---
scene("main", () => {
    add([
        text("بازی پازل کلمات", { size: 30, font: GAME_FONT, align: "center" }), // Use GAME_FONT
        pos(width() / 2, 30),
        anchor("center")
    ]);

    loadLevel(currentLevelIndex);

    const clearBtn = add([
        rect(SUBMIT_BUTTON_WIDTH, SUBMIT_BUTTON_HEIGHT, { radius: 5 }),
        pos(WHEEL_CENTER_X - SUBMIT_BUTTON_WIDTH / 2 - 10, WHEEL_CENTER_Y + WHEEL_RADIUS + 70),
        anchor("center"), color(255, 100, 100), area(), "clearButton"
    ]);
    clearBtn.add([ text("پاک کردن", { size: 20, font: GAME_FONT }), anchor("center"), color(255,255,255) ]); // Use GAME_FONT
    clearBtn.onClick(clearSelection);

    const submitBtn = add([
        rect(SUBMIT_BUTTON_WIDTH, SUBMIT_BUTTON_HEIGHT, { radius: 5 }),
        pos(WHEEL_CENTER_X + SUBMIT_BUTTON_WIDTH / 2 + 10, WHEEL_CENTER_Y + WHEEL_RADIUS + 70),
        anchor("center"), color(100, 200, 100), area(), "submitButton"
    ]);
    submitBtn.add([ text("ثبت", { size: 24, font: GAME_FONT }), anchor("center"), color(255,255,255) ]); // Use GAME_FONT
    submitBtn.onClick(submitWord);
});

go("main");

console.log("Kaboom.js initialized. Vazirmatn font integration attempted.");
