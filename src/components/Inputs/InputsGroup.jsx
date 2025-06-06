// src/components/Inputs/InputsGroup.tsx
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInputsGroup = void 0;
var react_1 = require("react");
var useInputsGroup = function (props) {
    var _a = (0, react_1.useState)(props.inputs.reduce(function (acc, input) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[input.name] = "", _a)));
    }, {})), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(props.inputs.reduce(function (acc, input) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[input.name] = "", _a)));
    }, {})), exportData = _b[0], setExportData = _b[1];
    var _c = (0, react_1.useState)({}), errors = _c[0], setErrors = _c[1];
    var validateInitialX = (0, react_1.useCallback)(function (value) {
        if (value === '') {
            return { isValid: true, parsedValue: '' };
        }
        try {
            var parsed = JSON.parse(value);
            if (!Array.isArray(parsed) || !parsed.every(function (v) { return typeof v === 'number' && !isNaN(v); })) {
                return { isValid: false, parsedValue: value };
            }
            return { isValid: true, parsedValue: parsed };
        }
        catch (_a) {
            return { isValid: false, parsedValue: value };
        }
    }, []);
    var handleInputChange = (0, react_1.useCallback)(function (input, value) {
        setData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = value, _a)));
        });
        if (['step', 'initialStep', 'lambda', 'epsilon'].includes(input.name)) {
            var validInput_1 = /^-?\d*\.?\d*$/.test(value);
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = validInput_1 || value === '' ? '' : 'Use digits and a dot (e.g., 0.1), no commas.', _a)));
            });
            setExportData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = value === '' ? '' : parseFloat(value), _a)));
            });
            return;
        }
        if (input.name === 'initialX') {
            var _a = validateInitialX(value), isValid_1 = _a.isValid, parsedValue_1 = _a.parsedValue;
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = isValid_1 || value === '' ? '' : 'Invalid format, use [1, 1]', _a)));
            });
            setExportData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = isValid_1 ? parsedValue_1 : value, _a)));
            });
            return;
        }
        if (input.type === 'number' && value !== '') {
            var convertedValue_1 = parseFloat(value);
            setExportData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = isNaN(convertedValue_1) ? value : convertedValue_1, _a)));
            });
        }
        else {
            setExportData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = value, _a)));
            });
        }
        setErrors(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = '', _a)));
        });
    }, [validateInitialX]);
    var inputsGroupProps = {
        inputs: props.inputs.map(function (input) { return ({
            name: input.name,
            type: input.type,
            value: data[input.name],
            onChange: function (value) { return handleInputChange(input, value); },
            onBlur: function (value) {
                if (input.name === 'initialX') {
                    var _a = validateInitialX(value), isValid_2 = _a.isValid, parsedValue_2 = _a.parsedValue;
                    setErrors(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = isValid_2 || value === '' ? '' : 'Invalid format, use [1, 1]', _a)));
                    });
                    setExportData(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[input.name] = isValid_2 ? parsedValue_2 : value, _a)));
                    });
                }
            },
            pattern: input.pattern,
            placeholder: input.placeholder,
            error: errors[input.name],
        }); }),
    };
    return {
        data: exportData,
        __inputsGroupProps: inputsGroupProps,
    };
};
exports.useInputsGroup = useInputsGroup;
var InputsGroup = function (_a) {
    var inputs = _a.inputs;
    return (<div className="flex flex-col space-y-2">
      {inputs.map(function (input, index) { return (<div className="flex flex-col" key={index}>
          <label htmlFor={input.name} className="capitalize text-sm font-medium">
            {input.name}
          </label>
          <input id={input.name} name={input.name} value={input.value} onChange={function (e) {
                if (input.type === 'text') {
                    var inputElement_1 = e.target;
                    var cursorPosition_1 = inputElement_1.selectionStart;
                    input.onChange(e.target.value);
                    setTimeout(function () {
                        inputElement_1.setSelectionRange(cursorPosition_1, cursorPosition_1);
                    }, 0);
                }
                else {
                    input.onChange(e.target.value);
                }
            }} onBlur={input.onBlur ? function (e) { return input.onBlur(e.target.value); } : undefined} type={input.type} pattern={input.pattern} placeholder={input.placeholder || (input.name === 'epsilon' ? 'e.g., 0.0001' :
                input.name === 'step' ? 'e.g., 0.01' :
                    input.name === 'initialStep' ? 'e.g., 0.1' :
                        input.name === 'lambda' ? 'e.g., 1.0' :
                            input.name === 'initialX' ? 'e.g., [1, 1]' :
                                input.name === 'left' || input.name === 'right' ? 'e.g., -2' :
                                    input.name === 'n' || input.name === 'maxIterations' ? 'e.g., 1000' : undefined)} className={"mt-1 w-full rounded-md border ".concat(input.error ? 'border-red-500' : 'border-gray-300', " p-2")} title={input.pattern ? 'Use digits and a single dot (e.g., 0.1) for decimals, or [1, 1] for initialX' : undefined}/>
          {input.error && <span className="text-red-500 text-sm mt-1">{input.error}</span>}
        </div>); })}
    </div>);
};
