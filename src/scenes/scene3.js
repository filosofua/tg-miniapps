export default {
  id: 'scene3',
  title: 'Заправка у трассы',
  background: 'gas',
  steps: [
    {
      type: 'dialogue',
      speaker: 'Подросток у столика',
      text: 'Томми вчера брал у нас фонарь. Говорил, что ночью пойдёт на завод проверить легенду про шёпот из труб.',
    },
    {
      type: 'choice',
      text: 'Как расспросишь ребят?',
      options: [
        { label: 'Спокойно, по-дружески', moral: 1, next: 2 },
        { label: 'Прижать и напугать криптидой', fear: 1, investigation: 1, next: 3 },
        { label: 'Пообещать прикрыть выходной', investigation: 1, moral: -1, next: 2 },
      ],
    },
    {
      type: 'dialogue',
      speaker: 'Девушка у колонки',
      text: 'Мы видели пикап с номером K-47 у завода. Фары мигали, будто водитель нервничал.',
    },
    {
      type: 'add_item',
      item: 'Номер K-47',
      text: 'Ты записываешь номер пикапа в блокнот.',
    },
    {
      type: 'transition',
      text: 'До завода меньше мили. Туман густеет, вдалеке слышны гудки.',
      nextScene: 'scene4',
    },
  ],
};
