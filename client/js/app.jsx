var React = require('react');
var ReactDOM = require('react-dom');

var HomePage = React.createClass({
  render: function () {
    return <div>hello react... </div>;
  }
});

ReactDOM.render(<HomePage />, document.getElementById('main'));
