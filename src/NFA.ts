import { regex2RPN } from "./regex2RPN";
import { State, Transition, NFA } from "./type";

interface Token {
  type: string;
  value: string;
}

class Fragment {
  start: State;
  end: State;

  constructor(startState: State, endState: State) {
    this.start = startState;
    this.end = endState;
  }
}

export interface NFAJSON {
  states: number[];
  alphabet: string[];
  transitions: { [key: string]: { [key: string]: number[] } };
  startState: number;
  acceptStates: number[];
}

// export class NFA {
//   start: number;
//   end: number;
//   state_map: Map<number, State>;
//   transition_map: Map<number, Transition>;

//   constructor() {
//     this.start = -1;
//     this.end = -1;
//     this.state_map = new Map();
//     this.transition_map = new Map();
//   }

  export function toJSON(nfa: NFA): NFAJSON {
    const { start, end, stateMap, transitionMap } = nfa;
    const states = [...stateMap.keys()];
    const alphabet = [
      ...new Set(
        [...transitionMap.values()].map((transition) => transition.input)
      ),
    ];

    const transitions: { [key: string]: { [key: string]: number[] } } = {};
    states.forEach((stateId) => {
      const stateTransitions: { [key: string]: number[] } = {};
      transitionMap.forEach((transition) => {
        if (transition.from === stateId) {
          if (!stateTransitions[transition.input]) {
            stateTransitions[transition.input] = [];
          }
          stateTransitions[transition.input].push(transition.to);
        }
      });
      transitions[stateId] = stateTransitions;
    });

    const acceptStates = end === -1 ? [] : [end];

    return {
      states,
      alphabet,
      transitions,
      startState: start,
      acceptStates,
    };
  }

  export function createFromRegexp(str: string): NFA | null {
    if (!str) return null;
    return createFromPostfixExpression(regex2RPN(str));
  }

  export function createFromPostfixExpression(RPN: Token[]): NFA | null {
    if (!Array.isArray(RPN) || RPN.length === 0) return null;

    let uuidState = 0;
    let uuidTransition = 0;

    const nfa = createNFA();
    const { stateMap, transitionMap } = nfa;


    function newState(): State {
      const state = createState(uuidState++);
      stateMap.set(state.id, state);
      return state;
    }

    function newTransition(
      fromState: State,
      toState: State,
      input: string = "ε"
    ): Transition {
      const transition = createTransition(
        {
          id: uuidTransition++,
          from: fromState.id,
          to: toState.id,
          input,
        }
      );
      fromState.transitions.push(transition.id);
      transitionMap.set(transition.id, transition);
      return transition;
    }

    const fragStack: Fragment[] = [];

    for (let token: Token, i = 0, len = RPN.length; i < len; i++) {
      token = RPN[i];
      if (token.type === "CHARACTER" || token.type === "OPERATOR") {
        switch (token.value) {
          case "|":
            {
              const f2 = fragStack.pop()!;
              const f1 = fragStack.pop()!;
              const start = newState();
              const end = newState();

              newTransition(start, f1.start);
              newTransition(start, f2.start);
              newTransition(f1.end, end);
              newTransition(f2.end, end);

              fragStack.push(createFragment(start, end));
            }
            break;
          case ".":
            {
              const f2 = fragStack.pop()!;
              const f1 = fragStack.pop()!;

              f2.start.transitions.forEach((transition_id) => {
                const transition = transitionMap.get(transition_id);
                if (transition) {
                  transition.from = f1.end.id;
                  f1.end.transitions.push(transition_id);
                }
              });

              stateMap.delete(f2.start.id);
              fragStack.push(createFragment(f1.start, f2.end));
            }
            break;
          case "*":
            {
              const f = fragStack.pop()!;
              const start = newState();
              const end = newState();

              newTransition(start, f.start);
              newTransition(start, end);
              newTransition(f.end, f.start);
              newTransition(f.end, end);

              fragStack.push(createFragment(start, end));
            }
            break;
          case "?":
            {
              const f = fragStack.pop()!;
              const start = newState();
              const end = newState();

              newTransition(start, f.start);
              newTransition(start, end);
              newTransition(f.end, end);

              fragStack.push(createFragment(start, end));
            }
            break;
          case "+":
            {
              const f = fragStack.pop()!;
              const start = newState();
              const end = newState();

              newTransition(start, f.start);
              newTransition(f.end, f.start);
              newTransition(f.end, end);

              fragStack.push(createFragment(start, end));
            }
            break;
          default:
            {
              const start = newState();
              const end = newState();

              newTransition(start, end, token.value);
              fragStack.push(createFragment(start, end));
            }
            break;
        }
      }
    }

    const frag = fragStack.pop();
    if (frag) {
      nfa.start = frag.start.id;
      nfa.end = frag.end.id;
    }
    return nfa;
  } 
// }

export function nfaToDfa(nfa: NFAJSON): any {
  return nfa;
}

export function createState(id: number): State {
  return {
    id,
    transitions: [],
  };
}

export function createTransition({
  id,
  from,
  to,
  input,
}: {
  id: number;
  from: number;
  to: number;
  input: string;
}): Transition {
  return {
    id,
    from,
    to,
    input,
  };
}

export function createFragment(start: State, end: State): Fragment {
  return {
    start,
    end,
  };
}

export function createNFA(): NFA {
  return {
    start: -1,
    end: -1,
    stateMap: new Map(),
    transitionMap: new Map(),
  };
}
