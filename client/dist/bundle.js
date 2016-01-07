(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Parent = require('./components/Parent.jsx');

var HomePage = React.createClass({displayName: "HomePage",
  render: function () {
    return (
      React.createElement("div", null, 
        "hello react...", 
        React.createElement(Parent, null)
      )
    );
  }
});

ReactDOM.render(React.createElement(HomePage, null), document.getElementById('main'));

},{"./components/Parent.jsx":3}],2:[function(require,module,exports){
var Child = React.createClass({displayName: "Child",
  render: function(){
    return (
      React.createElement("div", null, " The Child ")
    )
  }
});

module.exports = Child;

},{}],3:[function(require,module,exports){
var Child = require('./Child.jsx');

var Parent = React.createClass({displayName: "Parent",
    render: function(){
        return (
          React.createElement("div", null, 
            React.createElement("div", null, " Hello World "), 
            React.createElement(Child, null)
          )
        )
    }
});

module.exports = Parent;

},{"./Child.jsx":2}]},{},[1]);
