function DFA({ alphabet, states, startState, acceptStates, transitions }) {
  this.alphabet = alphabet;
  this.states = states;
  this.startState = startState;
  this.acceptStates = acceptStates;
  this.transitions = transitions;
}


function nfaToDfa(nfa) {
  // 初始化 DFA
  const dfa = {
    alphabet: nfa.alphabet,
    states: [],
    startState: null,
    acceptStates: [],
    transitions: {},
  };

  // 将 NFA 的开始状态 ε-闭包作为 DFA 的初始状态
  const startState = epsilonClosure(nfa, [nfa.startState]);
  dfa.startState = startState.sort((a, b) => a - b).toString();

  // 将所有未使用的状态标记为已使用
  const usedStates = new Set();
  usedStates.add(startState.sort((a, b) => a - b).join(",")); // 将状态集合转换为字符串

  // 队列用于存储待处理的状态
  const queue = [startState];

  // 循环处理队列中的状态
  while (queue.length) {
    const state = queue.shift();

    // 将当前状态添加到 DFA 的状态列表中
    dfa.states.push(state.sort((a, b) => a - b).join(","));

    // 遍历输入符号
    for (const symbol of nfa.alphabet) {
      if (symbol === "ε") continue;
      // 计算当前状态在输入符号下的下一个状态
      const moveRes = move(nfa, state, symbol);
      const nextState = epsilonClosure(nfa, moveRes)
        .filter((item) => item !== undefined)
        .sort((a, b) => a - b);

      // 将下一个状态转换为字符串
      const nextStateStr = nextState.toString();

      // 如果下一个状态未被使用，则将其添加到队列中
      if (nextState.length && !usedStates.has(nextStateStr)) {
        usedStates.add(nextStateStr);
        queue.push(nextState);
      }

      // 将当前状态和输入符号下的下一个状态添加到 DFA 的转移表中
      dfa.transitions[state] = dfa.transitions[state] || {};
      dfa.transitions[state][symbol] = nextStateStr;
    }
  }

  // 将 DFA 的接受状态设置为包含 NFA 接受状态的任何状态
  dfa.acceptStates = dfa.states.filter((state) => {
    for (const acceptState of nfa.acceptStates) {
      if (state.split(",").includes(acceptState + "")) {
        return true;
      }
    }
    return false;
  });

  const newDfa = {
    alphabet: dfa.alphabet,
    states: [],
    startState: null,
    acceptStates: [],
    transitions: {},
  };

  dfa.states.forEach((state, index) => {
    dfa.acceptStates.forEach((acceptState, acceptStateIndex) => {
      if (acceptState === state) {
        newDfa.acceptStates[acceptStateIndex] = index.toString();
      }
    });
    if (state === dfa.startState) {
      newDfa.startState = index.toString();
    }
    newDfa.states[index] = index.toString();
    Object.keys(dfa.transitions).forEach((key) => {
      if (key === state) {
        newDfa.transitions[index] = dfa.transitions[key];
      }
    });
  });

  dfa.states.forEach((state, index) => {
    Object.keys(newDfa.transitions).forEach((key) => {
      if (newDfa.transitions[key]) {
        Object.keys(newDfa.transitions[key]).forEach((innerKey) => {
          if (newDfa.transitions[key][innerKey] === state) {
            newDfa.transitions[key][innerKey] = index.toString();
          }
        });
      }
    });
  });

  return newDfa;
}

// 计算 NFA 状态的 ε-闭包
function epsilonClosure(nfa, states) {
  const closure = new Set(states);
  // 递归遍历所有 ε-迁移
  for (const state of states) {
    if (nfa.transitions[state]) {
      for (const nextState of nfa.transitions[state].ε || []) {
        if (!closure.has(nextState)) {
          closure.add(nextState);
          const next = epsilonClosure(nfa, [nextState]);
          next.forEach((item) => closure.add(item));
        }
      }
    }
  }
  return Array.from(closure);
}

// 计算 NFA 状态在输入符号下的下一个状态
function move(nfa, states, symbol) {
  const nextStates = new Set();
  for (const state of states) {
    if (nfa.transitions[state]) {
      nextStates.add(...(nfa.transitions[state][symbol] || []));
    }
  }
  return Array.from(nextStates);
}

function getDfaState(dfa, nfaStates) {
  const nfaStateStr = nfaStates.join(",");
  if (dfa.transitions.hasOwnProperty(nfaStateStr)) {
    return nfaStateStr;
  }
  dfa.states.push(nfaStateStr);
  dfa.transitions[nfaStateStr] = {};
  for (const symbol of dfa.alphabet) {
    dfa.transitions[nfaStateStr][symbol] = [];
  }
  return nfaStateStr;
}

function split(partition, dfa) {
  // 1. 初始化
  const subsetA = [];
  const subsetB = [];

  // 2. 遍历分区中的所有状态
  for (const state of partition) {
    // 3. 对于每个状态，计算其在每个输入符号下的后继状态
    const nextStates = dfa.getNextStates(state);

    // 4. 将状态分配给相应的子分区
    if (nextStates.some((nextState) => partition.includes(nextState))) {
      subsetA.push(state);
    } else {
      subsetB.push(state);
    }
  }

  return [subsetA, subsetB];
}