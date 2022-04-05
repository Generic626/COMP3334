module.exports = function concatHash(input) {
  return (
    input[0] +
    process.env.KEY_HASH_1 +
    input[1] +
    process.env.KEY_HASH_2 +
    input[2]
    
  );
};
