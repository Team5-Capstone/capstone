// import React, { useRef, useEffect, useState } from 'react';
// import { EditorState } from '@codemirror/state';
// import { StateField, StateEffect } from '@codemirror/state';
// import { basicSetup } from 'codemirror';
// import { EditorView, keymap } from '@codemirror/view';
// import { Decoration } from '@codemirror/view';
// import { defaultKeymap, indentWithTab } from '@codemirror/commands';
// import { javascript } from '@codemirror/lang-javascript';
// import { oneDark } from '@codemirror/theme-one-dark';
// import readOnlyRangesExtension from 'codemirror-readonly-ranges';

// import axios from 'axios';
// import { fetchPrompts } from '../store/prompts';
// import { autocompletion } from '@codemirror/autocomplete';
// import { connect } from 'react-redux';
// const { v4: uuidv4 } = require('uuid');

// const turnOffCtrlS = () => {
//   document.addEventListener('keydown', (e) => {
//     const pressedS = e.key === 's';
//     const pressedCtrl = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;

//     if (pressedS && pressedCtrl) {
//       e.preventDefault();
//     }
//   });
// };

// export const Editor = (props) => {
//   const editor = useRef();
//   const editor2 = useRef();
//   const [code, setCode] = useState('');
//   const [id, setId] = useState(uuidv4());
//   const [passedTest, setPassedTest] = useState('false');
//   const [response, setResponse] = useState('See your results here!');
//   const { prompts } = props;

//   const templateTest = prompts[9]?.templateTest;
//   const narrative = prompts[9]?.narrative;
//   const completions = [
//     { label: 'toBe', type: 'keyword' },
//     { label: 'expect', type: 'keyword' },
//     { label: 'test', type: 'keyWord' },
//     { label: 'describe', type: 'keyword' },
//     { label: 'helloWorld', type: 'keyword' },
//     { label: 'Hello, ', type: 'keyword' },
//     { label: 'World!', type: 'keyword' },
//   ];

//   function myCompletions(context) {
//     console.log(context);
//     let before = context.matchBefore(/\w+/);
//     if (!context.explicit && !before) return null;
//     return {
//       from: before ? before.from : context.pos,
//       options: completions,
//       validFor: /^\w*$/,
//     };
//   }

//     const state = EditorState.create({
//       doc: narrative || code2,
//       extensions: [
//         basicSetup,
//         oneDark,
//         onUpdate2,
//         javascript(),
//         // removeIndentation(),
//         readOnlyRangesExtension(getReadOnlyRanges2),
//       ],
//     });

//   // const getReadOnlyRanges = (editor) => {
//   // console.log(editor.doc.line);
//   // return [
//   //   {
//   //     from: undefined, //same as targetState.doc.line(0).from or 0
//   //     to: editor.doc.line(2).to,
//   //   },
//   //   {
//   //     from: editor.doc.line(4).from, //same as targetState.doc.line(0).from or 0
//   //     to: editor.doc.line(5).to,
//   //   },
//   //   {
//   //     from: editor.doc.line(editor.doc.lines).from,
//   //     to: undefined, // same as targetState.doc.line(targetState.doc.lines).to
//   //   },
//   // ];
//   // };
//   // const removeIndentation =() => {
//   //   const cm = editor2.instance;
//   //   cm.execCommand('delLineLeft');
//   // }

//   useEffect(() => {
//     turnOffCtrlS();

//     const state = EditorState.create({
//       doc: narrative,
//       extensions: [
//         basicSetup,
//         oneDark,
//         onUpdate,
//         javascript(),
//         // removeIndentation(),
//         // readOnlyRangesExtension(getReadOnlyRanges),
//       ],
//     });

//     const view2 = new EditorView({
//       state,
//       parent: editor2.current,
//     });

//     const fetchStuff = async () => {
//       await props.fetchPrompts();
//     };
//     fetchStuff();

//     return () => {
//       view2.destroy();
//     };
//   }, [narrative]);

//   const fetchData = () => {
//     axios
//       .post('/api/jestTests/jest10', {
//         code,
//       })
//       .then((res) => {
//         setResponse(res.data);
//         if (
//           res.data.includes('That looks right! Go ahead and submit your test!')
//         ) {
//           setPassedTest('true');
//         }
//       });

//     const fetchStuff = async () => {
//       await props.fetchPrompts();
//     };
//     fetchStuff();

//     return () => {
//       view2.destroy();
//     };
//   }, [narrative]);

//   const runTest = () => {
//     if (passedTest === 'true') {
//       setId(uuidv4());
//       axios
//         .post('/api/jestTests/jest10/results', {
//           code,
//           id,
//           passedTest,
//         })
//         .then((res) => {
//           setPassedTest('false');
//           setResponse(res.data);
//         });
//     } else {
//       setResponse('Get the test to pass before you submit!');
//     }
//   };

//   useEffect(() => {
//     // const addMarks = StateEffect.define();
//     // const filterMarks = StateEffect.define();

//     // const markField = StateField.define({
//     //   // Start with an empty set of decorations
//     //   create() {
//     //     return Decoration.none;
//     //   },
//     //   // This is called whenever the editor updates—it computes the new set
//     //   update(value, tr) {
//     //     // Move the decorations to account for document changes
//     //     value = value.map(tr.changes);
//     //     // If this transaction adds or removes decorations, apply those changes
//     //     for (let effect of tr.effects) {
//     //       if (effect.is(addMarks))
//     //         value = value.update({ add: effect.value, sort: true });
//     //       else if (effect.is(filterMarks))
//     //         value = value.update({ filter: effect.value });
//     //     }
//     //     return value;
//     //   },
//     //   // Indicate that this field provides a set of decorations
//     //   provide: (f) => EditorView.decorations.from(f),
//     // });

//     turnOffCtrlS();
//     const state = EditorState.create({
//       doc: code || templateTest,

//       extensions: [
//         basicSetup,
//         EditorState.tabSize.of(16),
//         keymap.of([defaultKeymap, indentWithTab]),
//         oneDark,
//         // markField,
//         javascript(),
//         onUpdate,
//         // readOnlyRangesExtension(getReadOnlyRanges),
//         autocompletion({ override: [myCompletions] }),
//       ],
//     });

//     const view = new EditorView({ state, parent: editor.current });
//     // const strikeMark = Decoration.mark({
//     //   attributes: { style: 'background: yellow' },
//     // });
//     view.dispatch({
//       // effects: addMarks.of([
//       //   strikeMark.range(90, 103),
//       //   strikeMark.range(115, 128),
//       //   strikeMark.range(147, 160),
//       //   strikeMark.range(173, 186),
//       // ]),
//     });

//     const fetchStuff = async () => {
//       await props.fetchPrompts();
//     };
//     fetchStuff();

//     return () => {
//       view.destroy();
//     };
//   }, [templateTest]);

//   const fetchData = () => {
//     axios
//       .post('/api/jestTests/jest1', {
//         code,
//       })
//       .then((res) => {
//         setResponse(res.data);
//         if (
//           res.data.includes('That looks right! Go ahead and submit your test!')
//         ) {
//           setPassedTest('true');
//         }
//       });
//   };

//   const onSubmit = () => {
//     fetchData();
//   };

//   const runTest = () => {
//     if (passedTest === 'true') {
//       setId(uuidv4());
//       axios
//         .post('/api/jestTests/jest1/results', {
//           code,
//           id,
//           passedTest,
//         })
//         .then((res) => {
//           setPassedTest('false');
//           setResponse(res.data);
//         });
//     } else {
//       setResponse('Get the test to pass before you submit!');
//     }
//   };

//   return (
//     <div className='h-screen'>
//       <div>
//         <div className='flex h-4/6 w-full'>
//           <div
//             id='left-column'
//             className='my-8 ml-8 mr-4 flex w-1/2 flex-col border border-slate-700'>
//             <div className='bg-slate-700 py-2 px-4 text-white'>
//               Instructions
//             </div>
//             <div
//               id='instructions'
//               className='bg-[#282c34]'
//               style={{ height: '100%' }}
//               ref={editor2}></div>
//           </div>

//           <div id='right-column' className='w-1/2 py-8 pl-4 pr-8'>
//             <div className='bg-slate-700 py-2 px-4 text-white'>Prompt</div>
//             <div id='prompt' className='mb-8 border border-slate-700 px-4 py-6'>
//               {prompts[8]?.prompt}
//             </div>
//             <div className='bg-slate-700 py-2 px-4 text-white'>Your Code</div>
//             <div id='editor' ref={editor}></div>

//             <div
//               id='button-container'
//               className='flex gap-4 border border-slate-800 p-4'>
//               <button
//                 className='rounded-lg border border-lime-400 px-4 py-2 text-lime-400'
//                 onClick={onSubmit}>
//                 Evaluate Your Test
//               </button>
//               <button
//                 className='rounded-lg bg-lime-400 py-2 px-4 text-slate-900'
//                 onClick={runTest}>
//                 Submit Your Test
//               </button>
//             </div>
//           </div>
//         </div>

//         <div
//           className='p-5 font-mono'
//           style={{
//             whiteSpace: 'pre-wrap',
//           }}>
//           {response}
//         </div>
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = ({ prompts }) => {
//   return {
//     prompts,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     fetchPrompts: () => dispatch(fetchPrompts()),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Editor);
