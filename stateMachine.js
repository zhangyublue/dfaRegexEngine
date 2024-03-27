function getStateMachine(dfa) {
  const stateMachineConfigTransitions = [];

  Object.keys(dfa.transitions).forEach((state, index) => {
    stateMachineConfigTransitions.push({
      from: state,
      name: "step",
      to: function (str) {
        if (dfa.transitions[state][str]) {
          return dfa.transitions[state][str];
        }
      },
    });
  });

  return new StateMachine({
    init: dfa.startState,
    transitions: stateMachineConfigTransitions,
  });
}
