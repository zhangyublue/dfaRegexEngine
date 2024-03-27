const OperatorPriority = {
  "\\": 4,
  "*": 4,
  "?": 4,
  "+": 4,
  ".": 3,
  "|": 2,
  "(": 1,
};

// 将正则表达式转化为逆波兰表达式
function regex2RPN(str) {
  // 逆波兰式表达式输出结果
  const output = [];
  // 操作符栈
  const operators = [];

  for (
    let character,
      i = 0,
      isLastCharacter = false,
      len = str.length,
      isEscapeCharacter = false;
    i < len;
    i++
  ) {
    character = str[i];

    if (character === "*" || character === "?" || character === "+") {
      pushOperator(character);
      isLastCharacter = true;
      continue;
    }

    if (character === "|") {
      pushOperator(character);
      isLastCharacter = false;
      isEscapeCharacter = false;
      continue;
    }

    if (character === "(") {
      // 如果上一个字符是字母或者右括号，那么就是隐式的连接符
      if (isLastCharacter) {
        pushOperator(".");
      }
      operators.push(character);
      isLastCharacter = false;
      isEscapeCharacter = false;
      continue;
    }

    if (character === ")") {
      let op;

      // 将栈顶的操作符弹出，直到遇到左括号
      while ((op = operators.pop())) {
        if (op === "(") {
          break;
        }

        // 将左括号前面的操作符弹出加入到输出结果中
        output.push(op);
      }
      if (op !== "(") {
        throw new Error(`no "(" matcharacter ")" at [${i}] of "${str}"`);
      }
      isLastCharacter = true;
      isEscapeCharacter = false;
      continue;
    }

    if (character === "/") {
      output.push(character);
      isLastCharacter = true;
      isEscapeCharacter = true;
      continue;
    }

    if (isLastCharacter) {
      if (isEscapeCharacter) {
        if (character === "d") {
          // output 去掉尾部

          output.pop();
          output.push("1");
          output.push("2");
          output.push("3");
          output.push("4");
          output.push("5");
          output.push("6");
          output.push("7");
          output.push("8");
          output.push("9");
          output.push("0");
          pushOperator("|");
          pushOperator("|");
          pushOperator("|");
          pushOperator("|");
          pushOperator("|");
          pushOperator("|");
          pushOperator("|");
          pushOperator("|");
          pushOperator("|");
        }
        isLastCharacter = true;
        isEscapeCharacter = false;

        continue;
      }
      pushOperator(".");
    }
    output.push(character);
    isLastCharacter = true;
    isEscapeCharacter = false;
  }

  function pushOperator(op) {
    let top;
    const priority = OperatorPriority[op];
    while ((top = operators.pop())) {
      // 如果栈顶的操作符优先级大于等于当前操作符，那么就将栈顶的操作符弹出加入到输出结果中
      if (OperatorPriority[top] >= priority) {
        output.push(top);
      } else {
        // 如果栈顶的操作符优先级小于当前操作符，那么就将栈顶的操作符压入栈中
        operators.push(top);
        break;
      }
    }
    operators.push(op);
  }

  let op;
  // 将栈中剩余的操作符弹出
  while ((op = operators.pop())) {
    if (op === "(") {
      throw new Error(`not matcharactered "(" of "${str}"`);
    }
    output.push(op);
  }

  return output.join("");
}