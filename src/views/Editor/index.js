import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value } from 'slate';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
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

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: initialValue
    };

    this.onChange = ({ value }) => {
      this.setState({ value });
    };
  }

  onKeyDown(event, editor, next) {
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
  }

  renderNode(props, editor, next) {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  }

  renderMark(props, editor, next) {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  }

  render() {
    return (
      <SlateEditor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    );
  }
}

export default Editor;
