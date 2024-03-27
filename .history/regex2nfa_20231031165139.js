
const OperatorPriority = {
  '*': 4,
  '?': 4,
  '+': 4,
  '.': 3,
  '|': 2,
  '(': 1
}

function regex2post(str) {
  // 逆波兰式表达式输出结果
  const output = []
  // 操作符栈
  const operators = []

  for (let character, i = 0, isLastCharacter = false, len = str.length; i < len; i++) {
    character = str[i]

    if (character === '*' || character === '?' || character === '+') {
      pushOperator(character)
      isLast_character = true
      continue
    }

    if (character === '|') {
      pushOperator(character)
      isLastCharacter = false
      continue
    }

    if (character === '(') {
      if (isLastCharacter) {
        pushOperator('.')
      }
      operators.push(character)
      isLastCharacter = false
      continue
    }

    if (character === ')') {
      let op
      while (op = operators.pop()) {
        if (op === '(') {
          break
        }
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
      if (OperatorPriority[top] >= priority) {
        output.push(top)
      } else {
        operators.push(top)
        break
      }
    }
    operators.push(op)
  }

  let op
  while (op = operators.pop()) {
    if (op === '(') {
      throw new Error(`not matcharactered "(" of "${str}"`)
    }
    output.push(op)
  }

  return output.join('')
}

console.log(regex2post('(ab|mn)|(cd|(ef|(gh|(ig|kl))))'))