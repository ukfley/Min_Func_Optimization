// optimizationsMethods.test.js

const axios = require('axios');
const { wrapInSandbox } = require('./sandboxWrapper');

const baseUrl = 'http://localhost:3000'; // Update with your server URL and port
const epsilon = 0.01; // Adjust based on the precision you expect

const singleVariableTestCases = [
  {
    name: 'Quadratic Function',
    func: "x => (x - 3) ** 2",
    left: 0,
    right: 6,
    start: [0, 0],
    n: 20,
    expectedMin: 3
  },
  {
    name: 'Cubic Function',
    func: "x => (x - 1) ** 3 - (x - 1)",
    left: -2,
    right: 3,
    start: [-2, 0],
    n: 20,
    expectedMin: -2
  },
  {
    name: 'Trigonometric Function',
    func: "x => Math.sin(x) + 0.5",
    left: -6.28318530718, // -2π
    right: 6.28318530718, // 2π
    start: [0, 0],
    n: 20,
    expectedMin: -1.57079632679 // Near -π/2
  },
  {
    name: 'Exponential Function',
    func: "x => Math.exp(x) - 2 * x",
    left: -2,
    right: 2,
    start: [0, 0],
    n: 20,
    expectedMin: 0.69314718056 // Natural logarithm of 2
  },
  {
    name: 'Absolute Value Function',
    func: "x => Math.abs(x - 2)",
    left: 0,
    right: 4,
    start: [0, 0],
    n: 20,
    expectedMin: 2
  },
  {
    name: 'Polynomial Function',
    func: "x => x ** 4 - 14 * x ** 3 + 60 * x ** 2 - 70 * x",
    left: -1,
    right: 2,
    start: [0, 0],
    n: 20,
    expectedMin: 0.78 // There are multiple minima, one is near x = 0
  }
];


const singleVariableMethods = ['dichotomy', 'golden-section', 'fibonacci'];

describe('Single Variable Optimization Method Tests', () => {
  singleVariableTestCases.forEach(testCase => {
    singleVariableMethods.forEach(method => {
      test(`${testCase.name} using ${method}`, async () => {
        const response = await axios.post(`${baseUrl}/${method}`, {
          func: testCase.func,
          left: testCase.left,
          right: testCase.right,
          start: testCase.start,
          n: testCase.n,
          epsilon
        });

        expect(response.status).toBe(200);
        expect(response.data.result).toBeDefined();
        expect(response.data.result).toBeCloseTo(testCase.expectedMin, 2);
      });
    });
  });
});
