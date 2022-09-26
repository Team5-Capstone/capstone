import React, { useMemo, useState } from 'react';
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
  const onReset = () => {
    setCurrentTestIx(0);
  };
  const onTestChange = (e) => {
    setCurrentTestIx(Number(e.target.value));
  };
  const testOptions = useMemo(
    () =>
      AllTests.map((Test, ix) => (
        <option key={ix} value={ix}>
          {Test.name}
        </option>
      )),
    [],
  );
  return (
    <div>
      <CurrentTest />
      <div>
        <button onClick={onPrevious} disabled={currentTestIx === 0}>
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentTestIx === AllTests.length - 1}>
          Next
        </button>
        <button onClick={onReset}>Reset</button>
        <select value={currentTestIx} onChange={onTestChange}>
          {testOptions}
        </select>
      </div>
    </div>
  );
};

export default PaginatedTests;
