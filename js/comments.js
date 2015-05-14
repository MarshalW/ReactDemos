// 测试flux和React是否能装上
var React = require('react');
var Dispatcher = require('flux').Dispatcher;
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher=new Dispatcher();

var CommentStore=assign({}, EventEmitter.prototype, {
	items:[
		{
			title:'不错，超级满意',
			content:'样子漂亮，买之前还在担心有什么问题，是我多想了，很实用，很好'
		},
		{
			title:'还不错',
			content:'送人的礼物，很满意的购物'
		}
	]
});

AppDispatcher.register(function(payload){
	switch( payload.eventName ) {
	    case 'new-item':
	    	CommentStore.items.push( payload.newItem );
	    	CommentStore.emit('change');
	      	break;
  	}
  	return true;
});

var CommentBox=React.createClass({
	getInitialState: function() {
		var self=this;
		CommentStore.on('change',function(){
			self.setState(CommentStore.items);
		});
		return {data:CommentStore.items};
	},
	render:function(){
		return (
			<div className="commentBox">
				<h1>iPad mini 3的评论</h1>
				<CommentList data={this.state.data}/>
				<hr />
				<CommentForm />
			</div>
		);
	}
});

var CommentList=React.createClass({
	render:function(){
		var commentNodes=this.props.data.map(
			function(comment){
				return (
					<div>
						<h3>{comment.title}</h3>
						<div>{comment.content}</div>
					</div>
				);
			}
		);

		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var title = this.refs.title.getDOMNode().value.trim();
		var content = this.refs.content.getDOMNode().value.trim();
		if (!title || !content) {
			return;
		}
		// this.props.onCommentSubmit({title: title, content: content});
		this.refs.title.getDOMNode().value = '';
		this.refs.content.getDOMNode().value = '';

		AppDispatcher.dispatch({
			eventName: 'new-item',
			newItem:{title: title, content: content}
		});
		return;
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="title" ref="title" /><br/>
				<input type="text" placeholder="content..." ref="content" /><br/>
				<input type="submit" value="提交" />
			</form>
		);
	}
});

React.render(
	<CommentBox />,
	document.getElementById('content')
);