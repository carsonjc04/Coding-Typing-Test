let startTime;
let timer;
let elapsedTime = 0;
let correctChars = 0;
let totalChars = 0;

const snippetContainer = document.getElementById('code-snippet');
const userInputElement = document.getElementById('user-input');
const accuracyElement = document.getElementById('accuracy');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const completedMessageElement = document.getElementById('completed-message');
const submitButton = document.getElementById('submit-button');
const difficultySelect = document.getElementById('difficulty');
const languageSelect = document.getElementById('language');

const snippets = {
  python: {
    easy: ["print('Hello, world!')"],
    medium: ["for i in range(1, 11):\n    print(i ** 2)"],
    hard: ["def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[0]\n    less = [x for x in arr[1:] if x <= pivot]\n    greater = [x for x in arr[1:] if x > pivot]\n    return quicksort(less) + [pivot] + quicksort(greater)"]
  },
  cpp: {
    easy: ["#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, world!\" << endl;\n    return 0;\n}"],
    medium: ["for (int i = 1; i <= 10; ++i) {\n    cout << i * i << endl;\n}"],
    hard: ["class Node {\npublic:\n    int value;\n    Node* next;\n    Node(int val) : value(val), next(nullptr) {}\n};"]
  },
  javascript: {
    easy: ["console.log('Hello, world!');"],
    medium: ["for (let i = 1; i <= 10; i++) {\n    console.log(i ** 2);\n}"],
    hard: ["function quicksort(arr) {\n    if (arr.length <= 1) return arr;\n    const pivot = arr[0];\n    const less = arr.slice(1).filter(x => x <= pivot);\n    const greater = arr.slice(1).filter(x => x > pivot);\n    return [...quicksort(less), pivot, ...quicksort(greater)];\n}"]
  }
};

let currentSnippet = "";

// Function to update the displayed snippet and reset stats
function loadSnippet() {
  const difficulty = difficultySelect.value;
  const language = languageSelect.value;

  // Check if both language and difficulty are selected
  if (!snippets[language] || !snippets[language][difficulty]) {
    snippetContainer.textContent = "No snippet available for the selected options.";
    return;
  }

  // Randomly select a snippet
  currentSnippet = snippets[language][difficulty][Math.floor(Math.random() * snippets[language][difficulty].length)];
  snippetContainer.textContent = currentSnippet;

  // Reset the input field and stats
  userInputElement.value = "";
  accuracyElement.textContent = "0%";
  timerElement.textContent = "0";
  wpmElement.textContent = "0";
  completedMessageElement.textContent = "";

  clearInterval(timer);
  startTime = null;
  elapsedTime = 0;
  correctChars = 0;
  totalChars = 0;
}

// Event listener for user input to track progress
userInputElement.addEventListener('input', () => {
  if (!startTime) {
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
  }

  const userInput = userInputElement.value;
  correctChars = 0;
  totalChars = userInput.length;

  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === currentSnippet[i]) correctChars++;
  }

  const accuracy = Math.floor((correctChars / totalChars) * 100) || 0;
  accuracyElement.textContent = `${accuracy}%`;

  const timeInMinutes = elapsedTime / 60;
  const wordsTyped = totalChars / 5;
  const wpm = Math.round(wordsTyped / timeInMinutes) || 0;
  wpmElement.textContent = wpm;
});

// Tab key handling for indentation
userInputElement.addEventListener('keydown', (event) => {
  if (event.key === "Tab") {
    event.preventDefault(); // Prevent default tab behavior

    const input = userInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    // Insert 4 spaces for a tab
    const tabSpaces = "    ";
    input.value = input.value.substring(0, start) + tabSpaces + input.value.substring(end);

    // Move the cursor after the inserted spaces
    input.selectionStart = input.selectionEnd = start + tabSpaces.length;
  }
});

// Timer function
function updateTimer() {
  elapsedTime = Math.floor((new Date() - startTime) / 1000);
  timerElement.textContent = elapsedTime;
}

// Submit button event listener
submitButton.addEventListener('click', () => {
  clearInterval(timer);

  const accuracy = Math.floor((correctChars / totalChars) * 100) || 0;
  const timeInMinutes = elapsedTime / 60;
  const wordsTyped = totalChars / 5;
  const wpm = Math.round(wordsTyped / timeInMinutes) || 0;

  completedMessageElement.textContent = `Congratulations! You completed the snippet with ${accuracy}% accuracy and ${wpm} WPM in ${elapsedTime} seconds.`;
  userInputElement.disabled = true;
});

// Event listeners for language and difficulty selection
difficultySelect.addEventListener('change', loadSnippet);
languageSelect.addEventListener('change', loadSnippet);

// Initial snippet load
loadSnippet();
