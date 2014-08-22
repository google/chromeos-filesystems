var url = 'http://localhost:9000/build.html';

module.exports = {
  'Page title is correct': function(test) {
    test.open(url).assert.title().is('mountHeader', 'It has title').done();
  },

  'Bucket placeholder is correct': function(test) {
    test.open(url)
      .query('#bucket').assert.attr('placeholder', 'bucketName')
      .done();
  }
};
