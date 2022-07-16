import React, { useState, useEffect } from 'react';
import Footer from './src/components/Footer';
import Note from './src/components/Notes';
import Notification from './src/components/Notification';

// Services
import services from './services/notes';

const App = () => {
  // UseEffect
  useEffect(() => {
    services.getAll().then((response) => {
      setNotes(response);
    });
  }, []);

  // States
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMenssage] = useState("some error happened...");
  // Filter
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  // Add note
  const addNote = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };

    services.create(noteObject).then(() => {
      setNotes(notes.concat(noteObject));
      setNewNote('');
    });
  };

  //Events handler
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    services.update(id, changedNote).then((response) => {
      setNotes(notes.map((note) => (note.id !== id ? note : response)));
    }).catch(error => {
      setErrorMenssage(`
        Note '${note.content}' war alredy removed from server
      `)
      setTimeout(() => {
        setErrorMenssage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(({ id, content, important }) => (
          <Note
            key={id}
            content={content}
            important={important}
            handle={() => toggleImportanceOf(id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          type="text"
          name="note"
          id="note"
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
