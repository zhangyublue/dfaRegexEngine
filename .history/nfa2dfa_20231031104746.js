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
const nfa = {
  Q: [0, 1, 2],
  Sigma: ['a', 'b'],
  delta: {
    0: { a: [0, 1], b: [0] },
    1: { a: [1], b: [2] },
    2: { a: [2] },
  },
  q0: 0,
  F: [2],
};

// 初始化DFA的五要素
const dfa = {
  Q: [],
  Sigma: nfa.Sigma,
  delta: {},
  q0: [],
  F: [],
};

// 辅助函数：计算ε闭包
function epsilonClosure(states) {
  const epsilonStates = new Set(states);

  function dfs(state) {
    if (nfa.delta[state]['ε']) {
      for (const nextState of nfa.delta[state]['ε']) {
        if (!epsilonStates.has(nextState)) {
          epsilonStates.add(nextState);
          dfs(nextState);
        }
      }
    }
  }

  for (const state of states) {
    dfs(state);
  }

  return Array.from(epsilonStates);
}

// 初始化DFA的起始状态
dfa.q0 = epsilonClosure([nfa.q0]);

// 构建DFA状态集合和状态转移函数
const stateQueue = [dfa.q0];
const visitedStates = new Set();

while (stateQueue.length > 0) {
  const currentState = stateQueue.shift();

  if (!visitedStates.has(currentState)) {
    visitedStates.add(currentState);
    dfa.Q.push(currentState);

    for (const symbol of nfa.Sigma) {
      const nextState = [];
      for (const nfaState of currentState) {
        const nfaTransitions = nfa.delta[nfaState][symbol] || [];
        for (const nfaNextState of nfaTransitions) {
          nextState.push(...epsilonClosure([nfaNextState]));
        }
      }

      if (nextState.length > 0) {
        dfa.delta[currentState] = dfa.delta[currentState] || {};
        dfa.delta[currentState][symbol] = nextState;

        if (!visitedStates.has(nextState) && !stateQueue.includes(nextState)) {
          stateQueue.push(nextState);
        }
      }
    }

    for (const nfaAcceptState of nfa.F) {
      if (currentState.includes(nfaAcceptState)) {
        dfa.F.push(currentState);
        break;
      }
    }
  }
}

console.log("DFA五要素：", dfa);