export default {
  id: 'scene4',
  title: 'Периметр завода',
  background: 'factory',
  steps: [
    {
      type: 'dialogue',
      speaker: 'Радио',
      text: 'Шеф: будь на связи. Патруль будет через 20 минут. Не лезь внутрь один.',
    },
    {
      type: 'choice',
      text: 'Как двигаешься?',
      options: [
        { label: 'Обойти по холму', investigation: 1, moral: 1, next: 2 },
        { label: 'Сразу в дверь с логотипом', fear: -1, investigation: 1, next: 3 },
        { label: 'Тихо в тени труб', fear: 1, next: 2 },
      ],
    },
    {
      type: 'dialogue',
      speaker: 'Тени',
      text: 'Ты находишь следы кроссовок и отпечаток пикапа в грязи. След ведёт к цеху с сорванным замком.',
    },
    {
      type: 'add_item',
      item: 'След кроссовок',
      text: 'Запоминаешь узор подошвы — пригодится в отчёте.',
    },
    {
      type: 'transition',
      text: 'Сорванный замок ведёт вглубь завода. Внутри гул и запах сырости.',
      nextScene: 'scene5',
    },
  ],
};
