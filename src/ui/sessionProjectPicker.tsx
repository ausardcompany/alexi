import React, { useState } from 'react';

const SessionProjectPicker = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectChange = (project) => {
    setSelectedProject(project);
  };

  return (
    <div>
      <select onChange={(e) => handleProjectChange(e.target.value)}>
        {/* Options dynamically loaded */}
      </select>
    </div>
  );
};

export default SessionProjectPicker;