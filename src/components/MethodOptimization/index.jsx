// src/components/MethodOptimization/index.tsx
'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InputsGroup_1 = require("../Inputs/InputsGroup");
var requests_1 = require("@/utils/api/min-functions/requests");
var defaultUnivariateFunctionTemplates = [
    {
        name: 'Quadratic Function',
        func: "(x - 3) ** 2",
        example: "left: 0, right: 10, epsilon: 0.0001 (Dichotomy, Golden Section) | n: 10 (Fibonacci)",
        expected: "≈ 3"
    },
    {
        name: 'Cubic Function',
        func: "(x - 1) ** 3 - (x - 1)",
        example: "left: -2, right: 5, epsilon: 0.0001 (Dichotomy, Golden Section) | n: 10 (Fibonacci)",
        expected: "≈ 1"
    },
];
var defaultMultivariateFunctionTemplates = [
    {
        name: 'Quadratic nD',
        func: "x => x.reduce((sum, xi) => sum + xi ** 2, 0)",
        example: "initialX: [1, 1, 1], step: 0.1, epsilon: 0.0001, maxIterations: 1000 (Gradient Descent Constant) | lambda: 1 (Marquardt)",
        expected: "≈ [0, 0, 0]"
    },
    {
        name: 'Rosenbrock',
        func: "x => 100 * (x[1] - x[0] ** 2) ** 2 + (1 - x[0]) ** 2",
        example: "initialX: [-1, 1], initialStep: 0.01, epsilon: 0.0001, maxIterations: 10000 (Gradient Descent Variable)",
        expected: "≈ [1, 1]"
    },
];
var MethodOptimization = function () {
    var _a = (0, react_1.useState)('univariate'), functionType = _a[0], setFunctionType = _a[1];
    var _b = (0, react_1.useState)('dichotomy'), selectedMethod = _b[0], setSelectedMethod = _b[1];
    var _c = (0, react_1.useState)(defaultUnivariateFunctionTemplates[0].func), func = _c[0], setFunc = _c[1];
    var _d = (0, react_1.useState)(null), result = _d[0], setResult = _d[1];
    var _e = (0, react_1.useState)(''), customFunctionInput = _e[0], setCustomFunctionInput = _e[1];
    var _f = (0, react_1.useState)(defaultUnivariateFunctionTemplates), univariateFunctionTemplates = _f[0], setUnivariateFunctionTemplates = _f[1];
    var _g = (0, react_1.useState)(defaultMultivariateFunctionTemplates), multivariateFunctionTemplates = _g[0], setMultivariateFunctionTemplates = _g[1];
    var dichotomyInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'left', type: 'number' },
            { name: 'right', type: 'number' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        ]; }, []),
    });
    var goldenSectionInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'left', type: 'number' },
            { name: 'right', type: 'number' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        ]; }, []),
    });
    var fibonacciInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'left', type: 'number' },
            { name: 'right', type: 'number' },
            { name: 'n', type: 'number' },
        ]; }, []),
    });
    var gradientDescentConstantInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
            { name: 'step', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.01' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
            { name: 'maxIterations', type: 'number' },
        ]; }, []),
    });
    var gradientDescentVariableInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
            { name: 'initialStep', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.1' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
            { name: 'maxIterations', type: 'number' },
        ]; }, []),
    });
    var steepestDescentInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
            { name: 'maxIterations', type: 'number' },
        ]; }, []),
    });
    var conjugateGradientInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
            { name: 'maxIterations', type: 'number' },
        ]; }, []),
    });
    var newtonInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
            { name: 'maxIterations', type: 'number' },
        ]; }, []),
    });
    var dfpInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
            { name: 'maxIterations', type: 'number' },
        ]; }, []),
    });
    var marquardtInputs = (0, InputsGroup_1.useInputsGroup)({
        inputs: (0, react_1.useMemo)(function () { return [
            { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
            { name: 'lambda', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '1.0' },
            { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
            { name: 'maxIterations', type: 'number' },
        ]; }, []),
    });
    var methods = {
        dichotomy: requests_1.MinFunctionsAPI.dichotomyMethodRequest,
        'golden-section': requests_1.MinFunctionsAPI.goldenSectionMethodRequest,
        fibonacci: requests_1.MinFunctionsAPI.fibonacciMethodRequest,
        'gradient-descent-constant': requests_1.MinFunctionsAPI.gradientDescentConstantRequest,
        'gradient-descent-variable': requests_1.MinFunctionsAPI.gradientDescentVariableRequest,
        'steepest-descent': requests_1.MinFunctionsAPI.steepestDescentRequest,
        'conjugate-gradient': requests_1.MinFunctionsAPI.conjugateGradientRequest,
        newton: requests_1.MinFunctionsAPI.newtonMethodRequest,
        dfp: requests_1.MinFunctionsAPI.dfpMethodRequest,
        marquardt: requests_1.MinFunctionsAPI.marquardtMethodRequest,
    };
    var inputsGroupProps = {
        dichotomy: dichotomyInputs.__inputsGroupProps,
        'golden-section': goldenSectionInputs.__inputsGroupProps,
        fibonacci: fibonacciInputs.__inputsGroupProps,
        'gradient-descent-constant': gradientDescentConstantInputs.__inputsGroupProps,
        'gradient-descent-variable': gradientDescentVariableInputs.__inputsGroupProps,
        'steepest-descent': steepestDescentInputs.__inputsGroupProps,
        'conjugate-gradient': conjugateGradientInputs.__inputsGroupProps,
        newton: newtonInputs.__inputsGroupProps,
        dfp: dfpInputs.__inputsGroupProps,
        marquardt: marquardtInputs.__inputsGroupProps,
    };
    var inputsData = {
        dichotomy: dichotomyInputs.data,
        'golden-section': goldenSectionInputs.data,
        fibonacci: fibonacciInputs.data,
        'gradient-descent-constant': gradientDescentConstantInputs.data,
        'gradient-descent-variable': gradientDescentVariableInputs.data,
        'steepest-descent': steepestDescentInputs.data,
        'conjugate-gradient': conjugateGradientInputs.data,
        newton: newtonInputs.data,
        dfp: dfpInputs.data,
        marquardt: marquardtInputs.data,
    };
    var getAreInputsValid = function () {
        var data = inputsData[selectedMethod];
        var values = Object.values(data).filter(function (v) { return v !== 'func'; });
        return values.every(function (value) { return value !== '' && value !== undefined; });
    };
    var validateCustomFunction = (0, react_1.useCallback)(function (funcStr) { return __awaiter(void 0, void 0, void 0, function () {
        var testInput, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    testInput = functionType === 'univariate'
                        ? { func: funcStr, left: 0, right: 1, epsilon: 0.1 }
                        : { func: funcStr, initialX: [1, 1, 1], step: 0.1, epsilon: 0.1, maxIterations: 10 };
                    return [4 /*yield*/, methods[functionType === 'univariate' ? 'dichotomy' : 'gradient-descent-constant'](testInput)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    console.error('Custom function validation error:', error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [functionType]);
    var handleAddCustomFunction = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isValid, newTemplate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!customFunctionInput.trim()) {
                        alert('Please enter a function');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, validateCustomFunction(customFunctionInput)];
                case 1:
                    isValid = _a.sent();
                    if (!isValid) {
                        alert("Invalid function. Please ensure it is a valid mathematical expression (e.g., 'x * x' for univariate or 'x => x.reduce((sum, xi) => sum + xi ** 2, 0)' for multivariate)");
                        return [2 /*return*/];
                    }
                    newTemplate = {
                        name: "Custom Function ".concat(functionType === 'univariate' ? univariateFunctionTemplates.length + 1 : multivariateFunctionTemplates.length + 1),
                        func: customFunctionInput,
                        example: functionType === 'univariate'
                            ? 'left: 0, right: 10, epsilon: 0.0001 | n: 10'
                            : 'initialX: [1, 1, 1], step: 0.1, epsilon: 0.0001, maxIterations: 1000',
                        expected: 'Depends on function',
                        isCustom: true,
                    };
                    if (functionType === 'univariate') {
                        setUnivariateFunctionTemplates(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newTemplate], false); });
                    }
                    else {
                        setMultivariateFunctionTemplates(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newTemplate], false); });
                    }
                    setFunc(customFunctionInput);
                    setCustomFunctionInput('');
                    return [2 /*return*/];
            }
        });
    }); };
    var handleOptimize = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, epsilonValue, epsilon, stepKey, stepValue, step, maxIterations, response, error_2, errorMessage;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    data = __assign(__assign({}, inputsData[selectedMethod]), { func: func });
                    if ('epsilon' in data) {
                        epsilonValue = String(data.epsilon);
                        if (epsilonValue.includes(',')) {
                            alert('Please use a dot (.) for decimal numbers in epsilon, e.g., 0.0001 instead of 0,0001.');
                            return [2 /*return*/];
                        }
                        epsilon = parseFloat(epsilonValue);
                        if (isNaN(epsilon) || epsilon <= 0 || epsilon > 1) {
                            alert('Epsilon must be a positive number between 0 and 1 (e.g., 0.0001). Use a dot (.) for decimal numbers.');
                            return [2 /*return*/];
                        }
                        data.epsilon = epsilon;
                    }
                    if ('step' in data || 'initialStep' in data || 'lambda' in data) {
                        stepKey = 'step' in data ? 'step' : 'initialStep' in data ? 'initialStep' : 'lambda';
                        stepValue = String(data[stepKey]);
                        if (stepValue.includes(',')) {
                            alert("Please use a dot (.) for decimal numbers in ".concat(stepKey, ", e.g., ").concat(stepKey === 'lambda' ? '1.0' : '0.1', " instead of ").concat(stepKey === 'lambda' ? '1,0' : '0,1', "."));
                            return [2 /*return*/];
                        }
                        step = parseFloat(stepValue);
                        if (isNaN(step) || step <= 0 || (stepKey !== 'lambda' && step > 1)) {
                            alert("".concat(stepKey.charAt(0).toUpperCase() + stepKey.slice(1), " must be a positive number ").concat(stepKey !== 'lambda' ? 'between 0 and 1 (e.g., 0.1)' : '(e.g., 1.0)', ". Use a dot (.) for decimal numbers."));
                            return [2 /*return*/];
                        }
                        data[stepKey] = step;
                    }
                    if (functionType === 'multivariate' && 'initialX' in data) {
                        if (!Array.isArray(data.initialX)) {
                            try {
                                data.initialX = JSON.parse(String(data.initialX));
                                if (!Array.isArray(data.initialX) || !data.initialX.every(function (val) { return typeof val === 'number' && !isNaN(val); })) {
                                    alert('Invalid initialX format. Please use a JSON array of numbers, e.g., [1, 1, 1]');
                                    return [2 /*return*/];
                                }
                            }
                            catch (e) {
                                alert('Invalid initialX format. Please use a JSON array of numbers, e.g., [1, 1, 1]');
                                return [2 /*return*/];
                            }
                        }
                    }
                    if ('maxIterations' in data) {
                        maxIterations = parseInt(String(data.maxIterations), 10);
                        if (isNaN(maxIterations) || maxIterations <= 0) {
                            alert('maxIterations must be a positive integer (e.g., 10000)');
                            return [2 /*return*/];
                        }
                        data.maxIterations = maxIterations;
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    console.log('Sending optimization request:', { method: selectedMethod, data: data });
                    return [4 /*yield*/, methods[selectedMethod](data)];
                case 2:
                    response = _d.sent();
                    console.log('Optimization response:', response.data);
                    setResult(response.data.result);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _d.sent();
                    errorMessage = ((_b = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || error_2.message || 'Unknown error';
                    console.error('Optimization error details:', {
                        method: selectedMethod,
                        data: data,
                        errorMessage: errorMessage,
                        responseData: (_c = error_2.response) === null || _c === void 0 ? void 0 : _c.data,
                        fullError: error_2,
                    });
                    alert("Optimization failed: ".concat(errorMessage, ". Please check console for details."));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleFunctionTypeChange = function (type) {
        console.log('handleFunctionTypeChange called:', type); // Debug log
        setFunctionType(type);
        setSelectedMethod(type === 'univariate' ? 'dichotomy' : 'gradient-descent-constant');
        setFunc(type === 'univariate' ? univariateFunctionTemplates[0].func : multivariateFunctionTemplates[0].func);
        setResult(null);
    };
    var areInputsValid = getAreInputsValid();
    return (<div className="w-full max-w-screen-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Method Optimization</h1>
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="mb-4">
          <label htmlFor="function-type" className="block text-sm font-medium">Function Type</label>
          <select id="function-type" value={functionType} onChange={function (e) { return handleFunctionTypeChange(e.target.value); }} className="mt-1 w-full rounded-md border-gray-300 p-2">
            <option value="univariate">Univariate</option>
            <option value="multivariate">Multivariate</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="method" className="block text-sm font-medium">Method</label>
          <select id="method" value={selectedMethod} onChange={function (e) { return setSelectedMethod(e.target.value); }} className="mt-1 w-full rounded-md border-gray-300 p-2">
            {functionType === 'univariate' ? (<>
                <option value="dichotomy">Dichotomy</option>
                <option value="golden-section">Golden Section</option>
                <option value="fibonacci">Fibonacci</option>
              </>) : (<>
                <option value="gradient-descent-constant">Gradient Descent (Constant)</option>
                <option value="gradient-descent-variable">Gradient Descent (Variable)</option>
                <option value="steepest-descent">Steepest Descent</option>
                <option value="conjugate-gradient">Conjugate Gradient</option>
                <option value="newton">Newton</option>
                <option value="dfp">DFP</option>
                <option value="marquardt">Marquardt</option>
              </>)}
          </select>
        </div>

        <InputsGroup_1.default {...inputsGroupProps[selectedMethod]}/>

        <div className="mb-4">
          <label htmlFor="func" className="block text-sm font-medium">Function</label>
          <select className="mt-1 w-full mb-2 rounded-md border-gray-300 p-2" name="func-templates" onChange={function (e) { return setFunc(e.target.value); }} value={func}>
            {(functionType === 'univariate' ? univariateFunctionTemplates : multivariateFunctionTemplates).map(function (template, index) { return (<option key={index} value={template.func}>
                  {"".concat(template.name, ": ").concat(template.example, " \u2192 ").concat(template.expected)}
                </option>); })}
          </select>
          <input name="func" type="text" value={func} onChange={function (e) { return setFunc(e.target.value); }} className="mt-1 w-full rounded-md border-gray-300 p-2" placeholder={functionType === 'univariate' ? 'e.g., x * x' : 'e.g., x => x.reduce((sum, xi) => sum + xi ** 2, 0)'}/>
        </div>

        <div className="mb-4">
          <label htmlFor="custom-func" className="block text-sm font-medium">Add Custom Function</label>
          <input id="custom-func" type="text" value={customFunctionInput} onChange={function (e) { return setCustomFunctionInput(e.target.value); }} className="mt-1 w-full rounded-md border-gray-300 p-2 mb-2" placeholder={functionType === 'univariate' ? 'e.g., x * x' : 'e.g., x => x.reduce((sum, xi) => sum + xi ** 2, 0)'}/>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" onClick={handleAddCustomFunction}>
            Add Custom Function
          </button>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" disabled={!areInputsValid} onClick={handleOptimize}>
          Optimize
        </button>

        {result && (<div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Result</h2>
            {functionType === 'univariate' ? (<div className="space-y-1">
                <p className="text-sm">x = {result.x.toFixed(8)}</p>
                <p className="text-sm">f(x) = {result.fx.toFixed(8)}</p>
                <p className="text-sm">Count of iterations: {result.iterations}</p>
              </div>) : (<div className="space-y-1">
                {Array.isArray(result.x) &&
                    result.x.map(function (val, index) { return (<p key={index} className="text-sm">x[{index}] = {val.toFixed(8)}</p>); })}
                <p className="text-sm">
				  f({Array.isArray(result.x) ? result.x.map(function (_, i) { return "x[".concat(i, "]"); }).join(',') : 'Invalid'}) ={' '}
					{typeof result.fx === 'number' ? result.fx.toFixed(8) : 'Invalid result'}
                </p>
                <p className="text-sm">Count of iterations: {result.iterations}</p>
              </div>)}
          </div>)}
      </div>
    </div>);
};
exports.default = MethodOptimization;
