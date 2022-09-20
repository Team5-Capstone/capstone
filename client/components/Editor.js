import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import readOnlyRangesExtension from 'codemirror-readonly-ranges';
import axios from 'axios';
import { fetchPrompts } from '../store/prompts';
import { connect } from 'react-redux';

const turnOffCtrlS = () => {
  document.addEventListener('keydown', (e) => {
    const pressedS = e.key === 's';
    const pressedCtrl = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;

    if (pressedS && pressedCtrl) {
      e.preventDefault();
    }
  });
};

const Editor = (props) => {
  const editor = useRef();
  const [code, setCode] = useState(exampleTestCode);
  const [response, setResponse] = useState('See your results here!');
  const { prompts } = props;
  console.log('prompts', prompts);

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


  const templateTest = prompts[0]?.templateTest;

  const getReadOnlyRanges = (editor) => {
    console.log(editor.doc.line);
    return [
      {
        from: undefined, //same as targetState.doc.line(0).from or 0
        to: editor.doc.line(2).to,
      },
      {
        from: editor.doc.line(4).from, //same as targetState.doc.line(0).from or 0
        to: editor.doc.line(5).to,
      },
      {
        from: editor.doc.line(editor.doc.lines).from,
        to: undefined, // same as targetState.doc.line(targetState.doc.lines).to
      },
    ];
  };


  useEffect(() => {
    turnOffCtrlS();

    const state = EditorState.create({
      doc: code || templateTest,

      extensions: [
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        oneDark,
        javascript(),
        onUpdate,
        readOnlyRangesExtension(getReadOnlyRanges),
      ],
    });

    const view = new EditorView({
      state,
      parent: editor.current,
    });

    const fetchStuff = async () => {
      await props.fetchPrompts();
    };
    fetchStuff();

    return () => {
      view.destroy();
    };
  }, [templateTest]);

  const runTest = () => {
    axios
      .get('/api/tests/results', {
        code,
      })
      .then((res) => {
        setResponse(res.data);
      });
  };

  return (
    <div className='p-5'>
      <div className='p-5 font-bold'>
     {prompts[0]?.prompt}      </div>
      <div ref={editor}></div>
      <button onClick={onSubmit}>Submit Your Test!</button>
      <button onClick={runTest}>Run Test</button>
      <div
        style={{
          whiteSpace: 'pre-wrap',
        }}>
        {response}
      </div>
    </div>
  );
};

const mapStateToProps = ({ prompts }) => {
  return {
    prompts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPrompts: () => dispatch(fetchPrompts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
