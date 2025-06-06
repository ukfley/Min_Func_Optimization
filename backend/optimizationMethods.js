// optimizationMethods.js
const math = require('mathjs');

function numericGradient(func, x, h = 1e-4) {
  const grad = [];
  for (let i = 0; i < x.length; i++) {
    const xPlusH = x.slice();
    const xMinusH = x.slice();
    xPlusH[i] += h;
    xMinusH[i] -= h;
    const fxPlusH = func(xPlusH);
    const fxMinusH = func(xMinusH);
    if (isNaN(fxPlusH) || isNaN(fxMinusH) || !isFinite(fxPlusH) || !isFinite(fxMinusH)) {
      console.error(`Помилка градієнта в координаті ${i}: xPlusH=${xPlusH}, fxPlusH=${fxPlusH}, xMinusH=${xMinusH}, fxMinusH=${fxMinusH}`);
      throw new Error(`Не вдалося обчислити градієнт у координаті ${i}: некоректне значення функції`);
    }
    const gradI = (fxPlusH - fxMinusH) / (2 * h);
    if (isNaN(gradI) || !isFinite(gradI)) {
      console.error(`Помилка градієнта в координаті ${i}: gradI=${gradI}, fxPlusH=${fxPlusH}, fxMinusH=${fxMinusH}, h=${h}`);
      throw new Error(`Не вдалося обчислити градієнт у координаті ${i}: некоректне значення градієнта`);
    }
    grad.push(gradI);
  }
  return math.matrix(grad);
}

function numericHessian(func, x, h = 1e-4) {
  const n = x.length;
  const H = math.zeros(n, n);
  for (let i = 0; i < n; i++) {
    const xPlusH = x.slice();
    const xMinusH = x.slice();
    xPlusH[i] += h;
    xMinusH[i] -= h;
    const gradPlusH = numericGradient(func, xPlusH, h);
    const gradMinusH = numericGradient(func, xMinusH, h);
    for (let j = 0; j < n; j++) {
      const hij = (gradPlusH.get([j]) - gradMinusH.get([j])) / (2 * h);
      if (isNaN(hij) || !isFinite(hij)) {
        console.error(`Помилка гессіана в [${i},${j}]: gradPlusH=${gradPlusH.get([j])}, gradMinusH=${gradMinusH.get([j])}, h=${h}`);
        throw new Error(`Не вдалося обчислити гессіан у [${i},${j}]: некоректне значення`);
      }
      H.set([i, j], hij);
    }
  }
  return H;
}

function dichotomyMethod(func, left, right, epsilon) {
  const delta = epsilon / 2;
  let iterations = 0;
  while ((right - left) / 2 > epsilon) {
    const mid = (right + left) / 2;
    const x1 = mid - delta;
    const x2 = mid + delta;
    const f1 = func(x1);
    const f2 = func(x2);
    if (f1 < f2) {
      right = x2;
    } else {
      left = x1;
    }
    iterations++;
  }
  const x = (left + right) / 2;
  return { x, fx: func(x), iterations };
}

const goldenRatio = (Math.sqrt(5) - 1) / 2;
function goldenSectionMethod(func, left, right, epsilon) {
  left = parseFloat(left);
  right = parseFloat(right);
  epsilon = parseFloat(epsilon);
  if (isNaN(left) || isNaN(right) || isNaN(epsilon) || epsilon <= 0) {
    throw new Error('Некоректні вхідні дані: left, right та epsilon мають бути дійсними позитивними числами');
  }
  if (left > right) {
    [left, right] = [right, left];
  }
  let x1 = right - goldenRatio * (right - left);
  let x2 = left + goldenRatio * (right - left);
  let f1 = func(x1);
  let f2 = func(x2);
  if (isNaN(f1) || isNaN(f2) || f1 === Infinity || f2 === Infinity) {
    throw new Error('Функція повернула некоректні значення (NaN або Infinity)');
  }
  let iterations = 0;
  while ((right - left) > epsilon) {
    if (f1 <= f2) {
      right = x2;
      x2 = x1;
      f2 = f1;
      x1 = right - goldenRatio * (right - left);
      f1 = func(x1);
    } else {
      left = x1;
      x1 = x2;
      f1 = f2;
      x2 = left + goldenRatio * (right - left);
      f2 = func(x2);
    }
    if (isNaN(f1) || isNaN(f2) || f1 === Infinity || f2 === Infinity) {
      throw new Error('Функція повернула некоректні значення під час ітерацій (NaN або Infinity)');
    }
    iterations++;
  }
  const x = (left + right) / 2;
  return { x, fx: func(x), iterations };
}

function fibonacciMethod(func, left, right, n) {
  const fibonacci = [1, 1];
  for (let i = 2; i <= n; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
  }
  let x1 = left + (fibonacci[n - 2] / fibonacci[n]) * (right - left);
  let x2 = left + (fibonacci[n - 1] / fibonacci[n]) * (right - left);
  let f1 = func(x1);
  let f2 = func(x2);
  let iterations = 0;
  for (let i = n; i > 1; i--) {
    if (f1 > f2) {
      left = x1;
      x1 = x2;
      f1 = f2;
      x2 = left + (fibonacci[i - 1] / fibonacci[i]) * (right - left);
      f2 = func(x2);
    } else {
      right = x2;
      x2 = x1;
      f2 = f1;
      x1 = left + (fibonacci[i - 2] / fibonacci[i]) * (right - left);
      f1 = func(x1);
    }
    iterations++;
  }
  const x = (x1 + x2) / 2;
  return { x, fx: func(x), iterations };
}

function gradientDescentConstantStep(func, initialX, step = 0.01, epsilon = 1e-6, maxIterations = 1000) {
  let x = math.matrix(initialX);
  let iterations = 0;
  for (let iter = 0; iter < maxIterations; iter++) {
    const grad = math.matrix(numericGradient(func, x._data));
    const gradNorm = math.norm(grad);
    if (gradNorm < epsilon) {
      break;
    }
    x = math.subtract(x, math.multiply(step, grad));
    iterations++;
  }
  return { x: x._data, fx: func(x._data), iterations };
}

function gradientDescentVariableStep(func, initialX, initialStep = 0.1, epsilon = 1e-6, maxIterations = 1000) {
  let x = math.matrix(initialX);
  let step = initialStep;
  let iterations = 0;
  for (let iter = 0; iter < maxIterations; iter++) {
    const grad = math.matrix(numericGradient(func, x._data));
    const gradNorm = math.norm(grad);
    if (gradNorm < epsilon) {
      break;
    }
    const direction = math.multiply(-step, grad);
    const newX = math.add(x, direction);
    if (func(newX._data) >= func(x._data)) {
      step *= 0.5;
    } else {
      x = newX;
      step *= 1.1;
    }
    iterations++;
  }
  return { x: x._data, fx: func(x._data), iterations };
}

function steepestDescent(func, initialX, epsilon = 1e-6, maxIterations = 1000) {
  let x = math.matrix(initialX);
  let iterations = 0;
  for (let iter = 0; iter < maxIterations; iter++) {
    const grad = math.matrix(numericGradient(func, x._data));
    const gradNorm = math.norm(grad);
    if (gradNorm < epsilon) {
      break;
    }
    const lineSearch = alpha => func(math.add(x, math.multiply(-alpha, grad))._data);
    const alpha = dichotomyMethod(lineSearch, 0, 1, epsilon).x;
    x = math.add(x, math.multiply(-alpha, grad));
    iterations++;
  }
  return { x: x._data, fx: func(x._data), iterations };
}

function conjugateGradientFR(func, initialX, epsilon = 1e-6, maxIterations = 1000) {
  let x = math.matrix(initialX);
  let grad = math.matrix(numericGradient(func, x._data));
  let direction = math.multiply(-1, grad);
  let prevGradNorm2 = math.dot(grad, grad);
  let iterations = 0;
  for (let iter = 0; iter < maxIterations; iter++) {
    if (math.norm(grad) < epsilon) {
      break;
    }
    const lineSearch = alpha => func(math.add(x, math.multiply(alpha, direction))._data);
    const alpha = dichotomyMethod(lineSearch, 0, 1, epsilon).x;
    x = math.add(x, math.multiply(alpha, direction));
    const newGrad = math.matrix(numericGradient(func, x._data));
    const newGradNorm2 = math.dot(newGrad, newGrad);
    const beta = newGradNorm2 / prevGradNorm2;
    direction = math.add(math.multiply(-1, newGrad), math.multiply(beta, direction));
    grad = newGrad;
    prevGradNorm2 = newGradNorm2;
    iterations++;
  }
  return { x: x._data, fx: func(x._data), iterations };
}

function newtonMethod(func, initialX, epsilon = 1e-6, maxIterations = 1000) {
  let x = math.matrix(initialX.slice());
  let iterations = 0;
  while (iterations < maxIterations) {
    const xArray = x._data.slice();
    if (!Array.isArray(xArray) || xArray.some(val => isNaN(val) || !isFinite(val))) {
      throw new Error(`Некоректний вектор x: ${xArray}`);
    }
    const grad = numericGradient(func, xArray);
    const gradNorm = math.norm(grad);
    if (gradNorm < epsilon) {
      return { x: xArray, fx: func(xArray), iterations };
    }
    const H = numericHessian(func, xArray);
    let delta;
    try {
      delta = math.lusolve(H, math.multiply(-1, grad));
      delta = delta._data.map(val => Number(val));
      if (!Array.isArray(delta) || delta.some(val => isNaN(val) || !isFinite(val))) {
        throw new Error(`Некоректний вектор зміщення: ${delta}`);
      }
    } catch (error) {
      throw new Error(`Не вдалося розв’язати систему гессіана: ${error.message}`);
    }
    x = math.matrix(xArray.map((xi, i) => xi + delta[i]));
    const funcValue = func(x._data);
    if (isNaN(funcValue) || !isFinite(funcValue)) {
      throw new Error(`Функція повернула некоректне значення на ітерації ${iterations}`);
    }
    iterations++;
  }
  return { x: x._data, fx: func(x._data), iterations };
}

function dfpMethod(func, initialX, epsilon = 1e-6, maxIterations = 1000) {
  let x = math.matrix(initialX);
  let H = math.identity(initialX.length);
  let grad = math.matrix(numericGradient(func, x._data));
  let iterations = 0;
  for (let iter = 0; iter < maxIterations; iter++) {
    if (math.norm(grad) < epsilon) {
      break;
    }
    const direction = math.multiply(H, math.multiply(-1, grad));
    const lineSearch = alpha => func(math.add(x, math.multiply(alpha, direction))._data);
    const alpha = dichotomyMethod(lineSearch, 0, 1, epsilon).x;
    const s = math.multiply(alpha, direction);
    const xNew = math.add(x, s);
    const gradNew = math.matrix(numericGradient(func, xNew._data));
    const y = math.subtract(gradNew, grad);
    const sT = math.transpose(s);
    const yT = math.transpose(y);
    const denom1 = math.dot(y, s);
    const term1 = math.multiply(math.multiply(s, sT), 1 / denom1);
    const Hy = math.multiply(H, y);
    const yTHy = math.dot(y, Hy);
    const term2 = math.multiply(math.multiply(Hy, math.transpose(Hy)), 1 / yTHy);
    H = math.add(math.subtract(H, term2), term1);
    x = xNew;
    grad = gradNew;
    iterations++;
  }
  return { x: x._data, fx: func(x._data), iterations };
}

function marquardtMethod(func, initialX, lambda = 1, epsilon = 1e-6, maxIterations = 1000) {
  let x = math.matrix(initialX.slice());
  let iterations = 0;
  const n = initialX.length;
  const nu = 2;
  while (iterations < maxIterations) {
    const xArray = x._data.slice();
    if (!Array.isArray(xArray) || xArray.some(val => isNaN(val) || !isFinite(val))) {
      throw new Error(`Некоректний вектор x: ${xArray}`);
    }
    const grad = numericGradient(func, xArray);
    const gradNorm = math.norm(grad);
    if (gradNorm < epsilon) {
      return { x: xArray, fx: func(xArray), iterations };
    }
    const H = numericHessian(func, xArray);
    const lambdaI = math.multiply(lambda, math.identity(n));
    const modifiedH = math.add(H, lambdaI);
    let delta;
    try {
      delta = math.lusolve(modifiedH, math.multiply(-1, grad));
      delta = delta._data.map(val => Number(val));
      if (!Array.isArray(delta) || delta.some(val => isNaN(val) || !isFinite(val))) {
        throw new Error(`Некоректний вектор зміщення: ${delta}`);
      }
    } catch (error) {
      throw new Error(`Не вдалося розв’язати модифіковану систему гессіана: ${error.message}`);
    }
    const newXArray = xArray.map((xi, i) => xi + delta[i]);
    const newFuncValue = func(newXArray);
    if (isNaN(newFuncValue) || !isFinite(newFuncValue)) {
      throw new Error(`Функція повернула некоректне значення на ітерації ${iterations}`);
    }
    const currentFuncValue = func(xArray);
    if (newFuncValue < currentFuncValue) {
      x = math.matrix(newXArray);
      lambda /= nu;
    } else {
      lambda *= nu;
    }
    iterations++;
  }
  return { x: x._data, fx: func(x._data), iterations };
}

module.exports = { 
  dichotomyMethod, 
  goldenSectionMethod, 
  fibonacciMethod,
  gradientDescentConstantStep,
  gradientDescentVariableStep,
  steepestDescent,
  conjugateGradientFR,
  newtonMethod,
  dfpMethod,
  marquardtMethod 
};