// dfa 转化图形配置
var dfaToDotScript = function (dfa) {
  var initialState = dfa.startState;
  var finalStates = Array.from(dfa.acceptStates).join(", ");

  var result = `
digraph deterministic_finite_automaton {
    rankdir = LR;
`;
  if (!dfa.acceptStates.includes(initialState)) {
    result += `    node [shape = circle]; ${initialState};\n`;
  }
  result += `    node [shape = doublecircle]; ${finalStates};
    node [shape = plaintext];
    "" -> ${initialState} [label = "start"];
    node [shape = circle];
`;

  for (var p in dfa.transitions) {
    for (var accept in dfa.transitions[p]) {
      var q = dfa.transitions[p][accept];
      if (q.length > 0) {
        result += `    ${p} -> ${q} [label="${accept}"]\n`;
      }
    }
  }
  result += "}";

  return result;
};