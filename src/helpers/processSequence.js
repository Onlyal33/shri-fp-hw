/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

/* Берем строку N. Пишем изначальную строку в writeLog.
Строка валидируется по следующим правилам:
кол-во символов в числе должно быть меньше 10.
кол-во символов в числе должно быть больше 2.
число должно быть положительным
символы в строке только [0-9] и точка т.е. число в 10-ной системе счисления (возможно с плавающей запятой)
В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента
Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.
C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog
Взять кол-во символов в полученном от API числе записать в writeLog
Возвести в квадрат с помощью Javascript записать в writeLog
Взять остаток от деления на 3, записать в writeLog
C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге
 */
import {
  __,
  allPass,
  andThen,
  assoc,
  compose,
  concat,
  gt,
  ifElse,
  length,
  lt,
  mathMod,
  otherwise,
  partial,
  prop,
  tap,
  test,
} from 'ramda';
import Api from '../tools/api';

const api = new Api();

const gtTwo = gt(__, 2);
const ltTen = lt(__, 10);
const lengthGreaterThanTwo = compose(gtTwo, length);
const lengthLowerThanTen = compose(ltTen, length);
const containsOnlyNumbers = test(/^[0-9]+\.?[0-9]+$/);
const validate = allPass([
  lengthGreaterThanTwo,
  lengthLowerThanTen,
  containsOnlyNumbers,
]);

const stringToRoundedNumber = compose(Math.round, Number);

const assocNumberParamToParams = assoc('number', __, { from: 10, to: 2 });
const asyncApiGetBinaryNumber = compose(
  api.get('https://api.tech/numbers/base'),
  assocNumberParamToParams
);

const getParamResult = compose(String, prop('result'));
const asyncGetParamResult = andThen(getParamResult);

const asyncGetLength = andThen(length);

const square = (num) => num ** 2;
const asyncSquare = andThen(square);

const modThreeToString = compose(String, mathMod(__, 3));
const asyncModThreeToString = andThen(modThreeToString);

const asyncConcatIdToAnimalsUrl = andThen(concat('https://animals.tech/'));

const asyncApiGetRequestWithEmptyParams = andThen(api.get(__, {}));

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapLog = tap(writeLog);
  const asyncTapLog = andThen(tapLog);
  const asyncHandleSuccess = andThen(handleSuccess);
  const asyncHandleError = otherwise(handleError);

  const handleValidationError = partial(handleError, ['ValidationError']);

  const mainSequence = compose(
    asyncHandleError,
    asyncHandleSuccess,
    asyncGetParamResult,
    asyncApiGetRequestWithEmptyParams,
    asyncConcatIdToAnimalsUrl,
    asyncTapLog,
    asyncModThreeToString,
    asyncTapLog,
    asyncSquare,
    asyncTapLog,
    asyncGetLength,
    asyncTapLog,
    asyncGetParamResult,
    asyncApiGetBinaryNumber,
    tapLog,
    stringToRoundedNumber
  );

  const runValidated = ifElse(
    validate,
    mainSequence,
    handleValidationError
  );
  const run = compose(runValidated, tapLog);

  run(value);
};

export default processSequence;
