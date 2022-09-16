/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */

import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import axios from 'axios';

export const Editor = () => {
  const editor = useRef();
  const [code, setCode] = useState('');

  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString());
  });

  const onSubmit = () => {
    console.log(code);
    axios
      .post('/api/tests', {
        code,
      })
      .then((res) => console.log(res));
  };

  useEffect(() => {
    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        oneDark,
        javascript(),
        onUpdate,
      ],
    });

    const view = new EditorView({ state, parent: editor.current });

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div>
      <div>
        Write a test that tests whether a function console.logs "Hello, World!".
      </div>
      <div ref={editor}></div>
      <button onClick={onSubmit}>Submit Your Test!</button>
    </div>
  );
};
