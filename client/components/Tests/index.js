import React, { useState } from 'react';
import Test1 from './Test1';
import Test2 from './Test2';
import Test3 from './Test3';
import Test4 from './Test4';
import Test5 from './Test5';
import Test6 from './Test6';
import Test7 from './Test7';
import Test8 from './Test8';
import Test9 from './Test9';
import Test10 from './Test10';

const AllTests = [
  Test1,
  Test2,
  Test3,
  Test4,
  Test5,
  Test6,
  Test7,
  Test8,
  Test9,
  Test10,
];

const PaginatedTests = () => {
  const [currentTestIx, setCurrentTestIx] = useState(0);
  const CurrentTest = AllTests[currentTestIx];
  const onNext = () => {
    setCurrentTestIx((ix) => ix + 1);
  };
  const onPrevious = () => {
    setCurrentTestIx((ix) => ix - 1);
  };

  const onNumber = (ix) => {
    setCurrentTestIx(ix);
  };

  const styleOnCurrent = (ix) =>
    ix === currentTestIx && 'bg-lime-400 text-slate-900 pointer-events-none';

  return (
    <div className='top-0 mt-[-74px] flex h-screen max-h-screen flex-col justify-between overflow-hidden pt-[70px]'>
      {/* Overlay blocking access on screens smaller than 768px */}
      <div className='absolute top-0 z-10 flex h-full w-full items-center justify-center bg-slate-900 md:hidden'>
        Please use a desktop browser to continue learning
      </div>
      <CurrentTest />
      <div
        className='flex max-h-[10vh] items-center justify-center gap-4 p-8'
        style={{}}>
        <button
          onClick={onPrevious}
          disabled={currentTestIx === 0}
          className='group mr-4 flex items-center gap-3 text-lime-400 hover:text-lime-600  disabled:text-slate-700'>
          <svg
            // className='transition-all group-hover:ml-4'
            width='17'
            height='18'
            viewBox='0 0 17 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='rotate-180'>
            <path
              d='M1.48022 8.87939H14.5'
              stroke='#a3e635'
              strokeWidth='2'
              strokeLinecap='square'
              strokeLinejoin='round'
              className='group-hover:stroke-lime-600 group-disabled:stroke-slate-700'
            />
            <path
              d='M8.48022 1.87939L15.4802 8.87939L8.48022 15.8794'
              stroke='#a3e635'
              strokeWidth='2'
              strokeLinecap='square'
              className='group-hover:stroke-lime-600 group-disabled:stroke-slate-700'
            />
          </svg>
          Previous
        </button>
        {AllTests.map((_test, ix) => {
          return (
            <span
              key={ix}
              onClick={() => onNumber(ix)}
              className={`${styleOnCurrent(
                ix,
              )}  flex h-8 w-8 cursor-pointer items-center justify-center self-center rounded-lg bg-slate-700 transition-all hover:bg-slate-600`}>
              {`  ${ix + 1}  `}
            </span>
          );
        })}
        <button
          onClick={onNext}
          disabled={currentTestIx === AllTests.length - 1}
          className='group ml-4 flex items-center gap-3 text-lg text-lime-400 transition-all hover:text-lime-600  disabled:text-slate-700'>
          Next
          <svg
            // className='transition-all group-hover:ml-4'
            width='17'
            height='18'
            viewBox='0 0 17 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className=''>
            <path
              d='M1.48022 8.87939H14.5'
              stroke='#a3e635'
              strokeWidth='2'
              strokeLinecap='square'
              strokeLinejoin='round'
              className='group-hover:stroke-lime-600 group-disabled:stroke-slate-700'
            />
            <path
              d='M8.48022 1.87939L15.4802 8.87939L8.48022 15.8794'
              stroke='#a3e635'
              strokeWidth='2'
              strokeLinecap='square'
              className='group-hover:stroke-lime-600 group-disabled:stroke-slate-700'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaginatedTests;
