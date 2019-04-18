import React, { Component } from 'react';
import { Editor as SlateEditor } from 'slate-react';
import { Value } from 'slate';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        key: '123456',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.'
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

  render() {
    return <SlateEditor value={this.state.value} onChange={this.onChange} />;
  }
}

export default Editor;
