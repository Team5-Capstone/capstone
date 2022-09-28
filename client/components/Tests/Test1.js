import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { StateField, StateEffect } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { Decoration } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import readOnlyRangesExtension from 'codemirror-readonly-ranges';
import axios from 'axios';
import { fetchPrompts } from '../../store/prompts';
import { autocompletion } from '@codemirror/autocomplete';
import { connect } from 'react-redux';
const { v4: uuidv4 } = require('uuid');

const turnOffCtrlS = () => {
  document.addEventListener('keydown', (e) => {
    const pressedS = e.key === 's';
    const pressedCtrl = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;

    if (pressedS && pressedCtrl) {
      e.preventDefault();
    }
  });
};

let baseTheme = EditorView.theme({
  '.cm-content *': {
    color: 'white',
    whiteSpace: 'normal',
    fontSize: '16px',
    lineHeight: '1.1',
    overflowWrap: 'anywhere',
  },
});

export const Editor = (props) => {
  const editor = useRef();
  const editor2 = useRef();
  const [code, setCode] = useState('');
  const [code2, setCode2] = useState('');
  const [id, setId] = useState(uuidv4());
  const [passedTest, setPassedTest] = useState('false');
  const [response, setResponse] = useState('See your results here!');
  const { prompts } = props;

  const templateTest = prompts[0]?.templateTest;
  const narrative = prompts[0]?.narrative;
  const completions = [
    { label: 'toBe', type: 'keyword' },
    { label: 'expect', type: 'keyword' },
    { label: 'test', type: 'keyWord' },
    { label: 'describe', type: 'keyword' },
  ];

  // const removeIndentation =() => {
  //   const cm = editor2.instance;
  //   cm.execCommand('delLineLeft');
  // }

  function myCompletions(context) {
    let before = context.matchBefore(/\w+/);
    if (!context.explicit && !before) return null;
    return {
      from: before ? before.from : context.pos,
      options: completions,
      validFor: /^\w*$/,
    };
  }

  // Instructions editor

  const onUpdate2 = EditorView.updateListener.of((v) => {
    setCode2(v.state.doc.toString());
  });

  const getReadOnlyRanges2 = (editor2) => {
    return [
      {
        from: undefined,
        to: editor2.doc.line(0).to,
      },
      {
        from: editor2.doc.line(1).from,
        to: editor2.doc.line(100).to,
      },
      {
        from: editor2.doc.line(editor2.doc.lines).from,
        to: undefined,
      },
    ];
  };

  useEffect(() => {
    turnOffCtrlS();
    const addMarks = StateEffect.define();
    const filterMarks = StateEffect.define();

    const markField = StateField.define({
      create() {
        return Decoration.none;
      },
      update(value, tr) {
        value = value.map(tr.changes);
        for (let effect of tr.effects) {
          if (effect.is(addMarks))
            value = value.update({ add: effect.value, sort: true });
          else if (effect.is(filterMarks))
            value = value.update({ filter: effect.value });
        }
        return value;
      },
      provide: (f) => EditorView.decorations.from(f),
    });

    const state = EditorState.create({
      doc: narrative || code2,
      extensions: [
        basicSetup,
        oneDark,
        baseTheme,
        markField,
        onUpdate2,
        javascript(),
        // removeIndentation(),
        readOnlyRangesExtension(getReadOnlyRanges2),
      ],
    });

    const view2 = new EditorView({
      state,
      parent: editor2.current,
      lineWrapping: true,
    });
    const strikeMark = Decoration.mark({
      attributes: { style: 'color: white' },
    });

    view2.dispatch({
      effects: addMarks.of([strikeMark.range(33, 1000)]),
    });

    const fetchStuff = async () => {
      await props.fetchPrompts();
    };
    fetchStuff();

    return () => {
      view2.destroy();
    };
  }, [narrative]);

  // Template Test editor

  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString());
  });

  const getReadOnlyRanges = (editor) => {
    return [
      {
        from: editor.doc.line(1).from,
        to: editor.doc.line(2).to,
      },
      {
        from: editor.doc.line(4).from,
        to: editor.doc.line(5).to,
      },
    ];
  };

  useEffect(() => {
    const addMarks = StateEffect.define();
    const filterMarks = StateEffect.define();

    const markField = StateField.define({
      create() {
        return Decoration.none;
      },
      update(value, tr) {
        value = value.map(tr.changes);
        for (let effect of tr.effects) {
          if (effect.is(addMarks))
            value = value.update({ add: effect.value, sort: true });
          else if (effect.is(filterMarks))
            value = value.update({ filter: effect.value });
        }
        return value;
      },
      provide: (f) => EditorView.decorations.from(f),
    });

    turnOffCtrlS();
    const state = EditorState.create({
      doc: code || templateTest,

      extensions: [
        basicSetup,
        EditorState.tabSize.of(16),
        keymap.of([defaultKeymap, indentWithTab]),
        oneDark,
        markField,
        javascript(),
        onUpdate,
        readOnlyRangesExtension(getReadOnlyRanges),
        autocompletion({ override: [myCompletions] }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editor.current,
      lineWrapping: true,
    });
    const strikeMark = Decoration.mark({
      attributes: { style: 'background: #1d4ed8' },
    });
    view.dispatch({
      effects: addMarks.of([
        strikeMark.range(109, 122),
        strikeMark.range(131, 144),
      ]),
    });

    const fetchStuff = async () => {
      await props.fetchPrompts();
    };
    fetchStuff();

    return () => {
      view.destroy();
    };
  }, [templateTest]);

  const fetchData = () => {
    axios
      .post('/api/jestTests/jest1', {
        code,
      })
      .then((res) => {
        setResponse(res.data);
        if (
          res.data.includes('That looks right! Go ahead and submit your test!')
        ) {
          setPassedTest('true');
        }
      });
  };

  const onSubmit = () => {
    fetchData();
  };

  const runTest = () => {
    if (passedTest === 'true') {
      setId(uuidv4());
      axios
        .post('/api/jestTests/jest1/results', {
          code,
          id,
          passedTest,
        })
        .then((res) => {
          setPassedTest('false');
          setResponse(res.data);
        });
    } else {
      setResponse('Get the test to pass before you submit!');
    }
  };

  return (
    <div className='flex w-full grow flex-col bg-slate-900'>
      <div className='flex h-4/6 w-full'>
        <div
          id='left-column'
          className='flex w-1/2 flex-col overflow-hidden border-r border-slate-700'>
          <div className='flex gap-3 border-b border-slate-700 py-4 px-8 text-slate-400'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <rect width='16' height='16' fill='' />
              <path
                d='M2 10V11H3.793L1 13.793L1.707 14.5L4.5 11.707V13.5H5.5V10H2Z'
                fill='#a3e635'
              />
              <path d='M13 5H9.5V6H13V5Z' fill='#a3e635' />
              <path d='M13 7.5H9.5V8.5H13V7.5Z' fill='#a3e635' />
              <path d='M13 10H9.5V11H13V10Z' fill='#a3e635' />
              <path
                d='M14 2.5H2C1.73486 2.50026 1.48066 2.60571 1.29319 2.79319C1.10571 2.98066 1.00026 3.23486 1 3.5V8.5H2V3.5H7.5V13.5H14C14.2651 13.4997 14.5193 13.3943 14.7068 13.2068C14.8943 13.0193 14.9997 12.7651 15 12.5V3.5C14.9997 3.23486 14.8943 2.98066 14.7068 2.79319C14.5193 2.60571 14.2651 2.50026 14 2.5ZM8.5 12.5V3.5H14L14.0007 12.5H8.5Z'
                fill='#a3e635'
              />
            </svg>
            Instructions
          </div>
          <div
            id='instructions'
            className='bg-[#090e1a]'
            style={{ height: '100%' }}
            ref={editor2}></div>
        </div>

        <div id='right-column' className='flex h-full w-1/2 flex-col'>
          <div id='prompt-container' className='overflow-hidden'>
            <div className='flex gap-3 border-b border-slate-700 bg-slate-900 py-4 px-8 text-slate-400'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <rect width='16' height='16' fill='none' />
                <path d='M11 11.5H6.99995V12.5H11V11.5Z' fill='#a3e635' />
                <path
                  d='M5.99995 11.5H4.99995V12.5H5.99995V11.5Z'
                  fill='#a3e635'
                />
                <path d='M11 9H6.99995V10H11V9Z' fill='#a3e635' />
                <path d='M5.99995 9H4.99995V10H5.99995V9Z' fill='#a3e635' />
                <path d='M11 6.5H6.99995V7.5H11V6.5Z' fill='#a3e635' />
                <path
                  d='M5.99995 6.5H4.99995V7.5H5.99995V6.5Z'
                  fill='#a3e635'
                />
                <path
                  d='M12.5 2.5H11V2C11 1.73478 10.8946 1.48043 10.7071 1.29289C10.5196 1.10536 10.2652 1 10 1H6C5.73478 1 5.48043 1.10536 5.29289 1.29289C5.10536 1.48043 5 1.73478 5 2V2.5H3.5C3.23478 2.5 2.98043 2.60536 2.79289 2.79289C2.60536 2.98043 2.5 3.23478 2.5 3.5V14C2.5 14.2652 2.60536 14.5196 2.79289 14.7071C2.98043 14.8946 3.23478 15 3.5 15H12.5C12.7652 15 13.0196 14.8946 13.2071 14.7071C13.3946 14.5196 13.5 14.2652 13.5 14V3.5C13.5 3.23478 13.3946 2.98043 13.2071 2.79289C13.0196 2.60536 12.7652 2.5 12.5 2.5ZM6 2H10V4H6V2ZM12.5 14H3.5V3.5H5V5H11V3.5H12.5V14Z'
                  fill='#a3e635'
                />
              </svg>
              Prompt
            </div>
            <div id='prompt' className='bg-slate-800 px-8 py-4'>
              <div className='max-w-[800px]'>{prompts[0]?.prompt}</div>
            </div>
          </div>
          <div
            id='your-code-container'
            className='flex grow flex-col overflow-hidden'>
            <div className='flex gap-3 border-y border-slate-700 bg-slate-900 py-4 px-8 text-slate-400'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <rect width='16' height='16' fill='none' />
                <path
                  d='M15.5 7.99953L12 11.4995L11.295 10.7945L14.085 7.99953L11.295 5.20453L12 4.49953L15.5 7.99953Z'
                  fill='#a3e635'
                />
                <path
                  d='M0.5 7.99953L4 4.49953L4.705 5.20453L1.915 7.99953L4.705 10.7945L4 11.4995L0.5 7.99953Z'
                  fill='#a3e635'
                />
                <path
                  d='M8.81944 3L6.20925 12.7414L7.17518 13.0002L9.78537 3.25882L8.81944 3Z'
                  fill='#a3e635'
                />
              </svg>
              Your Code
            </div>

            <div id='editor' className='grow bg-[#090e1a]' ref={editor}></div>

            <div
              id='button-container'
              className='flex gap-4 border-t border-slate-700 bg-slate-900 p-6'>
              <button
                className='rounded-lg border border-lime-400 px-4 py-2 text-lime-400'
                onClick={onSubmit}>
                Evaluate Your Test
              </button>
              <button
                className='rounded-lg bg-lime-400 py-2 px-4 text-slate-900'
                onClick={runTest}>
                Submit Your Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className='flex grow flex-col overflow-hidden border-b border-slate-700'
        style={{}}>
        <div className='flex gap-3 border-y border-slate-700 py-4 px-8 text-slate-400'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <rect width='16' height='16' fill='none' />
            <path
              d='M13 2.00391H3C2.73478 2.00391 2.48043 2.10926 2.29289 2.2968C2.10536 2.48434 2 2.73869 2 3.00391V13.0039C2 13.2691 2.10536 13.5235 2.29289 13.711C2.48043 13.8985 2.73478 14.0039 3 14.0039H13C13.2652 14.0039 13.5196 13.8985 13.7071 13.711C13.8946 13.5235 14 13.2691 14 13.0039V3.00391C14 2.73869 13.8946 2.48434 13.7071 2.2968C13.5196 2.10926 13.2652 2.00391 13 2.00391ZM13 3.00391V5.00391H3V3.00391H13ZM3 13.0039V6.00391H13V13.0039H3Z'
              fill='#a3e635'
            />
            <path
              d='M5.38 8.08891L6.79 9.50391L5.38 10.9189L6.085 11.6239L8.205 9.50391L6.085 7.38391L5.38 8.08891Z'
              fill='#a3e635'
            />
          </svg>
          Result
        </div>
        <div className='grow bg-[#090e1a] px-8 py-4 font-mono'>{response}</div>
      </div>
    </div>
    // <div className='p-5'>
    //   <div ref={editor2}></div>
    //   <div className='p-5 font-bold'>{prompts[0]?.prompt}</div>
    //   <div ref={editor}></div>
    //   <button className='m-5 bg-gray-400 p-1' onClick={onSubmit}>
    //     Evaluate Your Test
    //   </button>
    //   <button className='m-5 bg-gray-400 p-1' onClick={runTest}>
    //     Submit Your Test
    //   </button>
    //   <div
    //     className='p-5'
    //     style={{
    //       whiteSpace: 'pre-wrap',
    //     }}>
    //     {response}
    //   </div>
    // </div>
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
