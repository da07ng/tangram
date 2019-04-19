import React, { Component } from 'react';

import Editor from '../../components/Editor';

class Page extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div id="editor">
        <Editor />
      </div>
    );
  }
}

export default Page;
