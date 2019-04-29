import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value } from 'slate';

import renderNode from './renderer/renderNode';
import renderMark from './renderer/renderMark';

import initialValue from './value.json';

const plugins = [];

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: Value.fromJSON(initialValue)
    };
  }

  handleChange = ({ value }) => {
    console.log(value);
    this.setState({ value });
  };

  handleKeyDown = (event, editor, next) => {
    if (!event.ctrlKey) return next();

    switch (event.key) {
      case 'b': {
        event.preventDefault();
        editor.toggleMark('bold');
        break;
      }
      case '`': {
        const isCode = editor.value.blocks.some(block => block.type === 'code');
        event.preventDefault();
        editor.setBlocks(isCode ? 'paragraph' : 'code');
        break;
      }
      default: {
        return next();
      }
    }
  };

  render() {
    return (
      <SlateEditor
        plugins={plugins}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        renderNode={renderNode}
        renderMark={renderMark}
      />
    );
  }
}

export default Editor;
