export default (rgb) => {
  var result = ''
for (var v in rgb) {
    if( rgb.hasOwnProperty(v) ) {
      result += rgb[v] + ",";
    }
  }
 result = result.slice(0, 11)
return '(' + result + ')'

// TODO Check for correct rgb value to continue of start again

}
