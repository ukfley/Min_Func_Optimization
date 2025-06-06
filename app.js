//app.js
const express = require('express');
const cors = require('cors');
const {
  dichotomyMethod,
  goldenSectionMethod,
  fibonacciMethod,
  gradientDescentConstantStep,
  gradientDescentVariableStep,
  steepestDescent,
  conjugateGradientFR,
  newtonMethod,
  dfpMethod,
  marquardtMethod,
} = require('./optimizationMethods');
const { wrapInSandbox } = require('./sandboxWrapper');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const normalizeNumber = (value) => {
  if (typeof value === 'string') {
    return parseFloat(value.replace(',', '.'));
  }
  return parseFloat(value);
};

if (typeof normalizeNumber !== 'function') {
  throw new Error('normalizeNumber не визначена. Переконайтеся, що вона включена в код.');
}

// Загальний обробник для методів
const handleOptimizationRequest = (method, requiredParams) => (req, res) => {
  const params = {};
  try {
    // Витягуємо параметри з body
    for (const param of requiredParams) {
      params[param] = req.body[param];
    }

    console.log(`Запит на ${method.name}:`, params);

    // Перевірка, чи func є рядком
    if (!params.func || typeof params.func !== 'string') {
      throw new Error('Функція має бути непорожнім рядком');
    }

    // Нормалізуємо initialX, якщо він є
    let initialXNum = [];
    if (requiredParams.includes('initialX')) {
      initialXNum = Array.isArray(params.initialX) ? params.initialX.map(val => normalizeNumber(val)) : [];
      if (initialXNum.length === 0 || initialXNum.some(isNaN)) {
        throw new Error('initialX має бути масивом чисел');
      }
      params.initialX = initialXNum;
    }

    // Визначаємо, чи це одномірна функція (univariate) чи багатовимірна (multivariate)
    const isUnivariate = !requiredParams.includes('initialX'); // Одномірні методи: dichotomy, golden-section, fibonacci

    // Валідація функції через wrapInSandbox
    const callableFunc = validateAndWrapFunction(params.func, initialXNum, isUnivariate);

    // Нормалізуємо інші параметри
    if ('step' in params) params.step = normalizeNumber(params.step);
    if ('initialStep' in params) params.initialStep = normalizeNumber(params.initialStep);
    if ('lambda' in params) params.lambda = normalizeNumber(params.lambda);
    if ('epsilon' in params) params.epsilon = normalizeNumber(params.epsilon);
    if ('maxIterations' in params) params.maxIterations = parseInt(params.maxIterations, 10);
    if ('left' in params) params.left = normalizeNumber(params.left);
    if ('right' in params) params.right = normalizeNumber(params.right);
    if ('n' in params) params.n = parseInt(params.n, 10);

    // Перевірка коректності параметрів
    if ('step' in params && (isNaN(params.step) || params.step <= 0 || params.step > 1)) {
      throw new Error('step має бути позитивним числом ≤ 1');
    }
    if ('initialStep' in params && (isNaN(params.initialStep) || params.initialStep <= 0 || params.initialStep > 1)) {
      throw new Error('initialStep має бути позитивним числом ≤ 1');
    }
    if ('lambda' in params && (isNaN(params.lambda) || params.lambda <= 0)) {
      throw new Error('lambda має бути позитивним числом');
    }
    if ('epsilon' in params && (isNaN(params.epsilon) || params.epsilon <= 0 || params.epsilon > 1)) {
      throw new Error('epsilon має бути позитивним числом ≤ 1');
    }
    if ('maxIterations' in params && (isNaN(params.maxIterations) || params.maxIterations <= 0)) {
      throw new Error('maxIterations має бути позитивним цілим числом');
    }
    if ('left' in params && 'right' in params && (isNaN(params.left) || isNaN(params.right) || params.left >= params.right)) {
      throw new Error('left і right мають бути числами, де left < right');
    }
    if ('n' in params && (isNaN(params.n) || params.n <= 0)) {
      throw new Error('n має бути позитивним цілим числом');
    }

    // Викликаємо метод оптимізації
    const result = method(callableFunc, ...Object.values(params).slice(1));
    console.log(`Результат ${method.name}:`, result);
    res.send({ result });
  } catch (error) {
    console.error(`Помилка ${method.name}:`, error.message, error.stack);
    res.status(500).send({ error: error.message });
  }
};

// Функція для валідації та створення функції через wrapInSandbox
function validateAndWrapFunction(funcStr, initialX, isUnivariate) {
  // Передаємо довжину initialX для багатовимірних функцій, для одномірних передаємо 0
  const initialXLength = isUnivariate ? 0 : initialX.length;

  // Створюємо функцію через wrapInSandbox
  const callableFunc = wrapInSandbox(funcStr, initialXLength);

  // Тестуємо функцію
  const testInput = isUnivariate ? 0 : initialX; // Для одномірних функцій передаємо скаляр, для багатовимірних — масив
  const testValue = callableFunc(testInput);
  if (isNaN(testValue) || !isFinite(testValue)) {
    throw new Error('Функція повертає NaN або не є скінченним числом');
  }

  return callableFunc;
}

// Визначення методів із їхніми параметрами
app.post('/dichotomy', handleOptimizationRequest(dichotomyMethod, ['func', 'left', 'right', 'epsilon']));
app.post('/golden-section', handleOptimizationRequest(goldenSectionMethod, ['func', 'left', 'right', 'epsilon']));
app.post('/fibonacci', handleOptimizationRequest(fibonacciMethod, ['func', 'left', 'right', 'n']));
app.post('/gradient-descent-constant', handleOptimizationRequest(gradientDescentConstantStep, ['func', 'initialX', 'step', 'epsilon', 'maxIterations']));
app.post('/gradient-descent-variable', handleOptimizationRequest(gradientDescentVariableStep, ['func', 'initialX', 'initialStep', 'epsilon', 'maxIterations']));
app.post('/steepest-descent', handleOptimizationRequest(steepestDescent, ['func', 'initialX', 'epsilon', 'maxIterations']));
app.post('/conjugate-gradient', handleOptimizationRequest(conjugateGradientFR, ['func', 'initialX', 'epsilon', 'maxIterations']));
app.post('/newton', handleOptimizationRequest(newtonMethod, ['func', 'initialX', 'epsilon', 'maxIterations']));
app.post('/dfp', handleOptimizationRequest(dfpMethod, ['func', 'initialX', 'epsilon', 'maxIterations']));
app.post('/marquardt', handleOptimizationRequest(marquardtMethod, ['func', 'initialX', 'lambda', 'epsilon', 'maxIterations']));

console.log('Імпортовані методи:', {
  dichotomyMethod: typeof dichotomyMethod,
  goldenSectionMethod: typeof goldenSectionMethod,
  fibonacciMethod: typeof fibonacciMethod,
  gradientDescentConstantStep: typeof gradientDescentConstantStep,
  gradientDescentVariableStep: typeof gradientDescentVariableStep,
  steepestDescent: typeof steepestDescent,
  conjugateGradientFR: typeof conjugateGradientFR,
  newtonMethod: typeof newtonMethod,
  dfpMethod: typeof dfpMethod,
  marquardtMethod: typeof marquardtMethod,
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));