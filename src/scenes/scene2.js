const scene2 = {
  id: 'scene2',
  title: 'Дом Харперов',
  background: 'home',
  steps: [
    { type: 'dialogue', speaker: 'Миссис Харпер', text: 'Наш сын Томми исчез вечером. Он говорил про огни у старого завода.' },
    {
      type: 'choice',
      text: 'Как ведёшь диалог?',
      options: [
        { label: 'Успокоить и поддержать', moral: 1, next: 3 },
        { label: 'Жёстко требовать детали', investigation: 1, moral: -1, next: 3 },
        { label: 'Осторожно спросить про слухи', investigation: 1, fear: -1, next: 3 },
      ],
    },
    { type: 'dialogue', speaker: 'Мистер Харпер', text: 'Сосед видел старый пикап на дороге к заправке. Может, туда?' },
    { type: 'add_item', item: 'Фото Томми', next: 5 },
    { type: 'goto', target: 'scene3' },
  ],
};

export default scene2;
