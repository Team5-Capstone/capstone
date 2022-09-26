import React from 'react';
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
  const Test1 = AllTests[0];
  return (
    <>
      <Test1 />
    </>
  );
};

export default PaginatedTests;
