export class Vector<T> {
  constructor(public readonly data: readonly T[]) {}
  get length(): number {
    return this.data.length;
  }
  get(i: number): T {
    const e = this.data[i];
    if (e === undefined) throw new Error(`Out of range index access: ${i}`);
    return e;
  }
  map<U>(fn: (v: T, i: number) => U): Vector<U> {
    return new Vector(this.data.map(fn));
  }
  set(i: number, v: T): Vector<T> {
    return new Vector(this.data.map((vv, ii) => (ii === i ? v : vv)));
  }
}

export type MatMapperFn<T, U> = (v: T, y: number, x: number) => U;
export class Matrix<T> extends Vector<Vector<T>> {
  constructor(data: readonly Vector<T>[]) {
    super(data);
  }
  matGet(y: number, x: number): T {
    return this.get(y).get(x);
  }
  matMap<U>(fn: MatMapperFn<T, U>): Matrix<U> {
    return new Matrix(
      this.data.map((row, y) => row.map((v, x) => fn(v, y, x))),
    );
  }
  matSet(y: number, x: number, v: T): Matrix<T> {
    return new Matrix(
      this.data.map((row, yy) => (yy === y ? row.set(x, v) : row)),
    );
  }
  row(i: number): Vector<T> {
    return new Vector(this.get(i).data);
  }
  column(j: number): Vector<T> {
    return new Vector(this.data.map((row) => row.get(j)));
  }
}
