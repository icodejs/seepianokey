import React from 'react';

export default ({ rows }) => {
  return (
    <div className="info">
      {rows.map((row, index) => {
        return (
          <div key={`row-${index}`}>{row}</div>
        )
      })}
    </div>
  );
};
