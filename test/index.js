describe('nodeshop', function () {
  // describing the test
  it('should understand the mathematical principals', function (done) {
    if (5 == 5) {
      done()
    } else {
      done(new Error('this is not what we wanted'))
    }
  })
})
