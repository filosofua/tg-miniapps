const scene1 = {
  id: 'scene1',
  title: 'Полицейский участок',
  background: 'police',
  steps: [
    { type: 'dialogue', speaker: 'Шеф Холден', text: 'Опять туман, опять шорохи в холмах. Пропал подросток из семьи Харперов.' },
    { type: 'dialogue', speaker: 'Шеф Холден', text: 'Ты наш единственный детектив, который не боится ночных смен. Возьми дело.' },
    {
      type: 'choice',
      text: 'Как отвечаешь шефу?',
      options: [
        { label: 'Коротко: «Сделаю»', investigation: 1, next: 3 },
        { label: 'С сарказмом', moral: -1, next: 3 },
        { label: 'С тревогой', fear: 1, next: 3 },
      ],
    },
    { type: 'dialogue', speaker: 'Шеф Холден', text: 'Поезжай к Харперам. Они ждут. И постарайся не умножить панику.' },
    { type: 'add_item', item: 'Досье Харперов', next: 5 },
    { type: 'goto', target: 'scene2' },
  ],
};

export default scene1;
