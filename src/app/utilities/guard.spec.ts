import { guard } from './guard';

describe('guard', () => {
  const fib = [1, 1, 2, 3, 5, 8, 13, 21];
  // isNotNull
  it('enforce(null).isNotNull() should throw', () => {
    expect(() => {
      guard('#1').enforce(null).isNotNull();
    }).toThrow(new Error('#1'));
  });
  it('enforce(10).isNotNull() should pass', () => {
    expect(() => {
      guard('#2').enforce(10).isNotNull();
    }).not.toThrow();
  });
  // isInArray
  it('enforce(10).isInArray(fib) should throw', () => {
    expect(() => {
      guard('#3').enforce(10).isInArray(fib);
      return true;
    }).toThrow(new Error('#3'));
  });
  it('enforce(8).isInArray(fib) should pass', () => {
    expect(() => {
      guard('#4').enforce(8).isInArray(fib);
      return true;
    }).not.toThrow();
  });
  // isNotArray
  it('enforce(10).isNotInArray(fib) should pass', () => {
    expect(() => {
      guard('#5').enforce(10).isNotInArray(fib);
      return true;
    }).not.toThrow();
  });
  it('enforce(8).isNotInArray(fib) should throw', () => {
    expect(() => {
      guard('#6').enforce(8).isNotInArray(fib);
      return true;
    }).toThrow(new Error('#6'));
  });
  // isInstanceOf
  it('enforce("Hello, World!").isInstanceOf(Date) should throw', () => {
    expect(() => {
      guard('#7').enforce('Hello, World!').isInstanceOf(Date);
      return true;
    }).toThrow(new Error('#7'));
  });
  it('enforce(new Date()).isInstanceOf(Date) should pass', () => {
    expect(() => {
      guard('#8').enforce(new Date()).isInstanceOf(Date);
      return true;
    }).not.toThrow();
  });
  // hasProperty
  it('enforce(new Date()).hasProperty("toString") should pass', () => {
    expect(() => {
      guard('#9').enforce(new Date()).hasProperty('toString');
      return true;
    }).not.toThrow();
  });
  it('enforce(null).hasProperty("toString") should pass', () => {
    expect(() => {
      guard('#10').enforce(null).hasProperty('toString');
      return true;
    }).toThrow();
  });
});
