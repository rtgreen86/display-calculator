const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const rl = readline.createInterface({ input: stdin, output: stdout });

const inputResolution = async (defaultValue = '2560x1440') => {
  do {
    const raw = (await rl.question(`Введите разрешение дисплея (${defaultValue}): `)) || defaultValue;
    const parsed = (/(\d+)x(\d+)/i).exec(raw);
    if (parsed !== null) {
      const [, x, y] = parsed;
      const parsedX = parseInt(x, 10);
      const parsedY = parseInt(y, 10);
      if (!isNaN(parsedX) && !isNaN(parsedY)) return [parsedX, parsedY];
    }
    console.error('Неверный формат разрешения. Пожалуйста повторите ввод.');
  } while(true);
};

const inputSize = async (defaultValue = '27') => {
  do {
    const raw = (await rl.question(`Введите диагональ экрана в дюймах (${defaultValue}): `)) || defaultValue;
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
    console.error('Неверное значение диагонали. Пожалуйста повторите ввод.');
  } while (true);
};

(async () => {
  const [resX, resY] = await inputResolution();
  const dispSizeInches = await inputSize();
  const wantedPPI = 96;
  const alpha = Math.atan(resX / resY);
  const sizeYInch = dispSizeInches * Math.cos(alpha);
  const sizeXInch = dispSizeInches * Math.sin(alpha);
  const ppiX = resX / sizeXInch;
  const ppiY = resY / sizeYInch;
  const xScale = wantedPPI / 100 * ppiX;

  console.log();
  console.log('Расчёты проведены для монитора с диагональю %i дюймов. Задано разрешение экрана %ix%i. Физические размеры экрана составляют %ix%i дюймов.', dispSizeInches, resX, resY, sizeXInch, sizeYInch);
  console.log('Вычесленное разрешение экрана: %ix%i ppi.', ppiX, ppiY);
  console.log('Рекомендуемый масштаб: %i\%', xScale);
  console.log();
  console.log('OK');
  console.log();

  rl.close();
})();
