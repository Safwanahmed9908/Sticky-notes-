const { useState, useEffect } = React;

// StickyNote component
function StickyNote({ note, onUpdate, onDelete }) {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isEditing, setIsEditing] = useState(false);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setIsEditing(true);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        setIsEditing(true);
    };

    const handleBlur = () => {
        if (isEditing) {
            onUpdate(note.id, { title, content });
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        onDelete(note.id);
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return React.createElement('div', { className: 'sticky-note' },
        React.createElement('div', { className: 'note-header' },
            React.createElement('input', {
                type: 'text',
                className: 'note-title',
                value: title,
                onChange: handleTitleChange,
                onBlur: handleBlur,
                placeholder: 'Note title...'
            }),
            React.createElement('button', {
                className: 'delete-btn',
                onClick: handleDelete,
                title: 'Delete note'
            }, '×')
        ),
        React.createElement('textarea', {
            className: 'note-content',
            value: content,
            onChange: handleContentChange,
            onBlur: handleBlur,
            placeholder: 'Write your note here...'
        }),
        React.createElement('div', { className: 'note-date' },
            formatDate(note.updatedAt)
        )
    );
}

// Main App component
function App() {
    const [notes, setNotes] = useState([]);

    // Load notes from localStorage on component mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('sticky-notes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    // Save notes to localStorage whenever notes change
    useEffect(() => {
        localStorage.setItem('sticky-notes', JSON.stringify(notes));
    }, [notes]);

    const addNote = () => {
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            content: '',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        setNotes([newNote, ...notes]);
    };

    const updateNote = (id, updates) => {
        setNotes(notes.map(note => 
            note.id === id 
                ? { ...note, ...updates, updatedAt: Date.now() }
                : note
        ));
    };

    const deleteNote = (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(notes.filter(note => note.id !== id));
        }
    };

    return React.createElement('div', { className: 'app-container' },
        React.createElement('div', { className: 'header' },
            React.createElement('h1', null, '📝 Sticky Notes'),
            React.createElement('button', {
                className: 'add-note-btn',
                onClick: addNote
            }, '+ Add New Note')
        ),
        React.createElement('div', { className: 'notes-container' },
            notes.length === 0 
                ? React.createElement('div', { className: 'empty-state' },
                    React.createElement('p', null, 'No notes yet. Click "Add New Note" to get started!')
                  )
                : notes.map(note => 
                    React.createElement(StickyNote, {
                        key: note.id,
                        note: note,
                        onUpdate: updateNote,
                        onDelete: deleteNote
                    })
                  )
        )
    );
}

// Render the app using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
