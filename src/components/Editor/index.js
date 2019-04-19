import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value } from 'slate';

import { renderNode, renderMark } from './render';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        key: '1111111111',
        nodes: [
          {
            object: 'text',
            key: '222222222',
            leaves: [
              {
                text: 'This is editable '
              },
              {
                text: 'rich',
                marks: [
                  {
                    type: 'bold'
                  }
                ]
              },
              {
                text: ' text, '
              },
              {
                text: 'much',
                marks: [
                  {
                    type: 'italic'
                  }
                ]
              },
              {
                text: ' better than a '
              },
              {
                text: '<textarea>',
                marks: [
                  {
                    type: 'code'
                  }
                ]
              },
              {
                text: '!'
              }
            ]
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text:
                  "Since it's rich text, you can do things like turn a selection of text "
              },
              {
                text: 'bold',
                marks: [
                  {
                    type: 'bold'
                  }
                ]
              },
              {
                text:
                  ', or add a semantically rendered block quote in the middle of the page, like this:'
              }
            ]
          }
        ]
      },
      {
        object: 'block',
        type: 'block-quote',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A wise quote.'
              }
            ]
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'Try it out for yourself!'
              }
            ]
          }
        ]
      }
    ]
  }
});

const plugins = [];

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: initialValue
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
