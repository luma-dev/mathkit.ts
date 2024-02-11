import { asProved } from "./base.js";
import type { FieldProtocol } from "./field.js";
import { unsafeNumberField, fieldUtil } from "./field.js";

export interface Rational<T> {
  // 分子
  readonly numer: T;
  // 分母
  readonly denom: T;
}

export interface RationalField<T> extends FieldProtocol<Rational<T>> {}

export const createRationalField = <T>(
  field: FieldProtocol<T>,
): RationalField<T> => {
  const Eq = (op1: Rational<T>, op2: Rational<T>): boolean => {
    // a/b = c/d <=> ad = bc
    return field.AddEq(
      field.Mult(op1.numer, op2.denom),
      field.Mult(op1.denom, op2.numer),
    );
  };
  const isAddAssociative = asProved();
  const isAddCommutative = asProved();
  const Add = (op1: Rational<T>, op2: Rational<T>): Rational<T> => {
    // a/b + c/d = (ad+bc)/bd
    return {
      numer: field.Add(
        field.Mult(op1.numer, op2.denom),
        field.Mult(op1.denom, op2.numer),
      ),
      denom: field.Mult(op1.denom, op2.denom),
    };
  };
  return {
    "@isAddAssociative": isAddAssociative,
    "@isAddCommutative": isAddCommutative,
    Add,
    AddInverse: (op1: Rational<T>): Rational<T> => {
      return {
        numer: field.AddInverse(op1.numer),
        denom: op1.denom,
      };
    },
    "@isMultDistributive": asProved(),
    Mult: (op1: Rational<T>, op2: Rational<T>): Rational<T> => {
      // a/b * c/d = ac/bd
      return {
        numer: field.Mult(op1.numer, op2.numer),
        denom: field.Mult(op1.denom, op2.denom),
      };
    },
    "@isMultAssociative": isAddAssociative,
    "@isMultCommutative": isAddCommutative,
    MultAdd: Add,
    MultInverse: (op1: Rational<T>): Rational<T> => {
      if (fieldUtil(field).IsZero(op1.denom))
        throw new Error("no inverse of zero");
      // a/b^-1 = b/a
      return {
        numer: op1.denom,
        denom: op1.numer,
      };
    },
    Zero: (): Rational<T> => {
      return {
        numer: field.Zero(),
        denom: field.One(),
      };
    },
    One: (): Rational<T> => {
      return {
        numer: field.One(),
        denom: field.One(),
      };
    },
    AddEq: Eq,
    MultEq: Eq,
  };
};

export type UnsafeNumberRational = Rational<number>;
export const unsafeNumberRational = () =>
  createRationalField(unsafeNumberField());
export const numberToRational = (n: number): UnsafeNumberRational => ({
  numer: n,
  denom: 1,
});
