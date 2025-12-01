import React from 'react';

const upgradeLabels = {
  autoClickRate: 'Автоклик',
  clickMultiplier: 'Множитель клика',
  passiveIncome: 'Пассивный доход',
};

const FarmUI = ({ coins, upgrades, onClick, onUpgrade, onExit }) => (
  <div className="shell-card">
    <div className="card-header">
      <h2>Ashwood Coin Farm</h2>
      <p>После дела в Ашвуде детектив подрабатывает сбором улик-монет.</p>
    </div>
    <div className="farm-stats">
      <div className="stat-block">
        <p className="label">Монеты</p>
        <h3>{coins}</h3>
      </div>
      <div className="stat-block">
        <p className="label">Автоклик</p>
        <h3>{upgrades.autoClickRate || 0}/сек</h3>
      </div>
      <div className="stat-block">
        <p className="label">Пассив</p>
        <h3>{upgrades.passiveIncome || 0}/сек</h3>
      </div>
      <div className="stat-block">
        <p className="label">Множитель</p>
        <h3>x{upgrades.clickMultiplier || 1}</h3>
      </div>
    </div>
    <div className="controls-row">
      <button className="primary" onClick={onClick}>Кликнуть +</button>
      <button onClick={onExit}>Вернуться к финалу</button>
    </div>
    <div className="farm-actions">
      {Object.keys(upgradeLabels).map((key) => (
        <button key={key} onClick={() => onUpgrade(key)}>
          {upgradeLabels[key]}
        </button>
      ))}
    </div>
  </div>
);

export default FarmUI;
