import React from 'react';

const Leaderboard = ({ leaderboard = [], referrals = [], onAddMock }) => (
  <div className="shell-card subdued">
    <div className="card-header">
      <h2>Лидерборд друзей</h2>
      <p>Сравните расследование и добычу монет. Инвайты: {referrals.length}</p>
    </div>
    <div className="table">
      <div className="table-head">
        <span>#</span>
        <span>Имя</span>
        <span>Inv</span>
        <span>Время</span>
        <span>Монеты</span>
      </div>
      {leaderboard.map((row, idx) => (
        <div className="table-row" key={row.id}>
          <span>{idx + 1}</span>
          <span>{row.name}</span>
          <span>{row.investigation}</span>
          <span>{row.time || '—'}</span>
          <span>{row.coins ?? 0}</span>
        </div>
      ))}
    </div>
    {onAddMock && (
      <button className="ghost" onClick={onAddMock}>
        Добавить друга (demo)
      </button>
    )}
  </div>
);

export default Leaderboard;
