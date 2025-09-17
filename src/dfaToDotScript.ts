import { DFAInterface } from './DFA';

// dfa 转化图形配置
export function dfaToDotScript(dfa: DFAInterface): string {
  const initialState = dfa.startState;
  const finalStates = Array.from(dfa.acceptStates).join(", ");

  let result = `
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

  for (const p in dfa.transitions) {
    for (const accept in dfa.transitions[p]) {
      const q = dfa.transitions[p][accept];
      if (q.length > 0) {
        result += `    ${p} -> ${q} [label="${accept}"]\n`;
      }
    }
  }
  result += "}";

  return result;
}
