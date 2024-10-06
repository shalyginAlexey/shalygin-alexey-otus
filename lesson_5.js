const fs = require("fs");
const { Transform, pipeline } = require("stream");
const path = require("path");

const inputFilePath = process.argv[2];

const outputFilePath = path.join(__dirname, "output.txt");

if (!inputFilePath) {
  process.exit(1);
}

const splitWords = new Transform({
  readableObjectMode: true,
  transform(chunk, encoding, callback) {
    const words = chunk.toString().split(/\s+/);
    words.forEach((word) => this.push(word));
    callback();
  },
});

const filterNonText = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(word, encoding, callback) {
    if (typeof word === "string" && word.trim() !== "") {
      const filteredWord = word.replace(/[^\w]/g, "");
      if (filteredWord) {
        this.push(filteredWord);
      }
    }
    callback();
  },
});

const indexWords = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(word, encoding, callback) {
    if (!this.wordCount) {
      this.wordCount = {};
    }
    if (!this.wordCount[word]) {
      this.wordCount[word] = 0;
    }
    this.wordCount[word]++;
    callback();
  },
  flush(callback) {
    if (!this.wordCount) {
      this.wordCount = {};
    }
    const sortedWords = Object.keys(this.wordCount).sort();
    const vector = sortedWords.map((word) => this.wordCount[word]);
    this.push(JSON.stringify(vector));
    callback();
  },
});

const readStream = fs.createReadStream(inputFilePath, { encoding: "utf8" });
const writeStream = fs.createWriteStream(outputFilePath);

pipeline(
  readStream,
  splitWords,
  filterNonText,
  indexWords,
  writeStream,
  (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
  }
);

// Команда для запуска node lesson_5.js input.txt
