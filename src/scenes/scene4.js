const scene4 = {
  id: 'scene4',
  title: 'Заброшенный завод',
  background: 'factory',
  steps: [
    { type: 'dialogue', speaker: 'Нарратив', text: 'Трубы завода стонут на ветру. На стенах — свежие следы грязи.' },
    {
      type: 'choice',
      text: 'Как исследуешь завод?',
      options: [
        { label: 'Идти по следам внутрь', investigation: 1, fear: 1, next: 3 },
        { label: 'Осмотреть периметр', investigation: 1, moral: 1, next: 3 },
        { label: 'Позвать Томми', fear: -1, moral: 1, next: 3 },
      ],
    },
    { type: 'dialogue', speaker: 'Нарратив', text: 'Внутри слышно шёпот и стук. В дальнем цеху мерцает свет.' },
    { type: 'goto', target: 'scene5' },
  ],
};

export default scene4;
