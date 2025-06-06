// src/utils/api/min-functions/types.ts
"use client"

// Одновимірні методи
export type IDichotomyMethodPayload = {
  func: string;
  left: number;
  right: number;
  epsilon: number;
}

export type IGoldenSectionMethodPayload = {
  func: string;
  left: number;
  right: number;
  epsilon: number;
}

export type IFibonacciMethodPayload = {
  func: string;
  left: number;
  right: number;
  n: number;
}

// Багатовимірні методи
export type IGradientDescentConstantPayload = {
  func: string;
  initialX: number[];
  step: number;
  epsilon: number;
  maxIterations: number;
}

export type IGradientDescentVariablePayload = {
  func: string;
  initialX: number[];
  initialStep: number;
  epsilon: number;
  maxIterations: number;
}

export type ISteepestDescentPayload = {
  func: string;
  initialX: number[];
  epsilon: number;
  maxIterations: number;
}

export type IConjugateGradientPayload = {
  func: string;
  initialX: number[];
  epsilon: number;
  maxIterations: number;
}

export type INewtonMethodPayload = {
  func: string;
  initialX: number[];
  epsilon: number;
  maxIterations: number;
}

export type IDFPMethodPayload = {
  func: string;
  initialX: number[];
  epsilon: number;
  maxIterations: number;
}

export type IMarquardtMethodPayload = {
  func: string;
  initialX: number[];
  lambda: number;
  epsilon: number;
  maxIterations: number;
}

