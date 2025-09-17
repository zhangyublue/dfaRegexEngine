import { NFAJSON } from './NFA';

// DFA 接口定义
export interface DFAInterface {
  alphabet: string[];
  states: string[];
  startState: string;
  acceptStates: string[];
  transitions: { [key: string]: { [key: string]: string } };
}

// DFA 构造函数参数接口
export interface DFAConfig {
  alphabet: string[];
  states: string[];
  startState: string;
  acceptStates: string[];
  transitions: { [key: string]: { [key: string]: string } };
}

// DFA 类
export class DFA implements DFAInterface {
  alphabet: string[];
  states: string[];
  startState: string;
  acceptStates: string[];
  transitions: { [key: string]: { [key: string]: string } };

  constructor(config: DFAConfig) {
    this.alphabet = config.alphabet;
    this.states = config.states;
    this.startState = config.startState;
    this.acceptStates = config.acceptStates;
    this.transitions = config.transitions;
  }

  // 获取状态在给定输入下的下一个状态
  getNextStates(state: string): string[] {
    const nextStates: string[] = [];
    if (this.transitions[state]) {
      Object.values(this.transitions[state]).forEach(nextState => {
        if (nextState && !nextStates.includes(nextState)) {
          nextStates.push(nextState);
        }
      });
    }
    return nextStates;
  }

  // 检查状态是否为接受状态
  isAcceptState(state: string): boolean {
    return this.acceptStates.includes(state);
  }

  // 检查字符串是否被DFA接受
  accepts(input: string): boolean {
    let currentState = this.startState;
    
    for (const symbol of input) {
      if (this.transitions[currentState] && this.transitions[currentState][symbol]) {
        currentState = this.transitions[currentState][symbol];
      } else {
        return false; // 没有有效的转移
      }
    }
    
    return this.isAcceptState(currentState);
  }
}

// NFA 到 DFA 的转换函数
export function nfaToDfa(nfa: NFAJSON): DFAInterface {
  // 初始化 DFA
  const dfa: DFAInterface = {
    alphabet: nfa.alphabet.filter(symbol => symbol !== "ε"),
    states: [],
    startState: "",
    acceptStates: [],
    transitions: {},
  };

  // 将 NFA 的开始状态 ε-闭包作为 DFA 的初始状态
  const startState = epsilonClosure(nfa, [nfa.startState]);
  dfa.startState = startState.sort((a, b) => a - b).toString();

  // 将所有未使用的状态标记为已使用
  const usedStates = new Set<string>();
  usedStates.add(startState.sort((a, b) => a - b).join(",")); // 将状态集合转换为字符串

  // 队列用于存储待处理的状态
  const queue: number[][] = [startState];

  // 循环处理队列中的状态
  while (queue.length > 0) {
    const state = queue.shift()!;

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
      if (nextState.length > 0 && !usedStates.has(nextStateStr)) {
        usedStates.add(nextStateStr);
        queue.push(nextState);
      }

      // 将当前状态和输入符号下的下一个状态添加到 DFA 的转移表中
      const stateStr = state.sort((a, b) => a - b).join(",");
      dfa.transitions[stateStr] = dfa.transitions[stateStr] || {};
      dfa.transitions[stateStr][symbol] = nextStateStr;
    }
  }

  // 将 DFA 的接受状态设置为包含 NFA 接受状态的任何状态
  dfa.acceptStates = dfa.states.filter((state) => {
    for (const acceptState of nfa.acceptStates) {
      if (state.split(",").includes(acceptState.toString())) {
        return true;
      }
    }
    return false;
  });

  const newDfa: DFAInterface = {
    alphabet: dfa.alphabet,
    states: [],
    startState: "",
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
        newDfa.transitions[index.toString()] = dfa.transitions[key];
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
export function epsilonClosure(nfa: NFAJSON, states: number[]): number[] {
  const closure = new Set<number>(states);
  // 递归遍历所有 ε-迁移
  for (const state of states) {
    if (nfa.transitions[state]) {
      for (const nextState of nfa.transitions[state]["ε"] || []) {
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
export function move(nfa: NFAJSON, states: number[], symbol: string): number[] {
  const nextStates = new Set<number>();
  for (const state of states) {
    if (nfa.transitions[state]) {
      const transitions = nfa.transitions[state][symbol] || [];
      transitions.forEach(nextState => nextStates.add(nextState));
    }
  }
  return Array.from(nextStates);
}

// 获取DFA状态（辅助函数）
export function getDfaState(dfa: DFA, nfaStates: number[]): string {
  const nfaStateStr = nfaStates.join(",");
  if (dfa.transitions.hasOwnProperty(nfaStateStr)) {
    return nfaStateStr;
  }
  dfa.states.push(nfaStateStr);
  dfa.transitions[nfaStateStr] = {};
  for (const symbol of dfa.alphabet) {
    dfa.transitions[nfaStateStr][symbol] = "";
  }
  return nfaStateStr;
}

// 分割分区（用于DFA最小化）
export function split(partition: string[], dfa: DFA): [string[], string[]] {
  // 1. 初始化
  const subsetA: string[] = [];
  const subsetB: string[] = [];

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
