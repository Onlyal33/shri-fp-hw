/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  allPass,
  equals,
  prop,
  compose,
  identity,
  values,
  countBy,
  gte,
  __,
  dissoc,
  any,
  propEq,
  complement,
} from 'ramda';

import { COLORS, SHAPES } from '../constants';

const isWhite = equals(COLORS.WHITE);
const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
const isOrange = equals(COLORS.ORANGE);
const isBlue = equals(COLORS.BLUE);
const getGreen = prop(COLORS.GREEN);
const dissocWhite = dissoc(COLORS.WHITE);
const twoGreens = propEq(COLORS.GREEN, 2);
const oneReds = propEq(COLORS.RED, 1);

const getStar = prop(SHAPES.STAR);
const getTriangle = prop(SHAPES.TRIANGLE);
const getSquare = prop(SHAPES.SQUARE);
const getCircle = prop(SHAPES.CIRCLE);

const isWhiteTriangle = compose(isWhite, getTriangle);
const isWhiteCircle = compose(isWhite, getCircle);
const isGreenSquare = compose(isGreen, getSquare);
const isRedStar = compose(isRed, getStar);
const isWhiteStar = compose(isWhite, getStar);
const isWhiteSquare = compose(isWhite, getSquare);
const isOrangeSquare = compose(isOrange, getSquare);
const isBlueCircle = compose(isBlue, getCircle);
const isGreenTriangle = compose(isGreen, getTriangle);

const isNotRedStar = complement(isRedStar);
const isNotWhiteStar = complement(isWhiteStar);
const isNotWhiteSquare = complement(isWhiteSquare);
const isNotWhiteTriangle = complement(isWhiteTriangle);

const getNumberOfColors = compose(countBy(identity), values);
const getNumberOfColorsWithoutWhite = compose(dissocWhite, getNumberOfColors);
const getNumberOfGreens = compose(getGreen, getNumberOfColors);
const twoGreenColors = compose(twoGreens, getNumberOfColors);
const oneRedColor = compose(oneReds, getNumberOfColors);

const everyHasColor = (color) => compose(propEq(color, 4), getNumberOfColors);

const isGreaterThenOrEqualTwo = gte(__, 2);
const isGreaterThenOrEqualThree = gte(__, 3);
const anyGreaterThenOrEqualThree = any(isGreaterThenOrEqualThree);

const redsEqualBlues = ({ [COLORS.BLUE]: blue, [COLORS.RED]: red }) =>
  equals(blue, red);
const squareEqualsTriangle = ({
  [SHAPES.SQUARE]: square,
  [SHAPES.TRIANGLE]: triangle,
}) => equals(square, triangle);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isRedStar,
  isGreenSquare,
  isWhiteTriangle,
  isWhiteCircle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
  isGreaterThenOrEqualTwo,
  getNumberOfGreens
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(redsEqualBlues, getNumberOfColors);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isRedStar,
  isOrangeSquare,
  isBlueCircle,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
  anyGreaterThenOrEqualThree,
  values,
  getNumberOfColorsWithoutWhite
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isGreenTriangle,
  twoGreenColors,
  oneRedColor,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = everyHasColor(COLORS.ORANGE);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = everyHasColor(COLORS.GREEN);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  isNotWhiteSquare,
  isNotWhiteTriangle,
  squareEqualsTriangle,
]);
