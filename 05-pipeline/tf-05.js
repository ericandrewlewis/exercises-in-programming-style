const fs = require("fs");
// The shared mutable data

// Takes a path to a file and returns the entire
// contents of the file as an array of characters
const readFile = pathToFile => {
  return fs.readFileSync(pathToFile, "utf8").split("");
};

// Replaces all nonalphanumeric chars in data with white space
const filterCharsAndNormalize = data => {
  data = data.slice();
  for (let i = 0; i < data.length; i++) {
    if (data[i].match(/^[a-z0-9]+$/i)) {
      data[i] = data[i].toLowerCase();
    } else {
      data[i] = " ";
    }
  }
  return data;
};

// Scans data for words and return an array of them
const scan = data => {
  return data.join("").split(/[ ]+/);
};

const removeStopWords = words => {
  words = words.slice();
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
  return words;
};

// Creates a list of pairs associating words with frequencies
const frequencies = words => {
  const wordFrequencies = [];
  for (let i = 0; i < words.length; i++) {
    const wordIndex = wordFrequencies.findIndex(freq => freq[0] === words[i]);
    if (wordIndex > -1) {
      wordFrequencies[wordIndex][1] += 1;
    } else {
      wordFrequencies.push([words[i], 1]);
    }
  }
  return wordFrequencies;
};

// Sorts wordFrequencies by frequency
const sort = wordFrequencies => {
  wordFrequencies = wordFrequencies.slice();
  return wordFrequencies.sort((a, b) => {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });
};

// The main function
let data = readFile(process.argv[2]);
data = filterCharsAndNormalize(data);
let words = scan(data);
words = removeStopWords(words);
let wordFrequencies = frequencies(words);
wordFrequencies = sort(wordFrequencies);
for (let i = 0; i < 25; i++) {
  console.log(`${wordFrequencies[i][0]} - ${wordFrequencies[i][1]}`);
}
