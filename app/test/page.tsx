'use client';

import React, { useRef } from 'react';
import { useState } from 'react';

export default function Counter() {
    const [count, setCount] = useState(0);
  
    return (
      <div>
        <button onClick={()=>{
          setCount(count + 1);
        }}>Click me!</button>
        {/* textContent로 iframe 일경우 업데이트 되지 않는다.*/}
        <p id="count">clicked {count} times</p>
      </div>
    );
  }
