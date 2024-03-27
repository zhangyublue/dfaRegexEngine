// nfa 转化图形配置
var nfaToDotScript = function (nfa) {
  var initialState = nfa.startState;
  var finalState = nfa.acceptStates;

  var result = `
digraph nondeterministic_finite_automaton {
  rankdir = LR;
  node [shape = circle]; ${initialState};
  node [shape = doublecircle]; ${finalState};
  node [shape = plaintext];
  "" -> ${initialState} [label = "start"];
  node [shape = circle];
`;

  for (var p in nfa.transitions) {
    var node = nfa.transitions[p];
    for (var accept in node) {
      for (var i in node[accept]) {
        var q = node[accept][i];
        result += `    ${p} -> ${q} [label="${accept}"]\n`;
      }
    }
  }
  result += "}";

  return result;
};