class State {
  constructor(id) {
    this.id = id;
    this.transitions = [];
  }
}

class Transiton {
  constructor(id, fromStateId, toStateId, input) {
    this.id = id;
    this.from = fromStateId;
    this.to = toStateId;
    this.input = input;
  }
}

class Fragment {
  constructor(startState, endState) {
    this.start = startState;
    this.end = endState;
  }
}

class NFA {
  constructor() {
    this.start = -1;
    this.end = -1;
    this.state_map = new Map();
    this.transition_map = new Map();
  }

  toJSON() {
    const { start, end, state_map, transition_map } = this;
    const states = [...state_map.keys()]; // 收集所有状态的ID
    const alphabet = [
      ...new Set(
        [...transition_map.values()].map((transition) => transition.input)
      ),
    ]; // 收集输入字符作为字母表

    const transitions = {};
    states.forEach((stateId) => {
      const stateTransitions = {};
      transition_map.forEach((transition) => {
        if (transition.from === stateId) {
          if (!stateTransitions[transition.input]) {
            stateTransitions[transition.input] = [];
          }
          stateTransitions[transition.input].push(transition.to);
        }
      });
      transitions[stateId] = stateTransitions;
    });

    const acceptStates = end === -1 ? [] : [end]; // 设置接受状态

    return {
      states,
      alphabet,
      transitions,
      startState: start,
      acceptStates,
    };
  }

  travel(callback) {
    const traveled = new Map();
    const { state_map, transition_map } = this;

    nextState(this.start);

    function nextState(id) {
      if (traveled[id]) return;

      let state = state_map.get(id);
      if (!state) return;

      traveled[id] = true;

      callback(state);
      const transitions = state.transitions;
      if (!transitions) return;

      let t = transition_map.get(transitions[0]);
      if (!t) return;
      nextState(t.to);

      t = transition_map.get(transitions[1]);
      if (!t) return;
      nextState(t.to);
    }
  }

  static createFromRegexp(str) {
    if (!str) return null;
    return NFA.createFromPostfixExpression(regex2RPN(str));
  }

  static createFromPostfixExpression(str) {
    if (typeof str !== "string") return null;

    let uuidState = 0;
    let uuidTransition = 0;

    const nfa = new NFA();
    const { state_map, transition_map } = nfa;

    function newState() {
      const state = new State(uuidState++);
      state_map.set(state.id, state);
      return state;
    }

    function newTransition(fromState, toState, input = "ε") {
      const transition = new Transiton(
        uuidTransition++,
        fromState.id,
        toState.id,
        input
      );
      fromState.transitions.push(transition.id);
      transition_map.set(transition.id, transition);
      return transition;
    }

    const frag_stack = [];

    for (let ch, i = 0, len = str.length; i < len; i++) {
      ch = str[i];
      switch (ch) {
        case "|":
          {
            // 取栈顶的两个片段
            const f2 = frag_stack.pop();
            const f1 = frag_stack.pop();
            // 创建新的开始和结束状态
            const start = newState();
            const end = newState();

            // 将新的开始状态与两个片段的开始状态相连
            newTransition(start, f1.start);
            newTransition(start, f2.start);
            // 将两个片段的结束状态与新的结束状态相连
            newTransition(f1.end, end);
            newTransition(f2.end, end);

            frag_stack.push(new Fragment(start, end));
          }
          break;
        case ".":
          {
            // 取栈顶的两个片段
            const f2 = frag_stack.pop();
            const f1 = frag_stack.pop();

            // 将f1的结束状态与f2的开始状态相连
            f2.start.transitions.forEach((transition_id) => {
              const transition = transition_map.get(transition_id);
              transition.from = f1.end.id;
              f1.end.transitions.push(transition_id);
            });

            // 删除f2的开始状态
            state_map.delete(f2.start.id);

            frag_stack.push(new Fragment(f1.start, f2.end));
          }
          break;
        case "*":
          {
            // 取栈顶的片段
            const f = frag_stack.pop();
            // 创建新的开始和结束状态
            const start = newState();
            const end = newState();

            // 将新的开始状态与片段的开始状态相连
            newTransition(start, f.start);
            // 将片段的结束状态与新的结束状态相连
            newTransition(start, end);
            // 将片段的结束状态与片段的开始状态相连
            newTransition(f.end, f.start);
            // 将片段的结束状态与新的结束状态相连
            newTransition(f.end, end);

            frag_stack.push(new Fragment(start, end));
          }
          break;
        case "?":
          {
            const f = frag_stack.pop();
            const start = newState();
            const end = newState();

            newTransition(start, f.start);
            newTransition(start, end);
            newTransition(f.end, end);

            frag_stack.push(new Fragment(start, end));
          }
          break;
        case "+":
          {
            const f = frag_stack.pop();
            const start = newState();
            const end = newState();

            newTransition(start, f.start);
            newTransition(f.end, f.start);
            newTransition(f.end, end);

            frag_stack.push(new Fragment(start, end));
          }
          break;
        default:
          {
            const start = newState();
            const end = newState();

            newTransition(start, end, ch);

            frag_stack.push(new Fragment(start, end));
          }
          break;
      }
    }

    const frag = frag_stack.pop();
    nfa.start = frag.start.id;
    nfa.end = frag.end.id;
    return nfa;
  }
}
