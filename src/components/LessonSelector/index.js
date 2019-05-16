import React from 'react';

import './LessonSelector.scss';

export default ({ lessons, selectedLesson, onLessonSelection }) => (
  <form className="lesson-selector">
    <label>
      <select
        value={selectedLesson}
        onChange={onLessonSelection}
      >
        <option value="-1">Choose lesson</option>
        {lessons.map(lesson => {
          return (
            <option key={lesson} value={lesson}>
              {lesson}
            </option>
          );
        })}
      </select>
    </label>
  </form>
);
