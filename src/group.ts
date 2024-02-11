import type { Prove } from "./base.js";
import { asProved } from "./base.js";

// 群 (group)
export interface GroupProtocol<T> {
  readonly "@isAssociative": Prove;
  readonly "@isCommutative": Prove;
  Add(t1: T, t2: T): T;
  Inverse(t: T): T;
  Zero(): T;
  Eq(t1: T, t2: T): boolean;
}
export interface GroupUtil<T> {
  IsZero(t: T): boolean;
}

export const groupUtil = <T>(group: GroupProtocol<T>): GroupUtil<T> => {
  return {
    IsZero(t): boolean {
      return group.Eq(group.Zero(), t);
    },
  };
};

export const numberGroup = (): GroupProtocol<number> => {
  return {
    "@isAssociative": asProved(/* */),
    "@isCommutative": asProved(/* */),
    Add(n1, n2) {
      return n1 + n2;
    },
    Inverse(n) {
      return -n;
    },
    Zero() {
      return 0;
    },
    Eq(n1: number, n2: number) {
      return n1 === n2;
    },
  };
};

export const numberMultGroup = (): GroupProtocol<number> => {
  return {
    "@isAssociative": asProved(/**/),
    "@isCommutative": asProved(/**/),
    Add(n1, n2) {
      return n1 * n2;
    },
    Inverse(n) {
      return 1 / n;
    },
    Zero() {
      return 1;
    },
    Eq(n1, n2) {
      return n1 === n2;
    },
  };
};

// export const bigintGroup = (): GroupProtocol<bigint> => {
//   return {
//     Add(n1, n2) {
//       return n1 * n2;
//     },
//     Inverse(n) {
//       return -n;
//     },
//     Zero() {
//       return 1n;
//     },
//     Eq(n1, n2) {
//       return n1 === n2;
//     },
//   };
// };
