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

  return (
    <div>
      <CurrentTest />
      <div
        className='p-5'
        style={{
          whiteSpace: 'pre-wrap',
        }}>
        <button
          onClick={onPrevious}
          disabled={currentTestIx === 0}
          className='m-5 bg-gray-400 p-1 hover:bg-yellow-600  disabled:bg-red-900'>
          Previous
        </button>
        {AllTests.map((_test, ix) => {
          return (
            <span
              key={ix}
              onClick={() => onNumber(ix)}
              className={'m-5 bg-gray-400 p-1 hover:bg-yellow-600'}>
              {`  ${ix + 1}  `}
            </span>
          );
        })}
        <button
          onClick={onNext}
          disabled={currentTestIx === AllTests.length - 1}
          className='m-5 bg-gray-400 p-1 hover:bg-yellow-600 disabled:bg-red-900'>
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTests;
