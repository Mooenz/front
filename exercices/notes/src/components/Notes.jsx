const Note = ({ content, important, handle }) => {
  const label = important ? 'make not important' : 'make important';

  return (
    <li className="note">
      {content} 
      <button onClick={handle}>{label}</button>
    </li>
  )
};

export default Note;
