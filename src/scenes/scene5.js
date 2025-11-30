const scene5 = {
  id: 'scene5',
  title: 'Цех и туман',
  background: 'monster',
  steps: [
    { type: 'dialogue', speaker: 'Томми', text: 'Кто здесь?.. Я слышал зов. Он хочет, чтобы я остался.' },
    {
      type: 'choice',
      text: 'Что делаешь?',
      options: [
        { label: 'Взять Томми за руку и увести', moral: 1, investigation: 1, next: 3 },
        { label: 'Осмотреть туман ближе', fear: 1, investigation: 1, next: 3 },
        { label: 'Закричать в пустоту', fear: -1, moral: -1, next: 3 },
      ],
    },
    { type: 'dialogue', speaker: 'Нарратив', text: 'Силуэт монстра виднеется в дымке. Но ты успеваешь отступить.' },
    { type: 'goto', target: 'scene6' },
  ],
};

export default scene5;
