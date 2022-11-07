import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NextArrowIcon, PreviousArrowIcon } from '../SVG_Icons';
import { fetchPrompts } from '../../store/prompts';
import { Link } from 'react-router-dom';
import TestExercise from './TestExercise';

const Overlay = () => {
  // Overlay blocking access on screens smaller than 768px
  return (
    <div className='absolute top-0 z-10 flex h-full w-full items-center justify-center bg-slate-900 md:hidden'>
      Please use a desktop browser to continue learning
    </div>
  );
};

const styleOnCurrentPrompt = (currentPromptNum, promptNum) => {
  const isCurrentPrompt = currentPromptNum === promptNum;
  return isCurrentPrompt && 'bg-lime-400 text-slate-900 pointer-events-none';
};

const PaginationRow = ({ currentPromptNum, prompts }) => {
  return (
    <div
      className='flex max-h-[7vh] items-center justify-center gap-4 p-8'
      style={{}}>
      <Link to={`/jest/${currentPromptNum - 1}`}>
        <button
          disabled={currentPromptNum <= 1}
          className='group mr-4 flex items-center gap-3 text-lime-400 hover:text-lime-600  disabled:text-slate-700'>
          <PreviousArrowIcon />
          Previous
        </button>
      </Link>
      {prompts.map((_prompt, index) => {
        const promptNum = index + 1;
        const isCurrentStyle = styleOnCurrentPrompt(
          promptNum,
          currentPromptNum,
        );
        return (
          <Link key={promptNum} to={`/jest/${promptNum}`}>
            <span
              className={`${isCurrentStyle} flex h-8 w-8 cursor-pointer items-center justify-center self-center rounded-lg transition-all hover:bg-slate-600`}>
              {`  ${promptNum}  `}
            </span>
          </Link>
        );
      })}
      <Link to={`/jest/${currentPromptNum + 1}`}>
        <button
          disabled={currentPromptNum === prompts.length}
          className='group ml-4 flex items-center gap-3 text-lg text-lime-400 transition-all hover:text-lime-600  disabled:text-slate-700'>
          Next
          <NextArrowIcon />
        </button>
      </Link>
    </div>
  );
};

const PaginatedPrompts = (props) => {
  const { currentPrompt, currentPromptNum, fetchPrompts, prompts } = props;

  useEffect(() => {
    fetchPrompts();
  }, []);

  return (
    <div className='top-0 mt-[-74px] flex h-screen max-h-screen flex-col justify-between overflow-hidden pt-[70px]'>
      <Overlay />
      <TestExercise
        currentPrompt={currentPrompt}
        currentPromptNum={currentPromptNum}
      />
      <PaginationRow currentPromptNum={currentPromptNum} prompts={prompts} />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { match } = props;
  const currentPromptNum = 1 * match.params.promptNum;
  const { prompts } = state;
  const promptIndex = currentPromptNum - 1;
  const currentPrompt = prompts[promptIndex] || {};
  return {
    currentPrompt,
    currentPromptNum,
    prompts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPrompts: () => dispatch(fetchPrompts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaginatedPrompts);
