module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/admin-console'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true,
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--headless', '--no-sandbox']
      }
    },
    // Add Xvfb settings
    browsers: ['ChromeCustom'],
    customLaunchers: {
      ChromeCustom: {
        base: 'ChromeHeadless',
        flags: ['--disable-gpu', '--no-sandbox', '--remote-debugging-port=9222']
      }
    },
    singleRun: true
  });
};
