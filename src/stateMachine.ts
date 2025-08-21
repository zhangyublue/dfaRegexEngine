import { NFAJSON } from './NFA';

interface StateMachineConfig {
  init: number;
  transitions: Array<{
    from: string;
    name: string;
    to: (str: string) => any;
  }>;
}

interface StateMachine {
  state: number;
  step: (input: string) => void;
}

// 声明全局的StateMachine构造函数
declare global {
  function StateMachine(config: StateMachineConfig): StateMachine;
}

export function getStateMachine(dfa: NFAJSON): StateMachine {
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

  return new (window as any).StateMachine({
    init: dfa.startState,
    transitions: stateMachineConfigTransitions,
  });
}
