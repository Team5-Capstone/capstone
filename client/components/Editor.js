import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import axios from 'axios';

const turnOffCtrlS = () => {
  document.addEventListener('keydown', (e) => {
    const pressedS = e.key === 's';
    const pressedCtrl = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;

    if (pressedS && pressedCtrl) {
      e.preventDefault();
    }
  });
};

const exampleTestCode = `
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
`;

export const Editor = () => {
  const editor = useRef();
  const [code, setCode] = useState(exampleTestCode);
  const [response, setResponse] = useState('See your results here!');

  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString());
  });

  const fetchData = () => {
    axios
      .post('/api/tests', {
        code,
      })
      .then((res) => {
        setResponse(res.data);
      });
  };

  const onSubmit = () => {
    fetchData();
  };

  useEffect(() => {
    turnOffCtrlS();

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
      <div style={{ whiteSpace: 'pre-wrap' }}>{response}</div>
    </div>
  );
};
