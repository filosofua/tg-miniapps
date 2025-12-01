import React from 'react';

const Leaderboard = ({ leaderboard = [], referrals = [], onAddMock }) => (
  <div className="shell-card">
    <div className="card-header">
      <h3>Лидерборд друзей</h3>
      <p>Сортировка по Investigation, затем по времени прохождения.</p>
    </div>
    <div className="table">
      <div className="table-head">
        <div>#</div>
        <div>Игрок</div>
        <div>Inv</div>
        <div>Время</div>
        <div>Coins</div>
      </div>
      {leaderboard.map((row, idx) => (
        <div className="table-row" key={row.id}>
          <div>{idx + 1}</div>
          <div>{row.name}</div>
          <div>{row.investigation}</div>
          <div>{row.time}s</div>
          <div>{row.coins}</div>
        </div>
      ))}
    </div>
    <p className="dialogue-text">Рефералов: {referrals.length}</p>
    <div className="controls-row">
      <button onClick={onAddMock}>Добавить друга</button>
    </div>
  </div>
);

export default Leaderboard;
