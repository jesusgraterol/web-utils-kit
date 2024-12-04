import { describe, test, expect } from 'vitest';
import {
  isStringValid,
  isNumberValid,
  isIntegerValid,
  isTimestampValid,
  isObjectValid,
  isArrayValid,
  isSlugValid,
  isPasswordValid,
} from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('isStringValid', () => {
  test.each([
    // essential
    ['', undefined, undefined, true],
    [' ', undefined, undefined, true],
    ['Hello World!', undefined, undefined, true],

    // ranges
    ['', 1, undefined, false],
    ['A', 1, undefined, true],
    ['ABCDE', undefined, 5, true],
    ['ABCDEF', undefined, 5, false],
    ['ABCDEF', 1, 5, false],

    // bad data types
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    [1, undefined, undefined, false],
    [true, undefined, undefined, false],
  ])('isStringValid(%s, %s, %s) -> %s', (a, b, c, expected) => {
    expect(isStringValid(a, b, c)).toBe(expected);
  });
});




describe('isNumberValid', () => {
  test.each([
    // essential
    [1, undefined, undefined, true],
    [0, undefined, undefined, true],
    [-1, undefined, undefined, true],
    [Number.MIN_SAFE_INTEGER, undefined, undefined, true],
    [Number.MAX_SAFE_INTEGER, undefined, undefined, true],

    // ranges
    [0, 1, 5, false],
    [1, 1, 5, true],
    [2, 1, 5, true],
    [3, 1, 5, true],
    [4, 1, 5, true],
    [5, 1, 5, true],
    [6, 1, 5, false],
    [NaN, undefined, undefined, false],
    [NaN, 0, undefined, false],
    [Number.MIN_SAFE_INTEGER - 1, undefined, undefined, false],
    [Number.MAX_SAFE_INTEGER + 1, undefined, undefined, false],
    [Infinity, undefined, undefined, false],
    [-Infinity, undefined, undefined, false],
    [-1, 0, undefined, false],
    [1, undefined, 0, false],

    // bad data types
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    ['', undefined, undefined, false],
    ['1', undefined, undefined, false],
    [true, undefined, undefined, false],
  ])('isNumberValid(%s, %s, %s) -> %s', (a, b, c, expected) => {
    expect(isNumberValid(a, b, c)).toBe(expected);
  });
});





describe('isIntegerValid', () => {
  test.each([
    // essential
    [1, undefined, undefined, true],
    [0, undefined, undefined, true],
    [-1, undefined, undefined, true],
    [14400000, undefined, undefined, true],
    [Number.MAX_SAFE_INTEGER, undefined, undefined, true],
    [Number.MIN_SAFE_INTEGER, undefined, undefined, true],
    [1562851996000, undefined, undefined, true],

    // ranges
    [0, 1, 5, false],
    [1, 1, 5, true],
    [2, 1, 5, true],
    [3, 1, 5, true],
    [4, 1, 5, true],
    [5, 1, 5, true],
    [6, 1, 5, false],
    [NaN, 0, undefined, false],
    [-Infinity, 0, undefined, false],
    [Infinity, undefined, 1, false],
    [Number.MAX_SAFE_INTEGER + 1, undefined, undefined, false],
    [Number.MIN_SAFE_INTEGER - 1, undefined, undefined, false],

    // bad data types
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    ['', undefined, undefined, false],
    ['1', undefined, undefined, false],
    [true, undefined, undefined, false],
    [55.85, undefined, undefined, false],
    [Infinity, undefined, undefined, false],
    [-Infinity, undefined, undefined, false],
    [NaN, undefined, undefined, false],
  ])('isIntegerValid(%s, %s, %s) -> %s', (a, b, c, expected) => {
    expect(isIntegerValid(a, b, c)).toBe(expected);
  });
});





describe('isTimestampValid', () => {
  test.each([
    // valid
    [14400000, true],
    [Number.MAX_SAFE_INTEGER, true],
    [Date.now(), true],
    [1562851996000, true],

    // invalid
    [undefined, false],
    [null, false],
    [{}, false],
    [[], false],
    ['a', false],
    ['JESUSGRATEROL@', false],
    ['Jes15-Gratero_.!', false],
    ['@@', false],
    ['Jes15-Gratero_.as', false],
    ['jesu()', false],
    ['asdjkhxaslkdj546512asdkasd', false],
    ['', false],
    [' ', false],
    ['   ', false],
    [123, false],
    [true, false],
    [14300000, false],
    [Number.MAX_SAFE_INTEGER + 1, false],
    [14400000.5, false],
  ])('isTimestampValid(%s) -> %s', (a, expected) => {
    expect(isTimestampValid(a)).toBe(expected);
  });
});





describe('isObjectValid', () => {
  test.each([
    // valid
    [{}, true, true],
    [{ foo: 'bar', auth: 123, isAdmin: true, obj: { some: 'obj', arr: [1, 2] } }, undefined, true],
    [{ foo: 'bar', auth: 123, isAdmin: true, obj: { some: 'obj', arr: [1, 2] } }, true, true],

    // invalid
    [undefined, undefined, false],
    [null, undefined, false],
    [{}, false, false],
    [[], false, false],
    [[], true, false],
    ['a', undefined, false],
    ['JESUSGRATEROL@', undefined, false],
    ['Jes15-Gratero_.!', undefined, false],
    ['@@', undefined, false],
    ['Jes15-Gratero_.as', undefined, false],
    ['jesu()', undefined, false],
    ['asdjkhxaslkdj546512asdkasd', undefined, false],
    ['', undefined, false],
    [' ', undefined, false],
    ['   ', undefined, false],
    [123, undefined, false],
    [true, undefined, false],
  ])('isObjectValid(%s, %s) -> %s', (a, b, expected) => {
    expect(isObjectValid(a, b)).toBe(expected);
  });
});





describe('isArrayValid', () => {
  test.each([
    // valid
    [[], true, true],
    [[1, 2, 3], undefined, true],
    [['a', 'b', 'c'], undefined, true],
    [[[1, 2], [3, 4], [5, 6]], false, true],

    // invalid
    [undefined, undefined, false],
    [null, undefined, false],
    [{}, undefined, false],
    [[], false, false],
    ['a', undefined, false],
    ['JESUSGRATEROL@', undefined, false],
    ['Jes15-Gratero_.!', undefined, false],
    ['@@', undefined, false],
    ['Jes15-Gratero_.as', undefined, false],
    ['jesu()', undefined, false],
    ['asdjkhxaslkdj546512asdkasd', undefined, false],
    ['', undefined, false],
    [' ', undefined, false],
    ['   ', undefined, false],
    [123, undefined, false],
    [true, undefined, false],
  ])('isArrayValid(%s, %s) -> %s', (a, b, expected) => {
    expect(isArrayValid(a, b)).toBe(expected);
  });
});





describe('isSlugValid', () => {
  test.each([
    // valid
    ['jesusgraterol', undefined, undefined, true],
    ['JESUSGRATEROL', undefined, undefined, true],
    ['Jes15-Graterol_.', undefined, undefined, true],
    ['je', undefined, undefined, true],
    ['15', undefined, undefined, true],
    ['xD', undefined, undefined, true],
    ['Herassio-.', undefined, undefined, true],
    ['PythonWiz333', undefined, undefined, true],
    ['restAPI12.-_', undefined, undefined, true],
    ['__', undefined, undefined, true],

    // ranges
    ['j', 2, 5, false],
    ['je', 2, 5, true],
    ['jes', 2, 5, true],
    ['jesu', 2, 5, true],
    ['jesus', 2, 5, true],
    ['jesusg', 2, 5, false],

    // invalid
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    ['a', undefined, undefined, false],
    ['JESUSGRATEROL@', undefined, undefined, false],
    ['Jes15-Gratero_.!', undefined, undefined, false],
    ['@@', undefined, undefined, false],
    ['Jes15-Gratero_.as', undefined, undefined, false],
    ['jesu()', undefined, undefined, false],
    ['asdjkhxaslkdj546512asdkasd', undefined, undefined, false],
    ['', undefined, undefined, false],
    [' ', undefined, undefined, false],
    ['   ', undefined, undefined, false],
    [123, undefined, undefined, false],
    [true, undefined, undefined, false],
  ])('isSlugValid(%s, %d, %d) -> %s', (a, b, c, expected) => {
    expect(isSlugValid(a, b, c)).toBe(expected);
  });
});





describe('isPasswordValid', () => {
  test.each([
    // valid
    ['aaaaaA7!', undefined, undefined, true],
    ['aA1!aaaaK', undefined, undefined, true],
    ['Jes15-Graterol_.', undefined, undefined, true],
    ['Herassio-.5', undefined, undefined, true],
    ['PythonWiz333@', undefined, undefined, true],
    ['restAPI12.-_', undefined, undefined, true],
    ['@>|4xtZx', undefined, undefined, true],
    ['zR<q%+r2C,&fy.SE&~.(REXTqe4K[?>GCi_]|52QGzl&6+ru0!', undefined, undefined, true],
    ['f[(44fCFUn;%5_&:)QWl8|cnH>dC[hnP^%T>_X.k0:>jd)qERc_-!HkBn.pc@^8!BpxfRP)2MH1/zoID8aHU/^RgKj#ylC8P6B-tl#!M6/_LBx^o~0Wle/_MADm++|:/</Vm/pOPktJhVT>:R~?&,nsf]shnBVom7tDRklH*D-xXI~:bu]vRiSg^AWpC7RH]c#KRe^-:(CKrElFg>8/En]CI]c*o__7Q;!@,XkJN+vdVzK/^m?J]k8,/t@rQ/fjH?fb;x/_rxe,kf5y](#*XF<*H,mAy#p%H^TTGl(NdW,bt<dd1ahaV9W@5.^/Amr40VE<SVl1~cnhs(&kTNoo(Dy/LOT3a2(zgm>]CUG%AvD^*_YYZe~z6Pl~69dv,Mijc-fZ>&wJ(LxRF1#KjPqfq1?l6H+7qWz/H/hjed)s>W)n*jid*U|kx>7q772EVtpAjzB.@1Oij-wC8M/fsHG?5N9)g)c#!iPuY8l.rCrY,?qAyu_R(hl;op?2_Lk?^MIUayzz1r(JU7c!eUgS:jc><RCwnXrB/(!Kg%[ie>eBMa|bRk05!+2/.;ZfXnrFTA3b.kB5GCR+?gN3b?QMf<fZ21Tz@N[--HeS!YO<.Gt8Khze9[RCX&wzL()kMJoa0DhH7a8,rJg+agmuc(d:NbHpLFm|a6fB4SoH|Eg_eOy9lT|Woz3&>#1TPX?&|%C6MX+rK12m1:#z^^d|lxB![>a>ySJTTG+!XvO?objieNyXB@&9%n|QzXdSK@f+!ov~dsF;7:@uHF32d(&ul^qP,(?HnX);67*Fw&/@B.k~l&9~,**H|d2V9?C2Xoj6l%zU%B+?uuzhSrB>r8)tJ5/,H+fl4&+~>],l.0vn&df*Z~p76x%a|7TrZ(Sl|<O|:%m#b#h[k.y5HdC8gBZGu9,H[-6Q%NEHCLQ>/J|9gNtcVa4Li<o)reeKRV@_CMf]F,i_Zkh.iCz<Ld9f*v4b25wKEABcj&ABebXbIQ/pq1N0dVW|(o9_O2Bpx35P).d+r?WkX,?s%FI4?PVw<@pBOR&qKR]nrBG9^r@~tDn)+xG5-!OVdw^xnnvDv0H*]m3E%2)7|!QM;/L:gh#zNd59pc9U5fy&s%.bu@5@jai8Of0/e^>HOykhW+0S[s+M~5.<|ulCOz8l@EK*WlTwF.h2xb3(/<|OTy6!9|#PZUa,BVZgFue12+:45-z1|9*D-RZ8KC6~#>KSls>(Y%88blLU(gDPPp+PQo*1GOY&A~gLV%^U3<amtsS<rs&_hQ^c3C;H!wc.C2j!<rvav/%TkAI%kD@.?,#KX*SV+DI0YCxXh^!FfSIugN</jVS7y&J!-3cLMQgDK1-?nBecH,~p2KXcF-4ykz,&wOMJ7d3l*HsY-^Ogn:MD3E+j3Gq3.gl9B1T8XxPWt(0mK?Eyu1#t/@ge+b~.Iw?4CQ)UI?2Y4^O5M@P-JPY>Q_i1]o!6B#O)o:/W>*#|+)My>9fj~))]Ikbyv1Ph[K[+0rs+3HhqAVxtAuoTa+0]K4_,o0IuE0Dmxk?agyA7X__KR)HczHPT?&F+~M4du|vy]>e;5ms?lea*@Vm9H@M1A11#ukC@l<M/cIAukW5]VIdTL(OfLG>wR.9>5?b*Xw+^C(%%z!nIiq.>iJVzX_BT>]KKJ5o[A_ZK;C1z+I>vL-_4fyT2r>b|Dg!r.eta:hzU]Of;xqu9ctq1qgz.PTOe!nUYnOlOd|G[f;eIU0B~5pT88SZs,)~<XwX0]]mmVwiwQH8en%)E*m&!a)qWFzfKFkuc21++O44FF/YJJE3^7enkN5;uTcVZ35plA:J7;-:~)nz.8.@+mYpSUCG6JV>0(3|8Yipds|,OpK1/b)TJn6Nt~%Jb*0J5EIIlAADs-38Kcf<vO<a],z-B@^|CLng2[6:40q6v9v1PdYPzmzls4A-iDh1#JA21DA#kch69ql+Bnm2bc%lI>y@m_LJu>@~R<gwvXF(ahnlrnZ_]cf,mNMXaiIYfr#Nm,N@mXC@b^8;wr3F#MX[<1?7mKvTnE:m~+KL,,1Z&FPpsD)|DuHHXRBTi2', undefined, undefined, true],

    // invalid
    [undefined, undefined, undefined, false],
    [null, undefined, undefined, false],
    [{}, undefined, undefined, false],
    [[], undefined, undefined, false],
    ['a', undefined, undefined, false],
    ['JESUSGRATEROL@', undefined, undefined, false],
    ['Jes15-G', undefined, undefined, false],
    ['@@', undefined, undefined, false],
    ['jes15-gratero_.as', undefined, undefined, false],
    ['jesu()', undefined, undefined, false],
    ['asdjkhxaslkdj546512asdkasd', undefined, undefined, false],
    ['', undefined, undefined, false],
    ['          ', undefined, undefined, false],
    ['12345678', undefined, undefined, false],
    ['jesSS-gratero_.as', undefined, undefined, false],
    ['aaaaaaaa', undefined, undefined, false],
    ['aaaa1111', undefined, undefined, false],
    ['!!!!!!!!', undefined, undefined, false],
    ['AAAAAAAA', undefined, undefined, false],
    ['AAAAAA665', undefined, undefined, false],
    ['A5/5fZf', undefined, undefined, false],
    [123, undefined, undefined, false],
    [true, undefined, undefined, false],
  ])('isPasswordValid(%s, %d, %d) -> %s', (a, b, c, expected) => {
    expect(isPasswordValid(a, b, c)).toBe(expected);
  });
});
