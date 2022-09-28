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

  const templateTest = prompts[7]?.templateTest;
  const narrative = prompts[7]?.narrative;
  const completions = [
    { label: 'toBe', type: 'keyword' },
    { label: 'expect', type: 'keyword' },
    { label: 'test', type: 'keyWord' },
    { label: 'describe', type: 'keyword' },
    { label: 'toEqual', type: 'keyWord' },
    { label: 'not', type: 'keyWord' },
  ];

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

    const state = EditorState.create({
      doc: narrative || code2,
      extensions: [
        basicSetup,
        oneDark,
        baseTheme,
        onUpdate2,
        javascript(),
        readOnlyRangesExtension(getReadOnlyRanges2),
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
        EditorView.lineWrapping,
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
        strikeMark.range(11, 24),
        strikeMark.range(50, 63),
        strikeMark.range(95, 108),
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
      .post('/api/jestTests/jest8', {
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
        .post('/api/jestTests/jest8/results', {
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
      <div className='p-5 font-bold'>{prompts[7]?.prompt}</div>
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
