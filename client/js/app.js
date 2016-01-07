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
