const scene6 = {
  id: 'scene6',
  title: 'Финал — «Ashwood, 1976»',
  background: 'city',
  steps: [
    { type: 'dialogue', speaker: 'Шеф Холден', text: 'Томми жив. Но город шумит: кто-то видел мерцающие огни у холмов.' },
    {
      type: 'choice',
      text: 'Отчёт для шефа',
      options: [
        { label: 'Доложить честно', moral: 1, next: 3 },
        { label: 'Скрыть детали про монстра', investigation: -1, moral: -1, next: 3 },
        { label: 'Предложить рейд на завод', investigation: 1, fear: 1, next: 3 },
      ],
    },
    { type: 'dialogue', speaker: 'Нарратив', text: 'Ты фиксируешь отчёт, NFT-файл для архивов и готовишься к новой смене.' },
    { type: 'end', label: 'Финал расследования' },
  ],
};

export default scene6;
