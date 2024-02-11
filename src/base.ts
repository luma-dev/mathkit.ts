export interface Prove {
  readonly "@proved": true;
}

export const asProved = (..._proves: Prove[]): Prove => {
  return {
    "@proved": true,
  };
};
