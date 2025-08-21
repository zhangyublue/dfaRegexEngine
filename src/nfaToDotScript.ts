import { NFAJSON } from './NFA';

// nfa 转化图形配置
export function nfaToDotScript(nfa: NFAJSON): string {
  const initialState = nfa.startState;
  const finalState = nfa.acceptStates;

  let result = `
digraph nondeterministic_finite_automaton {
  rankdir = LR;
  node [shape = circle]; ${initialState};
  node [shape = doublecircle]; ${finalState};
  node [shape = plaintext];
  "" -> ${initialState} [label = "start"];
  node [shape = circle];
`;

  for (const p in nfa.transitions) {
    const node = nfa.transitions[p];
    for (const accept in node) {
      for (const i in node[accept]) {
        const q = node[accept][i];
        result += `    ${p} -> ${q} [label="${accept}"]\n`;
      }
    }
  }
  result += "}";

  return result;
}
