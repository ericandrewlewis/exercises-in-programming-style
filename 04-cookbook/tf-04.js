const fs = require("fs");
// The shared mutable data
let data = [];
let words = [];
const wordFreqs = [];

// Takes a path to a file and assigns the entire
// contents of the file to the global variable data
const readFile = pathToFile => {
  data = fs.readFileSync(pathToFile, "utf8").split("");
};

// Replaces all nonalphanumeric chars in data with white space
const filterCharsAndNormalize = () => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].match(/^[a-z0-9]+$/i)) {
      data[i] = data[i].toLowerCase();
    } else {
      data[i] = " ";
    }
  }
};

// Scans data for words, filling the global variable words
const scan = () => {
  words = data.join("").split(/[ ]+/);
};

const removeStopWords = () => {
  let stopWords = fs.readFileSync("../stop_words.txt", "utf8").split(",");
  stopWords = stopWords.concat("abcdefghijklmnopqrstuvwxyz".split(""));
  let indexesToRemove = [];
  for (let i = 0; i < words.length; i++) {
    if (stopWords.includes(words[i])) {
      indexesToRemove.push(i);
    }
  }
  for (let i = indexesToRemove.length - 1; i >= 0; i--) {
    words.splice(indexesToRemove[i], 1);
  }
};

// Creates a list of pairs associating words with frequencies
const frequencies = () => {
  for (let i = 0; i < words.length; i++) {
    const wordIndex = wordFreqs.findIndex(freq => freq[0] === words[i]);
    if (wordIndex > -1) {
      wordFreqs[wordIndex][1] += 1;
    } else {
      wordFreqs.push([words[i], 1]);
    }
  }
};

// Sorts wordFreqs by frequency
const sort = () => {
  wordFreqs.sort((a, b) => {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });
};

// The main function
readFile(process.argv[2]);
filterCharsAndNormalize();
scan();
removeStopWords();
frequencies();
sort();
for (let i = 0; i < 25; i++) {
  console.log(`${wordFreqs[i][0]} - ${wordFreqs[i][1]}`);
}
