'use client';
'use client';
import { useState, useCallback, useMemo } from 'react';
import InputsGroup, { useInputsGroup } from '../Inputs/InputsGroup';
import { MinFunctionsAPI } from '@/utils/api/min-functions/requests';
import {
  IDichotomyMethodPayload,
  IFibonacciMethodPayload,
  IGoldenSectionMethodPayload,
  IGradientDescentConstantPayload,
  IGradientDescentVariablePayload,
  ISteepestDescentPayload,
  IConjugateGradientPayload,
  INewtonMethodPayload,
  IDFPMethodPayload,
  IMarquardtMethodPayload,
} from '@/utils/api/min-functions/types';

type OptimizationMethodType =
  | 'dichotomy'
  | 'golden-section'
  | 'fibonacci'
  | 'gradient-descent-constant'
  | 'gradient-descent-variable'
  | 'steepest-descent'
  | 'conjugate-gradient'
  | 'newton'
  | 'dfp'
  | 'marquardt';

type FunctionType = 'univariate' | 'multivariate';

interface APIResponse {
  data: { result: { x: number | number[]; fx: number; iterations: number } };
}

type APIMethod = (data: any) => Promise<APIResponse>;

interface FunctionTemplate {
  name: string;
  func: string;
  example: string;
  expected: string;
  isCustom?: boolean;
}

const defaultUnivariateFunctionTemplates: FunctionTemplate[] = [
  {
    name: 'Quadratic Function',
    func: '(x - 3) ** 2',
    example: 'left: 0, right: 10, epsilon: 0.0001 (Dichotomy, Golden Section) | n: 10 (Fibonacci)',
    expected: '≈ 3',
  },
  {
    name: 'Cubic Function',
    func: '(x - 1) ** 3 - (x - 1)',
    example: 'left: -2, right: 5, epsilon: 0.0001 (Dichotomy, Golden Section) | n: 10 (Fibonacci)',
    expected: '≈ 1',
  },
];

const defaultMultivariateFunctionTemplates: FunctionTemplate[] = [
  {
    name: 'Quadratic nD',
    func: 'x => x[0] * x[0] + x[1] * x[1] + x[2] * x[2]',
    example:
      'initialX: [1, 1, 1], step: 0.1, epsilon: 0.0001, maxIterations: 1000 (Gradient Descent Constant) | lambda: 1 (Marquardt)',
    expected: '≈ [0, 0, 0]',
  },
  {
    name: 'Rosenbrock',
    func: 'x => 100 * (x[1] - x[0] * x[0]) ** 2 + (1 - x[0]) ** 2',
    example: 'initialX: [-1, 1], initialStep: 0.01, epsilon: 0.0001, maxIterations: 10000 (Gradient Descent Variable)',
    expected: '≈ [1, 1]',
  },
];

const MethodOptimization = () => {
  const [functionType, setFunctionType] = useState<FunctionType>('univariate');
  const [selectedMethod, setSelectedMethod] = useState<OptimizationMethodType>('dichotomy');
  const [func, setFunc] = useState(defaultUnivariateFunctionTemplates[0].func);
  const [result, setResult] = useState<{ x: number | number[]; fx: number; iterations: number } | null>(null);
  const [customFunctionInput, setCustomFunctionInput] = useState('');
  const [univariateFunctionTemplates, setUnivariateFunctionTemplates] = useState<FunctionTemplate[]>(
    defaultUnivariateFunctionTemplates
  );
  const [multivariateFunctionTemplates, setMultivariateFunctionTemplates] = useState<FunctionTemplate[]>(
    defaultMultivariateFunctionTemplates
  );

  const dichotomyInputs = useInputsGroup<IDichotomyMethodPayload>({
    inputs: useMemo(
      () => [
        { name: 'left', type: 'number' },
        { name: 'right', type: 'number' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
      ],
      []
    ),
  });

  const goldenSectionInputs = useInputsGroup<IGoldenSectionMethodPayload>({
    inputs: useMemo(
      () => [
        { name: 'left', type: 'number' },
        { name: 'right', type: 'number' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
      ],
      []
    ),
  });

  const fibonacciInputs = useInputsGroup<IFibonacciMethodPayload>({
    inputs: useMemo(
      () => [
        { name: 'left', type: 'number' },
        { name: 'right', type: 'number' },
        { name: 'n', type: 'number' },
      ],
      []
    ),
  });

  const gradientDescentConstantInputs = useInputsGroup<IGradientDescentConstantPayload>({
    inputs: useMemo(
      () => [
        { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
        { name: 'step', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.01' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        { name: 'maxIterations', type: 'number' },
      ],
      []
    ),
  });

  const gradientDescentVariableInputs = useInputsGroup<IGradientDescentVariablePayload>({
    inputs: useMemo(
      () => [
        { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
        { name: 'initialStep', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.1' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        { name: 'maxIterations', type: 'number' },
      ],
      []
    ),
  });

  const steepestDescentInputs = useInputsGroup<ISteepestDescentPayload>({
    inputs: useMemo(
      () => [
        { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        { name: 'maxIterations', type: 'number' },
      ],
      []
    ),
  });

  const conjugateGradientInputs = useInputsGroup<IConjugateGradientPayload>({
    inputs: useMemo(
      () => [
        { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        { name: 'maxIterations', type: 'number' },
      ],
      []
    ),
  });

  const newtonInputs = useInputsGroup<INewtonMethodPayload>({
    inputs: useMemo(
      () => [
        { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        { name: 'maxIterations', type: 'number' },
      ],
      []
    ),
  });

  const dfpInputs = useInputsGroup<IDFPMethodPayload>({
    inputs: useMemo(
      () => [
        { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        { name: 'maxIterations', type: 'number' },
      ],
      []
    ),
  });

  const marquardtInputs = useInputsGroup<IMarquardtMethodPayload>({
    inputs: useMemo(
      () => [
        { name: 'initialX', type: 'text', placeholder: '[1, 1, 1]' },
        { name: 'lambda', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '1.0' },
        { name: 'epsilon', type: 'text', pattern: '^-?\\d*\\.?\\d*$', placeholder: '0.0001' },
        { name: 'maxIterations', type: 'number' },
      ],
      []
    ),
  });

  const methods: Record<OptimizationMethodType, APIMethod> = {
    dichotomy: MinFunctionsAPI.dichotomyMethodRequest,
    'golden-section': MinFunctionsAPI.goldenSectionMethodRequest,
    fibonacci: MinFunctionsAPI.fibonacciMethodRequest,
    'gradient-descent-constant': MinFunctionsAPI.gradientDescentConstantRequest,
    'gradient-descent-variable': MinFunctionsAPI.gradientDescentVariableRequest,
    'steepest-descent': MinFunctionsAPI.steepestDescentRequest,
    'conjugate-gradient': MinFunctionsAPI.conjugateGradientRequest,
    newton: MinFunctionsAPI.newtonMethodRequest,
    dfp: MinFunctionsAPI.dfpMethodRequest,
    marquardt: MinFunctionsAPI.marquardtMethodRequest,
  };

  const inputsGroupProps = {
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

  const inputsData: Record<OptimizationMethodType, any> = {
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

  const getAreInputsValid = () => {
    const data = inputsData[selectedMethod];
    const values = Object.values(data).filter((v) => v !== 'func');
    return values.every((value) => value !== '' && value !== undefined);
  };

  const getFunctionDimension = (funcStr: string): number => {
    const matches = funcStr.match(/x\[(\d+)\]/g) || [];
    const indices = matches.map((m) => parseInt(m.match(/\d+/)![0]));
    return indices.length > 0 ? Math.max(...indices) + 1 : 0;
  };

  const validateCustomFunction = useCallback(
    async (funcStr: string, testInitialX?: number[]) => {
      console.log('Validating function:', funcStr);

      if (!funcStr.trim()) return false;

      if (functionType === 'univariate') {
        if (!/^[a-z\s\d()+\-*/^.\s]+$/.test(funcStr) || !funcStr.includes('x')) {
          console.error('Invalid univariate function syntax. Expected an expression with "x", e.g., "x * x".');
          return false;
        }
      } else {
        if (!/^\s*x\s*=>\s*.+\b(x\[\d+\])/.test(funcStr)) {
          console.error(
            'Invalid multivariate function syntax. Expected "x => ..." with array access, e.g., "x => x[0] * x[0]".'
          );
          return false;
        }
      }

      try {
        let initialX: number[] = testInitialX || [1, 1, 1];
        if (functionType === 'multivariate') {
          const funcDimension = getFunctionDimension(funcStr);
          if (funcDimension > 0) {
            initialX = Array(funcDimension).fill(1);
            console.log(`Adjusted initialX to match function dimension (${funcDimension}):`, initialX);
          }
        }

        const testInput =
          functionType === 'univariate'
            ? { func: funcStr, left: 0, right: 1, epsilon: 0.1 }
            : {
                func: funcStr,
                initialX,
                step: 0.1,
                epsilon: 0.1,
                maxIterations: 10,
              };

        const response = await methods[functionType === 'univariate' ? 'dichotomy' : 'gradient-descent-constant'](
          testInput
        );
        console.log('Validation response:', response.data);
        return true;
      } catch (error: any) {
        console.error('Custom function validation error:', error.message, error);
        return false;
      }
    },
    [functionType]
  );

  const handleAddCustomFunction = async () => {
    if (!customFunctionInput.trim()) {
      alert('Please enter a function');
      return;
    }

    const isValid = await validateCustomFunction(customFunctionInput);
    if (!isValid) {
      alert(
        functionType === 'univariate'
          ? "Invalid function. For univariate, use an expression with 'x', e.g., 'x * x'."
          : "Invalid function. For multivariate, use 'x => ...' with array operations, e.g., 'x => x[0] * x[0] + x[1] * x[1]'."
      );
      return;
    }

    const funcDimension = functionType === 'multivariate' ? getFunctionDimension(customFunctionInput) : 0;
    const newTemplate: FunctionTemplate = {
      name: `Custom Function ${
        functionType === 'univariate' ? univariateFunctionTemplates.length + 1 : multivariateFunctionTemplates.length + 1
      }`,
      func: customFunctionInput,
      example:
        functionType === 'univariate'
          ? 'left: 0, right: 10, epsilon: 0.0001 | n: 10'
          : `initialX: [${Array(funcDimension || 3)
              .fill(1)
              .join(', ')}], step: 0.1, epsilon: 0.0001, maxIterations: 1000`,
      expected: 'Depends on function',
      isCustom: true,
    };

    if (functionType === 'univariate') {
      setUnivariateFunctionTemplates((prev) => [...prev, newTemplate]);
    } else {
      setMultivariateFunctionTemplates((prev) => [...prev, newTemplate]);
    }

    setFunc(customFunctionInput);
    setCustomFunctionInput('');
  };

  const handleDeleteCustomFunction = (index: number) => {
    if (functionType === 'univariate') {
      const updatedTemplates = univariateFunctionTemplates.filter((_, i) => i !== index);
      setUnivariateFunctionTemplates(updatedTemplates);
      if (updatedTemplates.length > 0) {
        setFunc(updatedTemplates[0].func);
      } else {
        setFunc('');
      }
    } else {
      const updatedTemplates = multivariateFunctionTemplates.filter((_, i) => i !== index);
      setMultivariateFunctionTemplates(updatedTemplates);
      if (updatedTemplates.length > 0) {
        setFunc(updatedTemplates[0].func);
      } else {
        setFunc('');
      }
    }
  };

  const handleOptimize = async () => {
    const data = { ...inputsData[selectedMethod], func };
    console.log('Optimize input data:', data);

    if ('epsilon' in data) {
      const epsilonValue = String(data.epsilon);
      if (epsilonValue.includes(',')) {
        alert('Please use a dot (.) for decimal numbers in epsilon, e.g., 0.0001 instead of 0,0001.');
        return;
      }
      const epsilon = parseFloat(epsilonValue);
      if (isNaN(epsilon) || epsilon <= 0 || epsilon > 1) {
        alert('Epsilon must be a positive number between 0 and 1 (e.g., 0.0001). Use a dot (.) for decimal numbers.');
        return;
      }
      data.epsilon = epsilon;
    }

    if ('step' in data || 'initialStep' in data || 'lambda' in data) {
      const stepKey = 'step' in data ? 'step' : 'initialStep' in data ? 'initialStep' : 'lambda';
      const stepValue = String(data[stepKey]);
      if (stepValue.includes(',')) {
        alert(
          `Please use a dot (.) for decimal numbers in ${stepKey}, e.g., ${
            stepKey === 'lambda' ? '1.0' : '0.1'
          } instead of ${stepKey === 'lambda' ? '1,0' : '0,1'}.`
        );
        return;
      }
      const step = parseFloat(stepValue);
      if (isNaN(step) || step <= 0 || (stepKey !== 'lambda' && step > 1)) {
        alert(
          `${stepKey.charAt(0).toUpperCase() + stepKey.slice(1)} must be a positive number ${
            stepKey !== 'lambda' ? 'between 0 and 1 (e.g., 0.1)' : '(e.g., 1.0)'
          }. Use a dot (.) for decimal numbers.`
        );
        return;
      }
      data[stepKey] = step;
    }

    if (functionType === 'multivariate' && 'initialX' in data) {
      let initialX = data.initialX;
      const funcDimension = getFunctionDimension(func);
      if (!initialX || initialX === '') {
        initialX = Array(funcDimension || 3).fill(1);
        console.log('Generated initialX:', initialX);
      } else if (!Array.isArray(initialX)) {
        try {
          initialX = JSON.parse(String(initialX));
          if (!Array.isArray(initialX) || !initialX.every((val: any) => typeof val === 'number' && !isNaN(val))) {
            alert('Invalid initialX format. Using generated initialX instead.');
            initialX = Array(funcDimension || 3).fill(1);
          }
        } catch (e) {
          alert('Invalid initialX format. Using generated initialX instead.');
          initialX = Array(funcDimension || 3).fill(1);
        }
      }
      if (funcDimension > initialX.length) {
        initialX = Array(funcDimension).fill(1);
        console.log('Adjusted initialX to match function dimension:', initialX);
      } else if (funcDimension > 0 && initialX.length > funcDimension) {
        initialX = initialX.slice(0, funcDimension);
        console.log('Trimmed initialX to match function dimension:', initialX);
      }
      data.initialX = initialX;
    }

    if ('maxIterations' in data) {
      const maxIterations = parseInt(String(data.maxIterations), 10);
      if (isNaN(maxIterations) || maxIterations <= 0) {
        alert('maxIterations must be a positive integer (e.g., 10000)');
        return;
      }
      data.maxIterations = maxIterations;
    }

    try {
      console.log('Sending optimization request:', { method: selectedMethod, data });
      const response = await methods[selectedMethod](data);
      console.log('Optimization response:', response.data);
      setResult(response.data.result);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      console.error('Optimization error details:', {
        method: selectedMethod,
        data,
        errorMessage,
        responseData: error.response?.data,
        fullError: error,
      });
      alert(`Optimization failed: ${errorMessage}. Please check console for details.`);
    }
  };

  const handleFunctionTypeChange = (type: FunctionType) => {
    console.log('handleFunctionTypeChange called:', type);
    setFunctionType(type);
    setSelectedMethod(type === 'univariate' ? 'dichotomy' : 'gradient-descent-constant');
    setFunc(type === 'univariate' ? univariateFunctionTemplates[0].func : multivariateFunctionTemplates[0].func);
    setResult(null);
  };

  const areInputsValid = getAreInputsValid();

  return (
    <div className="w-full max-w-screen-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Method Optimization</h1>
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="mb-4">
          <label htmlFor="function-type" className="block text-sm font-medium">
            Function Type
          </label>
          <select
            id="function-type"
            value={functionType}
            onChange={(e) => handleFunctionTypeChange(e.target.value as FunctionType)}
            className="mt-1 w-full rounded-md border-gray-300 p-2"
          >
            <option value="univariate">Univariate</option>
            <option value="multivariate">Multivariate</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="method" className="block text-sm font-medium">
            Method
          </label>
          <select
            id="method"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as OptimizationMethodType)}
            className="mt-1 w-full rounded-md border-gray-300 p-2"
          >
            {functionType === 'univariate' ? (
              <>
                <option value="dichotomy">Dichotomy</option>
                <option value="golden-section">Golden Section</option>
                <option value="fibonacci">Fibonacci</option>
              </>
            ) : (
              <>
                <option value="gradient-descent-constant">Gradient Descent (Constant)</option>
                <option value="gradient-descent-variable">Gradient Descent (Variable)</option>
                <option value="steepest-descent">Steepest Descent</option>
                <option value="conjugate-gradient">Conjugate Gradient</option>
                <option value="newton">Newton</option>
                <option value="dfp">DFP</option>
                <option value="marquardt">Marquardt</option>
              </>
            )}
          </select>
        </div>

        <InputsGroup {...inputsGroupProps[selectedMethod]} />

        <div className="mb-4">
          <label htmlFor="func" className="block text-sm font-medium">
            Function
          </label>
          <div className="flex flex-col space-y-2">
            <select
              className="mt-1 w-full rounded-md border-gray-300 p-2"
              value={func}
              onChange={(e) => setFunc(e.target.value)}
            >
              {(functionType === 'univariate' ? univariateFunctionTemplates : multivariateFunctionTemplates).map(
                (template, index) => (
                  <option key={index} value={template.func}>
                    {`${template.name}: ${template.example} → ${template.expected}`}
                  </option>
                )
              )}
            </select>
          </div>
          <input
            name="func"
            type="text"
            value={func}
            onChange={(e) => setFunc(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 p-2"
            placeholder={
              functionType === 'univariate' ? 'e.g., x * x' : 'e.g., x => x[0] * x[0] + x[1] * x[1]'
            }
          />
        </div>

        <div className="mb-4">
          <label htmlFor="custom-func" className="block text-sm font-medium">
            Add Custom Function
          </label>
          <input
            id="custom-func"
            type="text"
            value={customFunctionInput}
            onChange={(e) => setCustomFunctionInput(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 p-2 mb-2"
            placeholder={
              functionType === 'univariate' ? 'e.g., x * x' : 'e.g., x => x[0] * x[0] + x[1] * x[1]'
            }
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            onClick={handleAddCustomFunction}
          >
            Add Custom Function
          </button>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          disabled={!areInputsValid}
          onClick={handleOptimize}
        >
          Optimize
        </button>

        {result && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Result</h2>
            {functionType === 'univariate' ? (
              <div className="space-y-1">
                <p className="text-sm">x = {(result.x as number).toFixed(6)}</p>
                <p className="text-sm">f(x) = {result.fx.toFixed(6)}</p>
                <p className="text-sm">Count of iterations: {result.iterations}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {Array.isArray(result.x) &&
                  result.x.map((val, index) => (
                    <p key={index} className="text-sm">
                      x[{index}] = {val.toFixed(6)}
                    </p>
                  ))}
                <p className="text-sm">
                  {`f(${
                    Array.isArray(result.x) ? result.x.map((_, i) => `x[${i}]`).join(',') : 'Invalid'
                  }) = ${result.fx.toFixed(6)}`}
                </p>
                <p className="text-sm">Count of iterations: {result.iterations}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MethodOptimization;