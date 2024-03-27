
const OperatorPriority = {
  '*': 4,
  '?': 4,
  '+': 4,
  '.': 3,
  '|': 2,
  '(': 1
}

function regex2RPN(str) {
  // 逆波兰式表达式输出结果
  const output = []
  // 操作符栈
  const operators = []

  for (let character, i = 0, isLastCharacter = false, len = str.length; i < len; i++) {
    character = str[i]

    
    if (character === '*' || character === '?' || character === '+') {
      pushOperator(character)
      isLastCharacter = true
      continue
    }

    if (character === '|') {
      pushOperator(character)
      isLastCharacter = false
      continue
    }

    if (character === '(') {
      // 如果上一个字符是字母或者右括号，那么就是隐式的连接符
      if (isLastCharacter) {
        pushOperator('.')
      }
      operators.push(character)
      isLastCharacter = false
      continue
    }

    if (character === ')') {
      let op

      // 将栈顶的操作符弹出，直到遇到左括号
      while (op = operators.pop()) {
        if (op === '(') {
          break
        }
        
        // 将左括号前面的操作符弹出加入到输出结果中
        output.push(op)
      }
      if (op !== '(') {
        throw new Error(`no "(" matcharacter ")" at [${i}] of "${str}"`)
      }
      isLastCharacter = true
      continue
    }

    if (isLastCharacter) {
      pushOperator('.')
    }
    output.push(character)
    isLastCharacter = true
  }

  function pushOperator(op) {
    let top
    const priority = OperatorPriority[op]
    while (top = operators.pop()) {
      // 如果栈顶的操作符优先级大于等于当前操作符，那么就将栈顶的操作符弹出加入到输出结果中
      if (OperatorPriority[top] >= priority) {
        output.push(top)
      } else {
        // 如果栈顶的操作符优先级小于当前操作符，那么就将栈顶的操作符压入栈中
        operators.push(top)
        break
      }
    }
    operators.push(op)
  }

  let op
  // 将栈中剩余的操作符弹出
  while (op = operators.pop()) {
    if (op === '(') {
      throw new Error(`not matcharactered "(" of "${str}"`)
    }
    output.push(op)
  }

  return output.join('')
}

console.log(regex2RPN('(ab|mn)|(cd|(ef|(gh|(ig|kl))))'))
















/**
 * @property {number} id
 * @property {Transiton[]} transitions
 */
class State {
  /**
   * @constructor
   * @param {number} id 
   */
  constructor(id) {
    this.id = id
    this.transitions = []
  }
}

/**
 * @property {number} id
 * @property {number} from - from state's id
 * @property {number} to - to state's id
 * @property {string} input - input char
 */
class Transiton {
  /**
   * @constructor
   * @param {number} id
   * @param {number} fromStateId
   * @param {number} toStateId
   * @param {string} input 
   */
  constructor(id, fromStateId, toStateId, input) {
    this.id = id
    this.from = fromStateId
    this.to = toStateId
    this.input = input
  }
}

/**
 * @property {State} start - start state
 * @property {State} end - end state
 */
class Fragment {
  /**
   * @constructor
   * @param {State} startState 
   * @param {State} endState 
   */
  constructor(startState, endState) {
    this.start = startState
    this.end = endState
  }
}

/**
 * @property {number} start - start state's id
 * @property {number} end - end state's id
 * @property {Map<number, State>} state_map
 * @property {Map<number, Transiton>} transition_map
 */
class NFA {
  constructor() {
    this.start = -1
    this.end = -1
    this.state_map = new Map()
    this.transition_map = new Map()
  }

  toJSON() {
    const { start, end, state_map, transition_map } = this;
    const states = [...state_map.keys()]; // 收集所有状态的ID
    const alphabet = [...new Set([...transition_map.values()].map(transition => transition.input))]; // 收集输入字符作为字母表

    const transitions = {};
    states.forEach(stateId => {
      const stateTransitions = {};
      transition_map.forEach(transition => {
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
    const traveled = new Map()
    const {state_map, transition_map} = this
    
    nextState(this.start)

    function nextState(id) {
      if (traveled[id]) return

      let state = state_map.get(id)
      if (!state) return

      traveled[id] = true

      callback(state)
      const transitions = state.transitions
      if (!transitions) return

      let t = transition_map.get(transitions[0])
      if (!t) return
      nextState(t.to)

      t = transition_map.get(transitions[1])
      if (!t) return
      nextState(t.to)
    }
  }

  static createFromRegexp(str) {
    if (!str) return null
    return NFA.createFromPostfixExpression(regex2RPN(str))
  }

  static createFromPostfixExpression(str) {
    if (typeof str !== 'string') return null

    let uuidState = 0
    let uuidTransition = 0

    const nfa = new NFA()
    const {state_map, transition_map} = nfa

    function newState() {
      const state = new State(uuidState++)
      state_map.set(state.id, state)
      return state
    }

    function newTransition(fromState, toState, input = '') {
      const transition = new Transiton(uuidTransition++, fromState.id, toState.id, input)
      fromState.transitions.push(transition.id)
      transition_map.set(transition.id, transition)
      return transition
    }

    const frag_stack = []

    for (let ch, i = 0, len = str.length; i < len; i++) {
      ch = str[i]
      switch(ch) {
        case '|':
          {
            // 取栈顶的两个片段
            const f2 = frag_stack.pop()
            const f1 = frag_stack.pop()
            // 创建新的开始和结束状态
            const start = newState()
            const end = newState()

            // 将新的开始状态与两个片段的开始状态相连
            newTransition(start, f1.start)
            newTransition(start, f2.start)
            // 将两个片段的结束状态与新的结束状态相连
            newTransition(f1.end, end)
            newTransition(f2.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break
        case '.':
          {
            // 取栈顶的两个片段
            const f2 = frag_stack.pop()
            const f1 = frag_stack.pop()

            // 将f1的结束状态与f2的开始状态相连
            f2.start.transitions.forEach((transition_id) => {
              const transition = transition_map.get(transition_id)
              transition.from = f1.end.id
              f1.end.transitions.push(transition_id)
            })

            // 删除f2的开始状态
            state_map.delete(f2.start.id)
          
            frag_stack.push(new Fragment(f1.start, f2.end))
          }
          break
        case '*':
          {
            // 取栈顶的片段
            const f = frag_stack.pop()
            // 创建新的开始和结束状态
            const start = newState()
            const end = newState()

            // 将新的开始状态与片段的开始状态相连
            newTransition(start, f.start)
            // 将片段的结束状态与新的结束状态相连
            newTransition(start, end)
            // 将片段的结束状态与片段的开始状态相连
            newTransition(f.end, f.start)
            // 将片段的结束状态与新的结束状态相连
            newTransition(f.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break;
        case '?':
          {
            const f = frag_stack.pop()
            const start = newState()
            const end = newState()

            newTransition(start, f.start)
            newTransition(start, end)
            newTransition(f.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break
        case '+':
          {
            const f = frag_stack.pop()
            const start = newState()
            const end = newState()

            newTransition(start, f.start)
            newTransition(f.end, f.start)
            newTransition(f.end, end)

            frag_stack.push(new Fragment(start, end))
          }
          break
        default:
          {
            const start = newState()
            const end = newState()

            newTransition(start, end, ch)

            frag_stack.push(new Fragment(start, end))
          }
          break
      }
    }

    const frag = frag_stack.pop()
    nfa.start = frag.start.id
    nfa.end = frag.end.id
    return nfa
  }
}

console.log(nfa2Dfa(NFA.createFromRegexp('(ab|mn)|(cd|(ef|(gh|(ig|kl))))').toJSON()));

