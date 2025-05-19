const screen = document.getElementById('display-screen');
const buttons = document.querySelectorAll('.btn');
const clearBtn = document.getElementById('clear-btn');
const equalsBtn = document.getElementById('equals');

let expression = '';

// Handle number/operator input
buttons.forEach(button => {
  button.addEventListener('click', () => {
    expression += button.dataset.key;
    screen.value = expression;
  });
});

// Clear screen
clearBtn.addEventListener('click', () => {
  expression = '';
  screen.value = '';
});

// Evaluate expression on "=" click
equalsBtn.addEventListener('click', () => {
  try {
    const result = evaluateExpression(expression);
    screen.value = result;
    expression = result.toString();
  } catch (error) {
    screen.value = 'Error';
    expression = '';
  }
});

// Operator precedence
const precedence = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2
};

// Check if char is operator
function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

// Convert infix to postfix
function toPostfix(expr) {
  const output = [];
  const operators = [];
  let number = '';

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];

    if (!isNaN(char) || char === '.') {
      number += char;
    } else if (isOperator(char)) {
      if (number) {
        output.push(number);
        number = '';
      }

      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[char]
      ) {
        output.push(operators.pop());
      }

      operators.push(char);
    }
  }

  if (number) output.push(number);
  while (operators.length) output.push(operators.pop());

  return output;
}

// Evaluate postfix expression
function evaluatePostfix(postfix) {
  const stack = [];

  postfix.forEach(token => {
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();

      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
        default: throw new Error('Invalid operator');
      }
    }
  });

  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

// Main evaluation function
function evaluateExpression(expr) {
  const postfix = toPostfix(expr);
  return evaluatePostfix(postfix);
}
