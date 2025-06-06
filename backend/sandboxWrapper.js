//sandboxWrapper.js
const { NodeVM } = require('vm2');

const vm = new NodeVM({
  sandbox: { Math: Math },
  require: { external: false, builtin: [] },
  eval: false,
  wasm: false,
  timeout: 1000,
});

const wrapInSandbox = (funcStr, initialXLength) => {
  try {
    if (typeof funcStr !== 'string' || funcStr.trim() === '') {
      throw new Error('Function string must be a non-empty string');
    }
    let safeFuncStr = funcStr.trim();
    console.log('Original function string:', safeFuncStr);

    // Якщо немає явного визначення функції, припускаємо стрілочну функцію з аргументом x
    if (!safeFuncStr.includes('=>') && !safeFuncStr.includes('function')) {
      safeFuncStr = `x => ${safeFuncStr}`;
    }
    console.log('Transformed function string:', safeFuncStr);

    // Виконуємо функцію в сандбоксі з урахуванням аргументу x
    const sandboxedFunction = vm.run(`
      module.exports = (...args) => {
        const x = args[0] || [];
        return (${safeFuncStr.replace('x =>', '')});
      };
    `);

    if (typeof sandboxedFunction !== 'function') {
      throw new Error('Sandbox did not return a valid function');
    }

    // Тестуємо функцію з масивом нулів, відповідним initialXLength
    const testInput = initialXLength !== undefined ? Array(initialXLength).fill(0) : [0, 0, 0];
    console.log('Testing function with input:', testInput);
    const testValue = sandboxedFunction(testInput);
    console.log('Test value returned:', testValue);

    if (isNaN(testValue) || !isFinite(testValue)) {
      throw new Error(`Function test evaluation returned invalid value (testValue=${testValue}, input=${JSON.stringify(testInput)})`);
    }

    if (typeof testValue !== 'number') {
      throw new Error('Function must return a number');
    }

    return (...args) => {
      try {
        const result = sandboxedFunction(...args);
        if (isNaN(result) || !isFinite(result)) {
          throw new Error(`Function evaluation returned invalid value (args=${JSON.stringify(args)}, result=${result})`);
        }
        return result;
      } catch (executionError) {
        console.error(`Sandbox execution error: ${executionError.message}, args=${JSON.stringify(args)}`);
        throw new Error(`Error executing sandboxed function: ${executionError.message}`);
      }
    };
  } catch (error) {
    console.error('Sandbox wrapper error:', error.message, error.stack);
    throw new Error(`Failed to create sandboxed function: ${error.message}`);
  }
};

module.exports = { wrapInSandbox };