const randomWords = require('random-words');
// console.log(generateRandomWords(3));

module.exports = function generateRandomWords (numOfWords){
    return randomWords (numOfWords);
}
