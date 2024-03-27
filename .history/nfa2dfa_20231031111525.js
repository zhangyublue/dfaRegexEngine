// // 定义一个示例的NFA（非确定性有限自动机）
// const nfa = {
//   states: [0, 1, 2],
//   alphabet: ['a', 'b'],
//   transitions: [
//     { from: 0, to: [0, 1], on: 'a' },
//     { from: 1, to: [2], on: 'a' },
//     { from: 1, to: [0], on: 'b' },
//   ],
//   start: 0,
//   accept: [2],
// };

// // 函数来获取ε-闭包（包括自身）的状态集合
// function epsilonClosure(states, transitions) {
//   const closure = new Set(states);
//   let stack = [...states];

//   while (stack.length > 0) {
//     const state = stack.pop();
//     transitions.forEach((transition) => {
//       if (transition.from === state && transition.on === 'ε' && !closure.has(transition.to)) {
//         closure.add(transition.to);
//         stack.push(transition.to);
//       }
//     });
//   }

//   return Array.from(closure);
// }

// // 函数来获取从给定状态集合经过输入符号得到的状态集合
// function move(states, symbol, transitions) {
//   const newStates = new Set();
//   states.forEach((state) => {
//     transitions.forEach((transition) => {
//       if (transition.from === state && transition.on === symbol) {
//         newStates.add(transition.to);
//       }
//     });
//   });
//   return Array.from(newStates);
// }

// // 主函数用于将NFA转换为DFA
// function NFAtoDFA(nfa) {
//   const dfa = { states: [], alphabet: nfa.alphabet, transitions: [], start: 0, accept: [] };
//   const queue = [];

//   // ε-闭包的初始状态
//   const startEpsilonClosure = epsilonClosure([nfa.start], nfa.transitions);
//   dfa.states.push(startEpsilonClosure);

//   queue.push(startEpsilonClosure);

//   while (queue.length > 0) {
//     const currentState = queue.shift();

//     nfa.alphabet.forEach((symbol) => {
//       const newState = move(currentState, symbol, nfa.transitions);
//       const newStateEpsilonClosure = epsilonClosure(newState, nfa.transitions);

//       if (!dfa.states.some((state) => JSON.stringify(state) === JSON.stringify(newStateEpsilonClosure))) {
//         dfa.states.push(newStateEpsilonClosure);
//         queue.push(newStateEpsilonClosure);
//       }

//       const fromStateIndex = dfa.states.indexOf(currentState);
//       const toStateIndex = dfa.states.indexOf(newStateEpsilonClosure);
//       dfa.transitions.push({ from: fromStateIndex, to: toStateIndex, on: symbol });
//     });
//   }

//   // 标记DFA的起始状态和接受状态
//   dfa.start = 0;
//   dfa.states.forEach((state, index) => {
//     if (state.includes(nfa.accept[0])) {
//       dfa.accept.push(index);
//     }
//   });

//   return dfa;
// }

// // 使用NFA转换为DFA
// const dfa = NFAtoDFA(nfa);

// console.log("DFA:", dfa);

// 定义NFA的五要素
// 定义NFA的五要素，包括ε转移
// const nfa = {
//   states: [1, 2, 3, 4],
//   alphabet: ['a', 'b'],
//   transitions: {
//     1: { a: [2], b: [2] },
//     2: { a: [3], b: [4] },
//     3: { a: [2], b: [2] },
//     4: { a: [2], b: [2] },
//   },
//   startState: 1,
//   acceptStates: [2],
// };

// // 计算ε闭包
// function epsilonClosure(nfa, states) {
//   const stack = states.slice();
//   const epsilonClosureSet = new Set(states);

//   while (stack.length > 0) {
//     const currentState = stack.pop();

//     if (nfa.transitions[currentState][''] && nfa.transitions[currentState][''].length > 0) {
//       const epsilonTransitions = nfa.transitions[currentState][''];
//       epsilonTransitions.forEach((state) => {
//         if (!epsilonClosureSet.has(state)) {
//           epsilonClosureSet.add(state);
//           stack.push(state);
//         }
//       });
//     }
//   }

//   return Array.from(epsilonClosureSet);
// }

// // 计算move操作
// function move(nfa, states, symbol) {
//   const nextStates = new Set();

//   states.forEach((state) => {
//     if (nfa.transitions[state][symbol]) {
//       nfa.transitions[state][symbol].forEach((nextState) => {
//         nextStates.add(nextState);
//       });
//     }
//   });

//   return Array.from(nextStates);
// }

// // 使用子集法构建DFA，考虑move操作和ε闭包
// function nfaToDfaWithMoveAndEpsilonClosure(nfa) {
//   const dfa = {
//     states: [],
//     alphabet: nfa.alphabet,
//     transitions: {},
//     startState: [],
//     acceptStates: [],
//   };

//   const nfaStatesQueue = [];
//   const nfaStatesSet = new Set();
//   const dfaStatesMap = new Map();

//   // 函数用于将状态数组排序并返回为逗号分隔的字符串
//   function getStateKey(states) {
//     return states.sort().join(',');
//   }

//   // 初始化队列和状态集合
//   const epsilonStartState = epsilonClosure(nfa, [nfa.startState]);
//   nfaStatesQueue.push(epsilonStartState);
//   nfaStatesSet.add(getStateKey(epsilonStartState));

//   // 主循环
//   while (nfaStatesQueue.length > 0) {
//     const currentNFAStates = nfaStatesQueue.shift();
//     const currentDFAStateKey = getStateKey(currentNFAStates);

//     dfaStatesMap.set(currentDFAStateKey, currentNFAStates);

//     dfa.states.push(currentNFAStates);

//     if (currentNFAStates.includes(nfa.startState)) {
//       dfa.startState = currentNFAStates;
//     }

//     if (currentNFAStates.some((state) => nfa.acceptStates.includes(state))) {
//       dfa.acceptStates.push(currentNFAStates);
//     }

//     dfa.alphabet.forEach((symbol) => {
//       const nextNFAStates = move(nfa, currentNFAStates, symbol);

//       const nextStateKey = getStateKey(epsilonClosure(nfa, nextNFAStates));

//       if (!nfaStatesSet.has(nextStateKey)) {
//         nfaStatesSet.add(nextStateKey);
//         nfaStatesQueue.push(epsilonClosure(nfa, nextNFAStates));
//       }

//       if (!dfa.transitions[currentDFAStateKey]) {
//         dfa.transitions[currentDFAStateKey] = {};
//       }
//       dfa.transitions[currentDFAStateKey][symbol] = nextStateKey;
//     });
//   }

//   return dfa;
// }

// // 使用子集法构建DFA，考虑move操作和ε闭包
// const dfa = nfaToDfaWithMoveAndEpsilonClosure(nfa);
// console.log('DFA:', dfa);

// 定义 NFA 的五要素，包括 ε 转移
const nfa = {
  states: [0, 1, 2],
  alphabet: ["a", "b"],
  transitions: {
    0: { a: [1], b: [1] },
    1: { b: [2], a: [1] },
    2: {}
  },
  startState: 0,
  acceptStates: [1, 2],
};

// 计算 ε 闭包
function epsilonClosure(nfa, states) {
  const stack = states.slice();
  const epsilonClosureSet = new Set(states);

  while (stack.length > 0) {
    const currentState = stack.pop();

    if (
      nfa.transitions[currentState][""] &&
      nfa.transitions[currentState][""].length > 0
    ) {
      const epsilonTransitions = nfa.transitions[currentState][""];
      epsilonTransitions.forEach((state) => {
        if (!epsilonClosureSet.has(state)) {
          epsilonClosureSet.add(state);
          stack.push(state);
        }
      });
    }
  }

  return Array.from(epsilonClosureSet);
}

// 计算 move 操作
function move(nfa, states, symbol) {
  const nextStates = new Set();

  states.forEach((state) => {
    if (nfa.transitions[state][symbol]) {
      nfa.transitions[state][symbol].forEach((nextState) => {
        nextStates.add(nextState);
      });
    }
  });

  return Array.from(nextStates);
}

// 使用子集法构建 DFA，考虑 move 操作和 ε 闭包
function nfaToDfaWithMoveAndEpsilonClosure(nfa) {
  const dfa = {
    states: [],
    alphabet: nfa.alphabet,
    transitions: {},
    startState: [],
    acceptStates: [],
  };

  const nfaStatesQueue = [];
  const nfaStatesSet = new Set();
  const dfaStatesMap = new Map();

  // 函数用于将状态数组排序并返回为逗号分隔的字符串
  function getStateKey(states) {
    return states.sort().join(",");
  }

  // 初始化队列和状态集合
  const epsilonStartState = epsilonClosure(nfa, [nfa.startState]);
  nfaStatesQueue.push(epsilonStartState);
  nfaStatesSet.add(getStateKey(epsilonStartState));

  // 主循环
  while (nfaStatesQueue.length > 0) {
    const currentNFAStates = nfaStatesQueue.shift();
    const currentDFAStateKey = getStateKey(currentNFAStates);

    dfaStatesMap.set(currentDFAStateKey, currentNFAStates);

    dfa.states.push(currentNFAStates);

    if (currentNFAStates.includes(nfa.startState)) {
      dfa.startState = currentNFAStates;
    }

    if (currentNFAStates.some((state) => nfa.acceptStates.includes(state))) {
      dfa.acceptStates.push(currentNFAStates);
    }

    dfa.alphabet.forEach((symbol) => {
      const nextNFAStates = move(nfa, currentNFAStates, symbol);
      const epsilonNextNFAStates = epsilonClosure(nfa, nextNFAStates);

      const nextStateKey = getStateKey(epsilonNextNFAStates);

      if (!nfaStatesSet.has(nextStateKey)) {
        nfaStatesSet.add(nextStateKey);
        nfaStatesQueue.push(epsilonNextNFAStates);
      }

      if (!dfa.transitions[currentDFAStateKey]) {
        dfa.transitions[currentDFAStateKey] = {};
      }
      dfa.transitions[currentDFAStateKey][symbol] = nextStateKey;
    });
  }

  return dfa;
}

// 使用子集法构建 DFA，考虑 move 操作和 ε 闭包
const dfa = nfaToDfaWithMoveAndEpsilonClosure(nfa);
console.log("DFA:", dfa);
