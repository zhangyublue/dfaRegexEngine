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
  states: ['q0', 'q1', 'q2'],
  alphabet: ['0', '1'],
  transitions: {
    'q0': { '0': ['q0'], '1': ['q0', 'q1'] },
    'q1': { '0': ['q2'], '1': ['q2'] },
    'q2': { '0': [], '1': [] }
  },
  startState: 'q0',
  acceptStates: ['q2']
};

// 转换NFA为DFA
function nfaToDfa(nfa) {
  const dfa = {
    states: [],
    alphabet: nfa.alphabet,
    transitions: {},
    startState: nfa.startState,
    acceptStates: []
  };

  const nfaStatesQueue = [nfa.startState];
  const dfaStatesMap = {};

  while (nfaStatesQueue.length > 0) {
    const nfaStateSet = nfaStatesQueue.pop();
    dfaStatesMap[nfaStateSet] = true;
    dfa.states.push(nfaStateSet);

    for (const symbol of nfa.alphabet) {
      const nfaNextStateSet = [];
      for (const nfaState of nfaStateSet) {
        nfaNextStateSet.push(...nfa.transitions[nfaState][symbol]);
      }
      const dfaNextStateSet = Array.from(new Set(nfaNextStateSet));

      if (dfaNextStateSet.length > 0) {
        dfa.transitions[nfaStateSet] = dfa.transitions[nfaStateSet] || {};
        dfa.transitions[nfaStateSet][symbol] = dfaNextStateSet;

        if (!dfaStatesMap[dfaNextStateSet]) {
          nfaStatesQueue.push(dfaNextStateSet);
        }
      }
    }
  }

  for (const dfaState of dfa.states) {
    for (const nfaAcceptState of nfa.acceptStates) {
      if (dfaState.includes(nfaAcceptState)) {
        dfa.acceptStates.push(dfaState);
        break;
      }
    }
  }

  return dfa;
}

const dfa = nfaToDfa(nfa);
console.log(dfa);