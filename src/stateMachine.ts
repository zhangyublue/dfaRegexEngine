import { DFAInterface } from './DFA';

interface StateMachineConfig {
  init: string;
  transitions: Array<{
    from: string;
    name: string;
    to: (str: string) => any;
  }>;
}

interface StateMachine {
  state: string;
  step: (input: string) => void;
}

// 声明全局的StateMachine构造函数
declare global {
  interface Window {
    StateMachine: new (config: StateMachineConfig) => StateMachine;
  }
}

export function getStateMachine(dfa: DFAInterface): StateMachine {
  const stateMachineConfigTransitions: Array<{
    from: string;
    name: string;
    to: (str: string) => any;
  }> = [];

  Object.keys(dfa.transitions).forEach((state, index) => {
    stateMachineConfigTransitions.push({
      from: state,
      name: "step",
      to: function (str: string) {
        if (dfa.transitions[state][str]) {
          return dfa.transitions[state][str];
        }
      },
    });
  });

  return new window.StateMachine({
    init: dfa.startState,
    transitions: stateMachineConfigTransitions,
  });
}
