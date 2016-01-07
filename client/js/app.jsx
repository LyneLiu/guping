var Parent = require('./components/Parent.jsx');
var Button = require('antd/lib/button');
import { DatePicker } from 'antd';

var HomePage = React.createClass({
  render: function () {
    return (
      <div>
        hello react...
        <Parent />
        <Button type="primary">主按钮</Button>
        <hr />
        <DatePicker />
      </div>
    );
  }
});

ReactDOM.render(<HomePage />, document.getElementById('main'));
