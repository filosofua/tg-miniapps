export default {
  id: 'scene5',
  title: 'Цех и туман',
  background: 'monster',
  steps: [
    {
      type: 'dialogue',
      speaker: 'Томми',
      text: 'Не подходи! Там кто-то внутри трубы, он шепчет. Я спрятался, но он уже рядом.',
    },
    {
      type: 'choice',
      text: 'Твои действия?',
      options: [
        { label: 'Успокоить Томми и вывести', moral: 1, investigation: 1, next: 3 },
        { label: 'Включить фонарь на полную', fear: -1, investigation: 1, next: 4 },
        { label: 'Сделать запись шёпота', investigation: 2, fear: 1, next: 5 },
      ],
    },
    {
      type: 'dialogue',
      speaker: 'Шёпот',
      text: 'Металл скребёт, из трубы тянется рукавая тень. Фонарь мерцает.',
    },
    {
      type: 'add_item',
      item: 'Томми спасён',
      text: 'Ты прячешь Томми за колонной и ведёшь к выходу.',
    },
    {
      type: 'add_item',
      item: 'Сожжённый фонарь',
      text: 'Фонарь выдает перегрев, но отпугивает тень.',
    },
    {
      type: 'add_item',
      item: 'Запись шёпота',
      text: 'На диктофоне слышны металлические стуки и низкий гул.',
    },
    {
      type: 'transition',
      text: 'Патруль подъезжает. Шеф кричит в рацию. Тень скрывается в тумане, но следы остаются.',
      nextScene: 'scene6',
    },
  ],
};
