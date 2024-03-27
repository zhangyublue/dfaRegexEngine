
const OperatorPriority = {
  '*': 4,
  '?': 4,
  '+': 4,
  '.': 3,
  '|': 2,
  '(': 1
}

function regex2post(str) {
  const output = []
  const ops = []

  for (let ch, i = 0, is_last_ch = false, len = str.length; i < len; i++) {
    ch = str[i]

    if (ch === '*' || ch === '?' || ch === '+') {
      pushOperator(ch)
      is_last_ch = true // !
      continue
    }

    if (ch === '|') {
      pushOperator(ch)
      is_last_ch = false
      continue
    }

    if (ch === '(') {
      if (is_last_ch) { // !
        pushOperator('.')
      }
      ops.push(ch)
      is_last_ch = false
      continue
    }

    if (ch === ')') {
      let op
      while (op = ops.pop()) {
        if (op === '(') {
          break
        }
        output.push(op)
      }
      if (op !== '(') {
        throw new Error(`no "(" match ")" at [${i}] of "${str}"`)
      }
      is_last_ch = true
      continue
    }

    if (is_last_ch) {
      pushOperator('.')
    }
    output.push(ch)
    is_last_ch = true
  }

  function pushOperator(op) {
    let top
    const priority = OperatorPriority[op]
    while (top = ops.pop()) {
      if (OperatorPriority[top] >= priority) {
        output.push(top)
      } else {
        ops.push(top)
        break
      }
    }
    ops.push(op)
  }

  let op
  while (op = ops.pop()) {
    if (op === '(') {
      throw new Error(`not matched "(" of "${str}"`)
    }
    output.push(op)
  }

  return output.join('')
}

console.log(regex2post('a'))