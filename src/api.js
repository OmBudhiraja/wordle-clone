export function getRandomWord() {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await fetch('/words.json');
      const data = await res.json();
      const randomWord = data[Math.floor(Math.random() * data.length)];
      resolve(randomWord);
    } catch (err) {
      reject(err);
    }
  });

  return promise;
}

export function checkDictionary(word) {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`/words.json`);
      const data = await res.json();
      const isWord = data.includes(word);
      resolve(isWord);
    } catch (err) {
      reject(err);
    }
  });

  return promise;
}
