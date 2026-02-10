const HabitFragility = ({ habits = [] }) => {
  const fragile = habits.filter(h => h.missed >= 3);

  return (
    <div className="glass card">
      <h4>Fragile Habits</h4>
      <strong className={fragile.length ? 'warn' : 'ok'}>
        {fragile.length}
      </strong>
      <small>
        {fragile.length
          ? fragile.slice(0, 2).map(h => h.name).join(', ')
          : 'All stable'}
      </small>
    </div>
  );
};

export default HabitFragility;
