import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';


function App() {
  const [mood, setMood] = useState('');
  const [moodList, setMoodList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedMoods = JSON.parse(localStorage.getItem('moodList'));
    if (storedMoods) {
      setMoodList(storedMoods);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodList', JSON.stringify(moodList));
  }, [moodList]);

  const handleMoodChange = (e) => {
    setMood(e.target.value);
  };

  const handleAddMood = () => {
    if (mood !== '') {
      if (editingIndex !== null) {
        const updatedMoodList = [...moodList];
        updatedMoodList[editingIndex] = { mood, date: new Date().toLocaleString() };
        setMoodList(updatedMoodList);
        setEditingIndex(null);
      } else {
        setMoodList([...moodList, { mood, date: new Date().toLocaleString() }]);
      }
      setMood('');
    }
  };

  const handleEditMood = (index) => {
    setMood(moodList[index].mood);
    setEditingIndex(index);
  };

  const handleDeleteMood = (index) => {
    const updatedMoodList = moodList.filter((_, i) => i !== index);
    setMoodList(updatedMoodList);
  };

  const moodData = moodList.map(entry => entry.mood);
  const dates = moodList.map(entry => entry.date);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Mood Over Time',
        data: moodData.map(m => m.length), // Example: use mood length to plot (you can change this)
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Deena's Personal Mood Tracker</h1>
      <input
        type="text"
        value={mood}
        onChange={handleMoodChange}
        placeholder="How are you feeling today?"
        style={{ padding: '10px', width: '300px' }}
      />
      <button onClick={handleAddMood} style={{ marginLeft: '10px', padding: '10px' }}>
        {editingIndex !== null ? 'Update Mood' : 'Add Mood'}
      </button>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {moodList.map((entry, index) => (
          <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <strong>{entry.mood}</strong> <em>on {entry.date}</em>
            <button onClick={() => handleEditMood(index)} style={{ marginLeft: '10px' }}>
              Edit
            </button>
            <button onClick={() => handleDeleteMood(index)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div style={{ maxWidth: '600px', margin: '0 auto', marginTop: '50px' }}>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;
