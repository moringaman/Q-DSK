export default () => {
  var letterArr = ['a', 'F', 'S', 'H', 'n', 'K', 'i', 'P', 'U', 'T', 'Y', 'q', 'X', 'V', 'L', 'R', 'O', 'Z', 'b', 'z', 'C']
  var uid = ''
  for (var i = 0; i < 10; i++) {
    uid = uid + letterArr[Math.floor(Math.random() * (20 - 1 + 1) + 1)]
  }
  return uid
}
