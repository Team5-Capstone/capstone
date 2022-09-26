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
import { fetchPrompts } from '../store/prompts';
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

    const view = new EditorView({ state, parent: editor.current });
    const strikeMark = Decoration.mark({
      attributes: { style: 'background: yellow' },
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
