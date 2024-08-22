import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './style.css';

function App() {
  const [mood, setMood] = useState('');
  const [moodList, setMoodList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const moodOptions = ['Happy', 'Sad', 'Angry', 'Anxious', 'Excited', 'Calm','Creative','Depressed', 'Sarcastic'];

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

  const [moodIntensity, setMoodIntensity] = useState(5);

const handleIntensityChange = (e) => {
  setMoodIntensity(e.target.value);
};

const [moodNote, setMoodNote] = useState('');

const handleNoteChange = (e) => {
  setMoodNote(e.target.value);
};



const handleAddMood = () => {
  if (mood !== '') {
    const newMood = { mood, intensity: moodIntensity, note: moodNote, date: new Date().toLocaleString() };
    if (editingIndex !== null) {
      const updatedMoodList = [...moodList];
      updatedMoodList[editingIndex] = newMood;
      setMoodList(updatedMoodList);
      setEditingIndex(null);
    } else {
      setMoodList([...moodList, newMood]);
    }
    setMood('');
    setMoodIntensity(5);
    setMoodNote(''); // Reset note
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
    <div className="container">
      <h1>Mood Tracker</h1>

      <div className="form-group">
        <select value={mood} onChange={handleMoodChange}>
          <option value="">Select your mood</option>
          {moodOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <input
          type="range"
          min="1"
          max="10"
          value={moodIntensity}
          onChange={handleIntensityChange}
        />
        <span>Intensity: {moodIntensity}</span>
      </div>

      <div className="form-group">
        <textarea
          value={moodNote}
          onChange={handleNoteChange}
          placeholder="Add a note (optional)"
        />
      </div>

      <div className="form-group">
        <button onClick={handleAddMood}>
          {editingIndex !== null ? 'Update Mood' : 'Add Mood'}
        </button>
      </div>

      <ul className="mood-list">
        {moodList.map((entry, index) => (
          <li key={index}>
            <strong>{entry.mood}</strong> <em>on {entry.date}</em>
            <p><strong>Intensity:</strong> {entry.intensity}</p>
            {entry.note && <p><strong>Note:</strong> {entry.note}</p>}
            <button onClick={() => handleEditMood(index)} style={{ marginLeft: '10px' }}>
              Edit
            </button>
            <button onClick={() => handleDeleteMood(index)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="chart-container">
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;
