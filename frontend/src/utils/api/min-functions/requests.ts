// src/utils/api/min-functions/requests.ts
"use client"
import axiosInstance from "..";
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
  IMarquardtMethodPayload
} from "./types";


export namespace MinFunctionsAPI {
  // Одновимірні методи
  export async function dichotomyMethodRequest(payload: IDichotomyMethodPayload) {
    return axiosInstance.post("/dichotomy", payload);
  }

  export async function goldenSectionMethodRequest(payload: IGoldenSectionMethodPayload) {
    return axiosInstance.post("/golden-section", payload);
  }

  export async function fibonacciMethodRequest(payload: IFibonacciMethodPayload) {
    return axiosInstance.post("/fibonacci", payload);
  }

  // Багатовимірні методи
  export async function gradientDescentConstantRequest(payload: IGradientDescentConstantPayload) {
    return axiosInstance.post("/gradient-descent-constant", payload);
  }

  export async function gradientDescentVariableRequest(payload: IGradientDescentVariablePayload) {
    return axiosInstance.post("/gradient-descent-variable", payload);
  }

  export async function steepestDescentRequest(payload: ISteepestDescentPayload) {
    return axiosInstance.post("/steepest-descent", payload);
  }

  export async function conjugateGradientRequest(payload: IConjugateGradientPayload) {
    return axiosInstance.post("/conjugate-gradient", payload);
  }

  export async function newtonMethodRequest(payload: INewtonMethodPayload) {
    return axiosInstance.post("/newton", payload);
  }

  export async function dfpMethodRequest(payload: IDFPMethodPayload) {
    return axiosInstance.post("/dfp", payload);
  }

  export async function marquardtMethodRequest(payload: IMarquardtMethodPayload) {
    return axiosInstance.post("/marquardt", payload);
  }
}