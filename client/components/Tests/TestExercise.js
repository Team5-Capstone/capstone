import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { Decoration, EditorView, keymap } from '@codemirror/view';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { autocompletion } from '@codemirror/autocomplete';
import { basicSetup } from 'codemirror';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import readOnlyRangesExtension from 'codemirror-readonly-ranges';

import JSCodeModal from '../JSCodeModal';
import SolutionModal from '../SolutionModal';
import {
  CodeEditorIcon,
  ConsoleIcon,
  InstructionsIcon,
  PromptIcon,
} from '../SVG_Icons';

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
  },
});

const dynamicReadOnlyRanges = (ranges) => {
  return (editorRef) => {
    const theRanges = ranges.map((range) => {
      return {
        from: editorRef.doc.line(range.from).from,
        to: editorRef.doc.line(range.to).to,
      };
    });

    return theRanges;
  };
};

function myCompletions(context) {
  const completions = [
    { label: 'toBe', type: 'keyword' },
    { label: 'expect', type: 'keyword' },
    { label: 'test', type: 'keyWord' },
    { label: 'describe', type: 'keyword' },
    { label: 'toEqual', type: 'keyWord' },
    { label: 'not', type: 'keyWord' },
  ];

  let before = context.matchBefore(/\w+/);
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  };
}

const defaultResponse = 'See your results here!';

export const Editor = (props) => {
  const editorRef = useRef();
  const instrEditorRef = useRef();
  const [code, setCode] = useState('');
  const [hasTestPassed, setHasTestPassed] = useState(false);
  const [response, setResponse] = useState(defaultResponse);
  const { currentPrompt } = props;
  const {
    jsCode,
    narrative,
    orderNum,
    prompt,
    readOnlyRanges,
    solution,
    strikeMarkRanges,
    templateTest,
  } = currentPrompt;

  // Instructions editor

  const getInstrReadOnlyRanges = (instrEditorRef) => {
    return [
      {
        from: undefined,
        to: instrEditorRef.doc.line(0).to,
      },
      {
        from: instrEditorRef.doc.line(1).from,
        to: instrEditorRef.doc.line(100).to,
      },
      {
        from: instrEditorRef.doc.line(instrEditorRef.doc.lines).from,
        to: undefined,
      },
    ];
  };

  useEffect(() => {
    setResponse(defaultResponse);
    turnOffCtrlS();

    const state = EditorState.create({
      doc: narrative,
      extensions: [
        EditorView.lineWrapping,
        baseTheme,
        basicSetup,
        oneDark,
        readOnlyRangesExtension(getInstrReadOnlyRanges),
      ],
    });

    const view = new EditorView({
      state,
      parent: instrEditorRef.current,
      lineWrapping: true,
    });

    return () => {
      view.destroy();
    };
  }, [narrative]);

  // Template Test editor

  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString());
  });

  useEffect(() => {
    const addMarks = StateEffect.define();
    const filterMarks = StateEffect.define();

    const markField = StateField.define({
      create() {
        return Decoration.none;
      },
      update(value, transaction) {
        value = value.map(transaction.changes);
        transaction.effects.map((effect) => {
          const willAddMarks = effect.is(addMarks);
          const willFilterMarks = effect.is(filterMarks);

          if (willAddMarks) {
            value = value.update({ add: effect.value, sort: true });
          } else if (willFilterMarks) {
            value = value.update({ filter: effect.value });
          }
        });

        return value;
      },
      provide: (f) => EditorView.decorations.from(f),
    });

    const state = EditorState.create({
      doc: templateTest,

      extensions: [
        basicSetup,
        EditorState.tabSize.of(16),
        keymap.of([defaultKeymap, indentWithTab]),
        oneDark,
        markField,
        javascript(),
        onUpdate,
        EditorView.lineWrapping,
        readOnlyRangesExtension(dynamicReadOnlyRanges(readOnlyRanges)),
        autocompletion({ override: [myCompletions] }),
      ],
    });

    const view = new EditorView({ state, parent: editorRef.current });
    const strikeMark = Decoration.mark({
      attributes: { style: 'background: #3730a3' },
    });

    const strikeMarkArray = strikeMarkRanges?.map((range) => {
      return strikeMark.range(range.start, range.end);
    });
    view.dispatch({
      effects: addMarks.of(strikeMarkArray),
    });

    return () => {
      view.destroy();
    };
  }, [templateTest]);

  const fetchData = () => {
    axios
      .post('/api/evaluateTest', {
        code,
        orderNum,
      })
      .then((res) => {
        setResponse(res.data);
        if (
          res.data.includes('That looks right! Go ahead and submit your test!')
        ) {
          setHasTestPassed(true);
        }
      });
  };

  const onSubmit = () => {
    fetchData();
  };

  const runTest = () => {
    if (hasTestPassed !== true) {
      setResponse('Get the test to pass before you submit!');
      return;
    }

    axios
      .post('/api/submitTest', {
        code,
        hasTestPassed,
        jsCode,
      })
      .then((res) => {
        setHasTestPassed(false);
        setResponse(res.data);
      });
  };

  const [isSolutionShown, setIsSolutionShown] = React.useState(false);
  const [isCodeShown, setIsCodeShown] = React.useState(false);

  return (
    <div className='flex h-[93vh] max-h-[93vh] w-full grow flex-col overflow-hidden bg-slate-900'>
      <SolutionModal
        isSolutionShown={isSolutionShown}
        closeModal={() => setIsSolutionShown(false)}
        solution={solution}
      />
      <JSCodeModal
        isCodeShown={isCodeShown}
        closeModal={() => setIsCodeShown(false)}
        jsCode={jsCode}
      />
      <div className='flex h-3/4 w-full'>
        <div
          id='left-column'
          className='flex w-1/2 flex-col overflow-hidden border-r border-slate-700'>
          <div className='flex gap-3 border-b border-slate-700 px-8 pt-4 pb-3 text-slate-400'>
            <InstructionsIcon />
            Instructions
          </div>
          <div
            id='instructions-editor'
            className='scrollbar overflow-y-auto bg-[#090e1a]'
            style={{ height: '100%' }}
            ref={instrEditorRef}></div>
        </div>

        <div id='right-column' className='relative flex h-full w-1/2 flex-col'>
          <div
            id='prompt-container'
            className='flex max-h-[40%] min-h-[30%] shrink-0 flex-col overflow-hidden'>
            <div className='flex gap-3 border-b border-slate-700 bg-slate-900 px-6 pt-4 pb-3 text-slate-400'>
              <PromptIcon />
              Prompt
            </div>
            <div
              id='prompt'
              className='scrollbar grow overflow-y-auto bg-slate-900 px-8 py-4 text-lg text-slate-200'>
              <div className='max-w-[800px] leading-7'>{prompt}</div>
            </div>
          </div>
          <div
            id='your-code-container'
            className='flex grow flex-col overflow-hidden'>
            <div className='flex gap-3 border-y border-slate-700 bg-slate-900 py-3 px-6 text-slate-400'>
              <CodeEditorIcon />
              Your Test
            </div>

            <div
              id='your-editor'
              className='scrollbar h-full grow overflow-y-auto overflow-x-hidden bg-[#090e1a]'
              ref={editorRef}></div>
          </div>
          <div
            id='button-container'
            className='flex gap-6 border-t border-slate-700 py-4 px-6'>
            <button
              className='self-center rounded-lg border border-lime-400 px-4 py-2 text-sm text-lime-400 transition-all hover:bg-lime-400/10 2xl:text-base'
              onClick={onSubmit}>
              Evaluate Test
            </button>
            <button
              className='filled-button self-center rounded-lg bg-lime-400 px-4 py-2  text-sm text-slate-900 transition-shadow 2xl:text-base'
              onClick={runTest}>
              Submit Test
            </button>
            <button
              className='self-center rounded-lg border border-lime-400 px-4 py-2 text-sm text-lime-400 transition-all hover:bg-lime-400/10 2xl:text-base'
              onClick={() => setIsSolutionShown(true)}>
              Show Solution
            </button>
            <button
              className='filled-button self-center rounded-lg bg-lime-400 px-4 py-2  text-sm text-slate-900 transition-shadow 2xl:text-base'
              onClick={() => setIsCodeShown(true)}>
              Show JavaScript Code
            </button>
          </div>
        </div>
      </div>
      <div
        className='flex grow flex-col overflow-hidden border-b border-slate-700'
        style={{}}>
        <div className='flex items-center border-y border-slate-700 px-8 py-3 text-slate-400'>
          <div className='flex items-center gap-3'>
            <ConsoleIcon />
            Results
          </div>
        </div>

        <div className='scrollbar grow overflow-y-auto bg-[#090e1a] px-8 py-4 font-mono text-slate-200'>
          {response}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (props) => {
  return props;
};

export default connect(mapStateToProps)(Editor);
