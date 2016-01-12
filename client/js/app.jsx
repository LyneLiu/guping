var $ = require('cli-jquery');
var React = require('react');
var ReactDOM = require('react-dom');
// var Parent = require('./components/Parent.jsx');
var Button = require('antd/lib/button');
var Table = require('antd/lib/table');
var Icon = require('antd/lib/icon');
var Row = require('antd/lib/row');
var Col = require('antd/lib/col');
var Form = require('antd/lib/form');
var Input = require('antd/lib/input');
var Checkbox = require('antd/lib/checkbox');
var message = require('antd/lib/message');
var Modal = require('antd/lib/modal');
var FormItem = Form.Item;
var confirm = Modal.confirm;


var Formd = React.createClass({

  getInitialState: function() {
    return {
        code: undefined,
        author: undefined,
    };
  },
  handleChange: function (name, e) {
    var change = {};
    change[name] = e.target.value;
    this.setState(change);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log('12893448hureqwioru3');
    console.log(this.state.code);
    console.log(this.state.author);


    /* 传入后端 */
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:3000/add',
      data: {
        code: this.state.code,
        author: this.state.author
      },
      success: function (res) {
        if (res.status == 0) {
          console.log('should reload from server'); //#TODO
        } else {
          console.log('eeee....');
        }
      }
    });

    message.success('收到表单值~~~ ：' + JSON.stringify(this.state.code, function(k, v) {
      if (typeof v === 'undefined') {
        return '';
      }
      return v;
    }));
  },

  render: function(){
    return (
      <div>
        <Form inline onSubmit={this.handleSubmit}>
          <FormItem
            id="code"
            label="股票代码：">
            <Input placeholder="请输入股票代码" id="code" name="code" onChange={this.handleChange.bind(this, 'code')} value={this.state.code} />
          </FormItem>
          <FormItem
            id="author"
            label="推荐人：">
            <Input placeholder="请输入推荐人" id="author" name="author" onChange={this.handleChange.bind(this, 'author')} value={this.state.author} />
          </FormItem>
          <Button type="primary" htmlType="submit">添加</Button>
        </Form>
      </div>
    );
  }
});

var Tabled = React.createClass({
  loadCommentsFromServer: function() {
    var that = this;

    $.ajax({
      type: 'GET',
      url: this.props.url,
      success: function (result) {
         console.log(result);
         that.setState({data: result.result});
      }
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  getInitialState: function () {
    function sellCode(code, author, startDate) {
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/sell',
        data: {
          code: code,
          author: author,
          startDate: startDate
        },
        success: function (res) {
          if (res.status == 0) {
            console.log('sell ok'); //#TODO
          } else {
            console.log('eeee....');
          }
        }
      });
    }
    function showConfirm(record){
      confirm({
        title: '您是否确认要删除这项内容',
        content: '股票代码：' + record.code + ' 推荐人：' + record.author,
        onOk: function() {
          console.log('确定');
          sellCode(record.code, record.author, record.startDate);
        },
        onCancel: function() {}
      });
    }
    function renderAction(text, record) {
      // console.log(record.code);
      // console.log(record.author);
      if (record.ifsell) {
        return <span>已卖出</span>;
      } else {
        return <Button onClick={showConfirm.bind(null, record)}>卖出</Button>;
      }

    }
    var columns = [
      {title: '编号', dataIndex: 'key', key: 'key'},
      {title: '代码', dataIndex: 'code', key: 'code'},
      {title: '股票名称', dataIndex: 'name', key: 'name'},
      {title: '推荐人', dataIndex: 'author', key: 'author'},
      {title: '推荐日期', dataIndex: 'startDate', key: 'startDate'},
      {title: '入手价', dataIndex: 'codePriceStart', key: 'codePriceStart'},
      {title: '当前价', dataIndex: 'codePriceEnd', key: 'codePriceEnd'},
      {title: '涨幅', dataIndex: 'code_up_string', key: 'code_up_string'},
      {title: '相对涨幅', dataIndex: 'relative_up', key: 'relative_up'},
      {title: '持股天数', dataIndex: 'hold_days', key: 'hold_days'},
      {title: '操作', dataIndex: '', key: 'x', render: renderAction}
    ];
    var data = [];

    return {columns: columns, data: data};
  },
  render: function () {
    return (
      <div>
        <Table columns={this.state.columns} dataSource={this.state.data} className="table" bordered />
      </div>
    );
  }
});


var HomePage = React.createClass({
  render: function () {
    return (
      <div>
        <Row>
          <Col span="12" offset="6">
            <Formd />
            <Tabled url="http://127.0.0.1:3000/getData" pollInterval={3000}/>
          </Col>
        </Row>
      </div>
    );
  }
});

ReactDOM.render(<HomePage url="http://127.0.0.1:3000/getData" pollInterval={3000} />, document.getElementById('main'));
