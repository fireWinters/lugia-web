//@flow

import * as React from 'react';
import chai from 'chai';
import { deepMerge, getAttritubeValue, packObject, style2css } from '../CSSProvider';

const { expect: exp } = chai;

describe('CSSProvider', () => {
  it('getAttritubeValue', () => {
    expect(getAttritubeValue(null, [])).toBeUndefined();
    expect(getAttritubeValue({}, [])).toBeUndefined();
    expect(getAttritubeValue({ a: { b: 1 } }, ['a'])).toEqual({ b: 1 });
    expect(getAttritubeValue({ a: { b: 1 } }, ['a', 'b'])).toEqual(1);
  });

  it('packObject', () => {
    expect(packObject(['a', 'b', 'c'], 1)).toEqual({
      a: {
        b: {
          c: 1,
        },
      },
    });

    const objA = { a: { b: { c: 1 } } };
    const objB = { a: { b: { d: 100 } } };
  });

  it('deepMerge', () => {
    expect(deepMerge(null, {})).toEqual({});
    expect(deepMerge({}, null)).toEqual({});
    expect(deepMerge({ title: 'hello' }, null)).toEqual({ title: 'hello' });
    expect(deepMerge({ title: 'hello' }, { title: 'world' })).toEqual({ title: 'world' });
    const objA = { title: 'hello' };
    expect(objA).toEqual({ title: 'hello' });
    expect(deepMerge(objA, { title: 'world' })).toEqual({ title: 'world' });
    expect(objA).toEqual({ title: 'hello' });
    expect(
      deepMerge(
        { title: 'hello', card: { sex: 'man', score: { yw: 15, sx: 13 } } },
        {
          title: 'world',
          card: { id: 181, score: { hx: 100 } },
        }
      )
    ).toEqual({
      title: 'world',
      card: { sex: 'man', score: { yw: 15, sx: 13, hx: 100 }, id: 181 },
    });
  });

  it('style2css', () => {
    expect(style2css()).toEqual('');
    expect(style2css({})).toEqual('');
    expect(
      style2css({
        backGround: 'hello',
        red: undefined,
        fontSize: 1,
        color: 'rgb(121,11,11,5)',
      })
    ).toEqual('back-ground:hello;font-size:1;color:rgb(121,11,11,5);');
  });

  it('getThemeByConfig', () => {});
});
