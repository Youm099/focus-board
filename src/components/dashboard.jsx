import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('focus_board_tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error("Failed to parse stored tasks from Local Storage", e);
      }
    }
    return [
      { id: 1, title: 'Finish project proposal draft', category: 'Project', status: 'Active' },
      { id: 2, title: 'Schedule dentist appointment', category: 'Personal', status: 'Completed' },
      { id: 3, title: 'Read research paper on transformers', category: 'Study', status: 'Active' },
      { id: 4, title: 'Review Chapter 4 - Linear Algebra', category: 'Study', status: 'Completed' },
      { id: 5, title: 'Set up CI pipeline for API repo', category: 'Project', status: 'Completed' }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Study');
  
  const [filter, setFilter] = useState('Active'); 
  const [sortBy, setSortBy] = useState('Default'); 

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [timerMode, setTimerMode] = useState('Focus'); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('focus_board_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let modeMinutes = 45;
    if (timerMode === 'Short') modeMinutes = 5;
    if (timerMode === 'Long') modeMinutes = 15;
    setTimeLeft(modeMinutes * 60);
    setIsRunning(false);
  }, [timerMode]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    let modeMinutes = timerMode === 'Focus' ? 25 : timerMode === 'Short' ? 5 : 15;
    setTimeLeft(modeMinutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      status: 'Active',
    };
    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setIsAdding(false);
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Completed' : 'Active' } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveTaskEdit = (id) => {
    if (!editingTitle.trim()) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editingTitle } : t));
    setEditingId(null);
    setEditingTitle('');
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const activeCount = tasks.filter(t => t.status === 'Active').length;
  const completionPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryStats = (cat) => {
    const catTasks = tasks.filter(t => t.category === cat);
    const done = catTasks.filter(t => t.status === 'Completed').length;
    return { done, total: catTasks.length };
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return t.status === 'Active';
    if (filter === 'Completed') return t.status === 'Completed';
    return true;
  });

  const processedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'Category') return a.category.localeCompare(b.category);
    if (sortBy === 'Status') return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <div className="dashboard-container">
      
      <header className="focus-board-header">
        <h1>Focus Board</h1>
        <p className="subtitle">PERSONAL TASK & STUDY TRACKER</p>
      </header>

      <div className="dashboard-left">
        <div className="focus-card">
          <div className="progress-section">
            <div className="progress-circle-wrapper">
              <svg className="progress-circle" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray={`${completionPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="percentage-text">{completionPercentage}%</div>
            </div>
            <div className="progress-text-summary">
              <h3>{completedCount} of {totalCount} done</h3>
              <p>{activeCount} remaining</p>
            </div>
          </div>
        </div>

        <section className="categories-box">
          <h4>BY CATEGORY</h4>
          {['Study', 'Personal', 'Project'].map(cat => {
            const stats = getCategoryStats(cat);
            const barWidth = stats.total ? (stats.done / stats.total) * 100 : 0;
            return (
              <div key={cat} className="category-row">
                <div className="category-label">
                  <span className={`icon-indicator ${cat.toLowerCase()}`}></span>
                  {cat}
                </div>
                <div className="progress-bar-container">
                  <div className={`progress-bar-fill ${cat.toLowerCase()}`} style={{ width: `${barWidth}%` }}></div>
                </div>
                <div className="category-fraction">{stats.done}/{stats.total}</div>
              </div>
            );
          })}
        </section>

        <section className="pomodoro-box">
          <div className="pomodoro-tabs">
            {['Focus', 'Short', 'Long'].map(mode => (
              <button key={mode} className={`tab-btn ${timerMode === mode ? 'active' : ''}`} onClick={() => setTimerMode(mode)}>
                {mode}
              </button>
            ))}
          </div>
          
          <div className="timer-display-container">
            <div className="timer-circle-ui">
              <h2>{formatTime(timeLeft)}</h2>
              <p>{timerMode === 'Focus' ? 'Focus' : timerMode === 'Short' ? 'Short Break' : 'Long Break'}</p>
            </div>
          </div>

          <div className="timer-controls">
            <button className="reset-btn" onClick={resetTimer}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </button>
            <button className={`start-stop-btn ${isRunning ? 'running' : ''}`} onClick={toggleTimer}>
              {isRunning ? 'Pause' : 'Start'}
            </button>
          </div>
        </section>
      </div>

      <div className="dashboard-right">
        <section className="task-manager-box">
          {!isAdding ? (
            <button className="add-task-trigger-btn" onClick={() => setIsAdding(true)}>
              <span className="plus-icon">+</span> Add Task
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="new-task-form">
              <input 
                type="text" 
                placeholder="Task title..." 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                maxLength={120}
                autoFocus
              />
              <div className="form-controls-row">
                <div className="category-selector-group">
                  {['Study', 'Personal', 'Project'].map(cat => (
                    <button 
                      type="button" 
                      key={cat} 
                      className={`cat-select-btn ${newCategory === cat ? 'selected' : ''}`}
                      onClick={() => setNewCategory(cat)}
                    >
                      <span className={`icon-indicator ${cat.toLowerCase()}`}></span> {cat}
                    </button>
                  ))}
                </div>
                <div className="form-action-btns">
                  <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                  <button type="submit" className="submit-task-btn">Add Task</button>
                </div>
              </div>
            </form>
          )}

          <div className="filters-toolbar">
            <div className="status-filters">
              <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All <span className="badge">{totalCount}</span></button>
              <button className={filter === 'Active' ? 'active' : ''} onClick={() => setFilter('Active')}>Active <span className="badge">{activeCount}</span></button>
              <button className={filter === 'Completed' ? 'active' : ''} onClick={() => setFilter('Completed')}>Completed <span className="badge">{completedCount}</span></button>
            </div>
            
            <div className="sort-dropdown-container">
              <label>Sort: </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="Default">Default</option>
                <option value="Category">Category</option>
                <option value="Status">Status</option>
              </select>
            </div>
          </div>

          <div className="tasks-list">
            {processedTasks.map(task => (
              <div key={task.id} className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}>
                
                {editingId === task.id ? (
                  <div className="task-item-edit-mode" style={{ display: 'flex', width: '100%', gap: '12px', alignItems: 'center' }}>
                    <input 
                      type="text"
                      className="task-inline-edit-input"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      style={{ flexGrow: 1, border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '6px', outline: 'none' }}
                      autoFocus
                    />
                    <button className="submit-task-btn" onClick={() => saveTaskEdit(task.id)} style={{ padding: '6px 12px' }}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="task-item-left">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'Completed'} 
                        onChange={() => toggleTaskStatus(task.id)}
                      />
                      <span className="task-title-text">{task.title}</span>
                    </div>
                    <div className="task-item-right">
                      <span className={`category-tag ${task.category.toLowerCase()}`}>
                        <span className={`icon-indicator ${task.category.toLowerCase()}`}></span>
                        {task.category}
                      </span>
                      
                      <button className="delete-task-btn" onClick={() => startEditing(task)} title="Edit Task" style={{ marginRight: '4px' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>

                      <button className="delete-task-btn" onClick={() => deleteTask(task.id)} title="Delete Task">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}