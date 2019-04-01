import React from 'react';
export default ({ lessons, selectedLesson, onLessonSelection }) => (
  <form>
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
