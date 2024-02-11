import type { Prove } from "./base.js";
import { asProved } from "./base.js";
import type { GroupProtocol } from "./group.js";
import { numberGroup, numberMultGroup } from "./group.js";

// 体 (field)
export interface FieldProtocol<T> {
  readonly "@isAddAssociative": Prove;
  readonly "@isAddCommutative": Prove;
  Add(t1: T, t2: T): T;
  AddInverse(t: T): T;
  readonly "@isMultDistributive": Prove;
  Mult(t: T, u: T): T;
  readonly "@isMultAssociative": Prove;
  readonly "@isMultCommutative": Prove;
  MultAdd(u1: T, u2: T): T;
  MultInverse(u: T): T;
  Zero(): T;
  One(): T;
  AddEq(t1: T, t2: T): boolean;
  MultEq(u1: T, u2: T): boolean;
}
export interface FieldUtil<T> {
  IsZero(t: T): boolean;
  IsOne(u: T): boolean;
  OfNat(n: bigint): T;
  Pow(t: T, n: bigint): T;
}

export const fieldUtil = <T>(field: FieldProtocol<T>): FieldUtil<T> => {
  return {
    IsZero(t): boolean {
      return field.AddEq(field.Zero(), t);
    },
    IsOne(u): boolean {
      return field.MultEq(field.One(), u);
    },
    OfNat(n): T {
      let m = n;
      let neg = false;
      if (m < 0n) {
        m = -m;
        neg = true;
      }
      let r = field.Zero();
      let p = field.One();
      while (m > 0n) {
        if (m % 2n === 1n) {
          r = field.Add(r, p);
        }
        p = field.Add(p, p);
        m /= 2n;
      }
      return neg ? field.AddInverse(r) : r;
    },
    Pow(t, n): T {
      let m = n;
      let neg = false;
      if (m < 0n) {
        m = -m;
        neg = true;
      }
      let r = field.One();
      let p = t;
      while (m > 0n) {
        if (m % 2n === 1n) {
          r = field.Mult(r, p);
        }
        p = field.Mult(p, p);
        m /= 2n;
      }
      return neg ? field.MultInverse(r) : r;
    },
  };
};

export const createField = <T>(
  mod: GroupProtocol<T>,
  mult: GroupProtocol<T>,
  act: FieldProtocol<T>["Mult"],
  actIsDistributive: Prove,
): FieldProtocol<T> => {
  return {
    "@isAddAssociative": mod["@isAssociative"],
    "@isAddCommutative": mod["@isCommutative"],
    Add: mod.Add.bind(mod),
    AddInverse: mod.Inverse.bind(mod),
    "@isMultDistributive": actIsDistributive,
    Mult: act,
    "@isMultAssociative": mult["@isAssociative"],
    "@isMultCommutative": mult["@isCommutative"],
    MultAdd: mult.Add.bind(mult),
    MultInverse: mult.Inverse.bind(mult),
    Zero: mod.Zero.bind(mod),
    One: mult.Zero.bind(mult),
    AddEq: mod.Eq.bind(mod),
    MultEq: mult.Eq.bind(mult),
  };
};

export const unsafeNumberField = () =>
  createField<number>(
    numberGroup(),
    numberMultGroup(),
    (t, u) => t * u,
    asProved(/* 実際はfieldではない */),
  );
