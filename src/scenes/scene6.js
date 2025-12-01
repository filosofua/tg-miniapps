export default {
  id: 'scene6',
  title: 'Финал — отчёт шефу',
  background: 'city',
  steps: [
    {
      type: 'dialogue',
      speaker: 'Шеф Холден',
      text: 'Томми жив? Отлично. Но что там было на заводе? Нам нужен отчёт.',
    },
    {
      type: 'choice',
      text: 'Как опишешь происшествие?',
      options: [
        { label: 'Рационально: странный бездомный', moral: 1, next: 2 },
        { label: 'Честно: тень и шёпот', investigation: 1, fear: 1, next: 3 },
        { label: 'Всё скрыть: просто байки', moral: -1, next: 4 },
      ],
    },
    {
      type: 'dialogue',
      speaker: 'Шеф Холден',
      text: 'Ладно, оформим как нападение. Но ты чувствуешь, что это было больше, чем байка.',
    },
    {
      type: 'dialogue',
      speaker: 'Айви из архива',
      text: 'Я нашла похожие записи 1952 года. Возможно, ты столкнулся с тем же существом.',
    },
    {
      type: 'finish',
      text: 'Сделать итоговое заключение и перейти в Ashwood Coin Farm.',
      label: 'Отчёт подан',
    },
  ],
};
