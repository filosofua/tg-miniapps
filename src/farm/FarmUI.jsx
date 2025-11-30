import React from 'react';

const FarmUI = ({ coins, upgrades, onClick, onUpgrade, onExit }) => (
  <div className="shell-card farm">
    <div className="card-header">
      <h2>Ashwood Coin Farm</h2>
      <p>Добывай монеты после расследования. Улучшай авто-клик и пассивный доход.</p>
    </div>
    <div className="farm-stats">
      <div className="stat-block">
        <p className="label">Монеты</p>
        <h3>{coins}</h3>
      </div>
      <div className="stat-block">
        <p className="label">Авто-клик</p>
        <h3>{upgrades.autoClickRate}/c</h3>
      </div>
      <div className="stat-block">
        <p className="label">Множитель</p>
        <h3>x{upgrades.clickMultiplier}</h3>
      </div>
      <div className="stat-block">
        <p className="label">Пассив</p>
        <h3>{upgrades.passiveIncome}/c</h3>
      </div>
    </div>
    <div className="farm-actions">
      <button className="primary" onClick={onClick}>Кликнуть (+)</button>
      <button onClick={() => onUpgrade('autoClickRate')}>Апгрейд авто-клика</button>
      <button onClick={() => onUpgrade('clickMultiplier')}>Апгрейд множителя</button>
      <button onClick={() => onUpgrade('passiveIncome')}>Апгрейд пассива</button>
      <button className="ghost" onClick={onExit}>Вернуться в историю</button>
    </div>
  </div>
);

export default FarmUI;
