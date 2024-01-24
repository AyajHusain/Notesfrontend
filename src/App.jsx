import Note from './components/Note'
import noteService from './service/notes'
import {useState,useEffect} from 'react'
import Notification from './components/Error'
import Footer from './components/Footer'
const App = () =>{

  const [notes,setNotes] = useState([])
  const [newNote,setNewNote] = useState('a new note...')
  const [showAll,setshowAll] = useState(true)
  const [errorMessage,setErrorMessage] = useState()

  useEffect(()=>{
   noteService.getAll()
    .then(initialNote=>{
      setNotes(initialNote)
    })
     
  },[])

  const notesToShow = showAll ? notes:notes.filter(note=>note.important)


  const addNote = (event) =>{
    event.preventDefault()
    const noteObject = {
      content:newNote,
      important:Math.random<0.5,
    }
    noteService.create(noteObject)
      .then(returnedNote=>{
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

  const handleChange = (event) =>{
    setNewNote(event.target.value)
  }

  const toggleImportance = id =>{
    const note = notes.find(n=>n.id===id)
    const changedNote = {...note,important:!note.important}
    noteService
      .update(id,changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n=>n.id!==id?n:returnedNote))
      
    })
      .catch(error=>{
        setErrorMessage(
          `the note ${note.content} was already deleted from the server`
          )
        setTimeout(()=>{
          setErrorMessage(null)
        },5000)
        setNotes(notes.filter(n=>n.id!==id))
      })

  }

  return(
    <div>
      <h1>Notes</h1>
      {errorMessage&&<Notification message = {errorMessage}/>}
      <div>
        <button onClick = {()=>setshowAll(!showAll)}>
          show {showAll?'important':'all'}
        </button>
      </div>
      <ul>
        {
          notesToShow.map(note=>
            <Note key = {note.id} note = {note} toggleImportanceOf = {()=>toggleImportance(note.id)}/>
            )
        }
      </ul>
      <form onSubmit = {addNote}>
        <input value = {newNote}
          onChange = {handleChange}/>
        <button type = "submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}
export default App