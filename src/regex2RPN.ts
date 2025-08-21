interface Token {
  type: string;
  value: string;
}

const OperatorPriority: { [key: string]: number } = {
  "\\": 4,
  "*": 4,
  "?": 4,
  "+": 4,
  ".": 3,
  "|": 2,
  "(": 1,
};

// 将正则表达式转化为逆波兰表达式
export function regex2RPN(str: string): Token[] {
  // 逆波兰式表达式输出结果
  const output: Token[] = [];
  // 操作符栈
  const operators: Token[] = [];

  for (
    let character: string, i = 0, isLastCharacter = false, len = str.length;
    i < len;
    i++
  ) {
    character = str[i];

    if (character === "*" || character === "?" || character === "+") {
      pushOperator({
        type: "OPERATOR",
        value: character,
      });
      isLastCharacter = true;
      continue;
    }

    if (character === "|") {
      pushOperator({
        type: "OPERATOR",
        value: character,
      });
      isLastCharacter = false;
      continue;
    }

    if (character === "(") {
      // 如果上一个字符是字母或者右括号，那么就是隐式的连接符
      if (isLastCharacter) {
        pushOperator({
          type: "OPERATOR",
          value: ".",
        });
      }
      operators.push({
        type: "OPERATOR",
        value: character,
      });
      isLastCharacter = false;
      continue;
    }

    if (character === ")") {
      let op: Token | undefined;

      // 将栈顶的操作符弹出，直到遇到左括号
      while ((op = operators.pop())) {
        if (op.value === "(") {
          break;
        }

        // 将左括号前面的操作符弹出加入到输出结果中
        output.push(op);
      }
      if (!op || op.value !== "(") {
        throw new Error(`no "(" match character ")" at [${i}] of "${str}"`);
      }
      isLastCharacter = true;
      continue;
    }

    if (isLastCharacter) {
      pushOperator({
        type: "OPERATOR",
        value: ".",
      });
    }

    output.push({
      type: "CHARACTER",
      value: character,
    });
    isLastCharacter = true;
  }

  function pushOperator(op: Token): void {
    let top: Token | undefined;
    const priority = OperatorPriority[op.value];
    while ((top = operators.pop())) {
      // 如果栈顶的操作符优先级大于等于当前操作符，那么就将栈顶的操作符弹出加入到输出结果中
      if (OperatorPriority[top.value] >= priority) {
        output.push(top);
      } else {
        // 如果栈顶的操作符优先级小于当前操作符，那么就将栈顶的操作符压入栈中
        operators.push(top);
        break;
      }
    }
    operators.push(op);
  }

  // 将剩余的操作符弹出加入到输出结果中
  while (operators.length > 0) {
    const op = operators.pop();
    if (op && op.value !== "(") {
      output.push(op);
    }
  }

  return output;
}
