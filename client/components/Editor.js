import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
// import readOnlyRangesExtension from 'codemirror-readonly-ranges';
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

export const Editor = (props) => {
  const editor = useRef();
  const editor2 = useRef();
  const [code, setCode] = useState('');
  const [response, setResponse] = useState('See your results here!');
  const { prompts } = props;

  const templateTest = prompts[0]?.templateTest;
  const narrative = prompts[0]?.narrative;

  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString());
  });

  // const getReadOnlyRanges = (editor) => {
  // console.log(editor.doc.line);
  // return [
  //   {
  //     from: undefined, //same as targetState.doc.line(0).from or 0
  //     to: editor.doc.line(2).to,
  //   },
  //   {
  //     from: editor.doc.line(4).from, //same as targetState.doc.line(0).from or 0
  //     to: editor.doc.line(5).to,
  //   },
  //   {
  //     from: editor.doc.line(editor.doc.lines).from,
  //     to: undefined, // same as targetState.doc.line(targetState.doc.lines).to
  //   },
  // ];
  // };
  // const removeIndentation =() => {
  //   const cm = editor2.instance;
  //   cm.execCommand('delLineLeft');
  // }

  useEffect(() => {
    turnOffCtrlS();

    const state = EditorState.create({
      doc: narrative,
      extensions: [
        basicSetup,
        oneDark,
        onUpdate,
        javascript(),
        // removeIndentation(),
        // readOnlyRangesExtension(getReadOnlyRanges),
      ],
    });

    const view2 = new EditorView({
      state,
      parent: editor2.current,
    });

    const fetchStuff = async () => {
      await props.fetchPrompts();
    };
    fetchStuff();

    return () => {
      view2.destroy();
    };
  }, [narrative]);

  const fetchData = () => {
    axios.post('/api/tests', { code }).then((res) => setResponse(res.data));
  };
  fetchStuff();

  const onSubmit = () => fetchData();

  // const templateTest = prompts[0]?.templateTest;

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
        // readOnlyRangesExtension(getReadOnlyRanges),
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
      .get('/api/tests/results', { code })
      .then((res) => setResponse(res.data));
  };

  return (
    <div className='p-5'>
      <div ref={editor2}></div>
      <div className='p-5 font-bold'>{prompts[0]?.prompt}</div>
      <div ref={editor}></div>
      <button className='m-5 bg-gray-400 p-1' onClick={onSubmit}>
        Evaluate Your Test
      </button>
      <button className='m-5 bg-gray-400 p-1' onClick={runTest}>
        Submit Your Test
      </button>
      <div
        className='p-5'
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
