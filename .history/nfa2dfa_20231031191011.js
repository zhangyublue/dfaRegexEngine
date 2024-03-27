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
// const nfa = {
//   states: [0, 1, 2],
//   alphabet: ["a", "b"],
//   transitions: {
//     0: { a: [1], b: [1] },
//     1: { b: [2], a: [1] },
//     2: {}
//   },
//   startState: 0,
//   acceptStates: [1, 2],
// };

// // 计算 ε 闭包
// function epsilonClosure(nfa, states) {
//   const stack = states.slice();
//   const epsilonClosureSet = new Set(states);

//   while (stack.length > 0) {
//     const currentState = stack.pop();

//     if (
//       nfa.transitions[currentState][""] &&
//       nfa.transitions[currentState][""].length > 0
//     ) {
//       const epsilonTransitions = nfa.transitions[currentState][""];
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

// // 计算 move 操作
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

// // 使用子集法构建 DFA，考虑 move 操作和 ε 闭包
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
//     return states.sort().join(",");
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
//       const epsilonNextNFAStates = epsilonClosure(nfa, nextNFAStates);

//       const nextStateKey = getStateKey(epsilonNextNFAStates);

//       if (!nfaStatesSet.has(nextStateKey)) {
//         nfaStatesSet.add(nextStateKey);
//         nfaStatesQueue.push(epsilonNextNFAStates);
//       }

//       if (!dfa.transitions[currentDFAStateKey]) {
//         dfa.transitions[currentDFAStateKey] = {};
//       }
//       dfa.transitions[currentDFAStateKey][symbol] = nextStateKey;
//     });
//   }

//   return dfa;
// }

// // 使用子集法构建 DFA，考虑 move 操作和 ε 闭包
// const dfa = nfaToDfaWithMoveAndEpsilonClosure(nfa);
// console.log("DFA:", dfa);

// 定义NFA的五要素，包括ε转移
// const nfa = {
//   states: [0, 1, 2],
//   alphabet: ["a", "b"],
//   transitions: {
//     0: { "": [1] }, // ε转移
//     1: { "": [2] }, // ε转移
//     2: { a: [2], b: [2] },
//   },
//   startState: 0,
//   acceptStates: [2],
// };

// // 计算ε闭包
// function epsilonClosure(nfa, states) {
//   const stack = states.slice();
//   const epsilonClosureSet = new Set(states);

//   while (stack.length > 0) {
//     const currentState = stack.pop();

//     if (
//       nfa.transitions[currentState][""] &&
//       nfa.transitions[currentState][""].length > 0
//     ) {
//       const epsilonTransitions = nfa.transitions[currentState][""];
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

// // 使用子集法构建DFA，考虑ε闭包
// function nfa2Dfa(nfa) {
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
//     return states.sort().join(",");
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
//       const nextNFAStates = [];

//       currentNFAStates.forEach((nfaState) => {
//         if (nfa.transitions[nfaState][symbol]) {
//           nextNFAStates.push(...nfa.transitions[nfaState][symbol]);
//         }
//       });

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

// 使用子集法构建DFA，考虑ε闭包
// const dfa = nfa2Dfa(nfa);
// console.log("DFA:", dfa);

// class NFAState {
//   constructor(label) {
//     this.label = label;
//     this.transitions = {};
//   }

//   addTransition(symbol, targetState) {
//     if (!this.transitions[symbol]) {
//       this.transitions[symbol] = [];
//     }
//     this.transitions[symbol].push(targetState);
//   }
// }

// class NFA {
//   constructor() {
//     this.startState = null;
//     this.acceptState = null;
//   }

//   setStartState(state) {
//     this.startState = state;
//   }

//   setAcceptState(state) {
//     this.acceptState = state;
//   }
// }

// function thompsonRegexToNFA(regex) {
//   const stack = [];
//   for (let i = 0; i < regex.length; i++) {
//     const char = regex[i];
//     if (char === "(") {
//       stack.push(char);
//     } else if (char === "|") {
//       stack.push(char);
//     } else if (char === ")") {
//       while (stack.length > 0 && stack[stack.length - 1] !== "(") {
//         handleOperator(stack.pop());
//       }
//       stack.pop(); // Pop the opening '('
//     } else if (char === "*") {
//       handleOperator(char);
//     } else {
//       handleSymbol(char);
//     }
//   }

//   while (stack.length > 0) {
//     handleOperator(stack.pop());
//   }

//   return stack.pop();

//   function handleOperator(operator) {
//     if (operator === "|") {
//       const nfa2 = stack.pop();
//       const nfa1 = stack.pop();
//       const startState = new NFAState("S");
//       const acceptState = new NFAState("E");
//       startState.addTransition("ε", nfa1.startState);
//       startState.addTransition("ε", nfa2.startState);
//       nfa1.acceptState.addTransition("ε", acceptState);
//       nfa2.acceptState.addTransition("ε", acceptState);
//       const newNFA = new NFA();
//       newNFA.setStartState(startState);
//       newNFA.setAcceptState(acceptState);
//       stack.push(newNFA);
//     } else if (operator === "*") {
//       const nfa = stack.pop();
//       const startState = new NFAState("S");
//       const acceptState = new NFAState("E");
//       startState.addTransition("ε", nfa.startState);
//       startState.addTransition("ε", acceptState);
//       nfa.acceptState.addTransition("ε", nfa.startState);
//       nfa.acceptState.addTransition("ε", acceptState);
//       const newNFA = new NFA();
//       newNFA.setStartState(startState);
//       newNFA.setAcceptState(acceptState);
//       stack.push(newNFA);
//     }
//   }

//   function handleSymbol(symbol) {
//     const startState = new NFAState("S");
//     const acceptState = new NFAState("E");
//     startState.addTransition(symbol, acceptState);
//     const newNFA = new NFA();
//     newNFA.setStartState(startState);
//     newNFA.setAcceptState(acceptState);
//     stack.push(newNFA);
//   }
// }

// const regex = "(a|b)*abb";
// const result = thompsonRegexToNFA(regex);

// console.log(nfa);



/**
 * @property {number} id
 * @property {Transiton[]} transitions
 */
class State {
  /**
   * @constructor
   * @param {number} id 
   */
  constructor(id) {
    this.id = id
    this.transitions = []
  }
}

/**
 * @property {number} id
 * @property {number} from - from state's id
 * @property {number} to - to state's id
 * @property {string} input - input char
 */
class Transiton {
  /**
   * @constructor
   * @param {number} id
   * @param {number} fromStateId
   * @param {number} toStateId
   * @param {string} input 
   */
  constructor(id, fromStateId, toStateId, input) {
    this.id = id
    this.from = fromStateId
    this.to = toStateId
    this.input = input
  }
}

/**
 * @property {State} start - start state
 * @property {State} end - end state
 */
class Fragment {
  /**
   * @constructor
   * @param {State} startState 
   * @param {State} endState 
   */
  constructor(startState, endState) {
    this.start = startState
    this.end = endState
  }
}

/**
 * @property {number} start - start state's id
 * @property {number} end - end state's id
 * @property {Map<number, State>} state_map
 * @property {Map<number, Transiton>} transition_map
 */
class NFA {
  constructor() {
    this.start = -1
    this.end = -1
    this.state_map = new Map()
    this.transition_map = new Map()
  }

  toJSON() {
    const {start, end, state_map, transition_map} = this
    function map2array(map) {
      const array = []
      for (let entry of map) {
        array.push(entry)
      }
      return array
    }
    return {
      start,
      end,
      state_map: map2array(state_map),
      transition_map: map2array(transition_map)
    }
  }

  travel(callback) {
    const traveled = new Map()
    const {state_map, transition_map} = this
    
    nextState(this.start)

    function nextState(id) {
      if (traveled[id]) return

      let state = state_map.get(id)
      if (!state) return

      traveled[id] = true

      callback(state)
      const transitions = state.transitions
      if (!transitions) return

      let t = transition_map.get(transitions[0])
      if (!t) return
      nextState(t.to)

      t = transition_map.get(transitions[1])
      if (!t) return
      nextState(t.to)
    }
  }

  static createFromRegexp() {
    return NFA.createFromPostfixExpression('ab.mn.|cd.ef.gh.ig.kl.|||||')
  }

  static createFromPostfixExpression(str) {
    if (typeof str !== 'string') return null

    let uuid_state = 0
    let uuid_transition = 0

    const nfa = new NFA()
    const {state_map, transition_map} = nfa

    function newState() {
      const state = new State(uuid_state++)
      state_map.set(state.id, state)
      return state
    }
  
    function newTransition(fromState, toState, input = '') {
      const transition = new Transiton(uuid_transition++, fromState.id, toState.id, input)
      fromState.transitions.push(transition.id)
      transition_map.set(transition.id, transition)
      return transition
    }

    const frag_stack = []

    for (let ch, i = 0, len = str.length; i < len; i++) {
      ch = str[i]
      switch(ch) {
        case '|':
          {
            const f2 = frag_stack.pop()
            const f1 = frag_stack.pop()
            const start = newState()
            const end = newState()

            newTransition(start, f1.start)
            newTransition(start, f2.start)
            newTransition(f1.end, end)
            newTransition(f2.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break
        case '.':
          {
            const f2 = frag_stack.pop()
            const f1 = frag_stack.pop()

            // use f1.end replace f2.start
            // change the from state of all f2.start.transitions to f1.end
            f2.start.transitions.forEach((transition_id) => {
              const transition = transition_map.get(transition_id)
              transition.from = f1.end.id
              f1.end.transitions.push(transition_id)
            })

            // delete f2.start
            state_map.delete(f2.start.id)

            frag_stack.push(new Fragment(f1.start, f2.end))
          }
          break
        case '*':
          {
            const f = frag_stack.pop()
            const start = newState()
            const end = newState()

            newTransition(start, f.start)
            newTransition(start, end)
            newTransition(f.end, f.start)
            newTransition(f.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break;
        case '?':
          {
            const f = frag_stack.pop()
            const start = newState()
            const end = newState()

            newTransition(start, f.start)
            newTransition(start, end)
            newTransition(f.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break
        case '+':
          {
            const f = frag_stack.pop()
            const start = newState()
            const end = newState()

            newTransition(start, f.start)
            newTransition(f.end, f.start)
            newTransition(f.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break
        default:
          {
            const start = newState()
            const end = newState()

            newTransition(start, end, ch)

            frag_stack.push(new Fragment(start, end))
          }
          break
      }
    }

    const frag = frag_stack.pop()
    nfa.start = frag.start.id
    nfa.end = frag.end.id
    return nfa
  }
}

console.log(NFA.createFromRegexp());

