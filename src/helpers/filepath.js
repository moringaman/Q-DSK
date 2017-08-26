export default {
  computed: {
    filePath: () => {
      var path = this.imageURI.split('/')
      path.pop()
      path = path.join('/')
      return path
    }
  }
}
