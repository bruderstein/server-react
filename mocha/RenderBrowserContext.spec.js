
var Domino = require('domino');
// Create window and document globals to fool react to thinking it's in a browser
global.window = Domino.createWindow('');
global.document = global.window.document;
global.navigator = {
  userAgent: 'domino'
};

var React = require('../build/npm-react/react');
var Chai = require('chai');
var Sinon = require('sinon');
var expect = Chai.expect;


// Inject Server side react root index generator
var ReactInjection = require('../build/npm-react/lib/ReactInjection');
var ServerReactRootIndex = require('../build/npm-react/lib/ServerReactRootIndex');
var ReactMarkupChecksum = require('../build/npm-react/lib/ReactMarkupChecksum');

ReactInjection.RootIndex.injectCreateReactRootIndex(
  ServerReactRootIndex.createReactRootIndex
);

var store = {
  register: function (callback) {
    this._callback = callback;
  },

  change: function (payload) {
    this._callback && this._callback(payload);
  }
};

var Sample = React.createClass({
  displayName: 'Sample',

  getInitialState: function () {
    return {
      list: []
    }
  },

  componentWillMount: function () {
    store.register(this.callback);
  },

  render: function () {
    return React.createElement('div', { }, this.state.list.map(function (item) {
      return React.createElement('span', { key: item}, item);
    }) );
  },


  callback: function (list) {
    this.setState({
      list: list
    });
  }
});

describe('render with browser context', function () {
  var window, container;
  Sinon.spy(global.document, 'createElement');

  beforeEach(function () {
    window = Domino.createWindow('');
    container = window.document.createElement('div');

    Sinon.spy(window.document, 'createElement');
  });

  it('renders to a domino doc', function (done) {

    React.inServerContext(window.document, function (react) {

      react.render(React.createElement('div', { className: 'test'}, React.createElement('span', {}, 'hello')), container, function () {

        try {
          expect(container.innerHTML).to.match(/<div class="test" data-reactid="\.([a-z0-9]{1,12})"><span data-reactid="\.\1\.0">hello<\/span><\/div>/);
          expect(global.document.createElement.callCount).to.equal(0);
          done();

        } catch (e) {
          done(e);
        }

      });
    });
  });

  it('renders a custom component to a domino doc', function (done) {
      var element = React.createElement(Sample, {});

      React.inServerContext(window.document, function (react) {
        react.render(element, container, function () {
          try {
            expect(container.innerHTML).to.match(/<div data-reactid="\.([a-z0-9]{1,12})"><\/div>/);
            store.change(['cheese', 'steve']);
            react.performUpdates();

            expect(container.innerHTML).to.match(/<div data-reactid="\.([a-z0-9]{1,12})"><span data-reactid="\.\1.\$cheese">cheese<\/span><span data-reactid="\.\1.\$steve">steve<\/span><\/div>/);
            done();
          } catch (e) {
            done(e);
          }

        });
      });
  });

});

