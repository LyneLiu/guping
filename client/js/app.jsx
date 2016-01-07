var Parent = require('./components/Parent.jsx');

var HomePage = React.createClass({
  render: function () {
    return (
      <div>
        hello react...
        <Parent />
      </div>
    );
  }
});

ReactDOM.render(<HomePage />, document.getElementById('main'));
