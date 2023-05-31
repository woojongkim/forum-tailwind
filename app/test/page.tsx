'use client';

import React, { useRef } from 'react';
import { useState } from 'react';

export default function Counter() {
    const [count, setCount] = useState(0);
  
    // clickHandler 함수는 count state를 증가시키고 이를 W3C DOM API인 querySelector()를 이용하여 id로 찾은 element(고유한)에 나타내어 갱신한다.
    const clickHandler = () => {
      setCount(count + 1);
    //   document.querySelector('#count').textContent = `clicked ${count} times`;
    };
  
    return (
      <div>
        <button onClick={clickHandler}>Click me!</button>
        {/* textContent로 iframe 일경우 업데이트 되지 않는다.*/}
        <p id="count">clicked {count} times</p>
      </div>
    );
  }
