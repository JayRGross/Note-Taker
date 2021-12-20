// Dependencies

const express = require("express");
const fs = require('fs');
const path = requre('path');

//Setting up the server

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extedned:true}));

// On the back end, the application should include a `db.json` file that will be used to store and retrieve notes using the `fs` module.

// The following HTML routes should be created:

// * `GET /notes` should return the `notes.html` file.

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// *GET* should return the index.html file.
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

// API routes should be created
// *GET* /api/notes should read the 'db.json' file and return all saved notes as JSON

app.get('/api/notes', (req,res) => {
    fs.readFile('./db/db.json', 'utf-8', (err,data) => {
        if (err) throw err
        res.json(JSON.parse(data))
    })
})

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
    console.log(req.method + "route hit")
    if(req.body.title && req.body.text) {
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: Math.floor(Math.random()*1000)
        }
        console.log('Saving Note....', newNote)
        // read the json file

        fs.readFile('./db/db.json', 'utf-8', (err,data) => {
            if (err) throw err
            console.log(data)
            const parsedNotes = JSON.parse(data)
            parsedNotes.push(newNote)
            let stringifyNotes = JSON.stringify(parsedNotes)
            fs.writeFile('./db/db.json', stringifyNotes, (err) => {
                if (err) throw err
                res.status(200).send('Note has been saved')
            })
        })
    } else {
        res.status(400).send('You didnt send sufficient information for a note to be generated.')
    }

})


app.delete('/api/notes/:id', (req,res) => {
    fs.readFile('./db/db.json', 'utf-8', (err,data) => {
        const deleteNote = req.params.id
        if (err) throw err
        console.log(data)
        const noteArray = JSON.parse(data)
        const filteredNoteArray = noteArray.filter( note => {
            if(deleteNote != note.id) {
                return true
            }
            else {
                return false
            }
        })
        
        let stringifyFilteredNoteArray = JSON.stringify(filteredNoteArray)
        fs.writeFile('./db/db.json',stringifyFilteredNoteArray, (err) => {
            if (err) throw err
            res.status(200).send('Note has been deleted')
        })
    })
})
app.listen(PORT, () => {
console.log(`Server listening on http://localhost:${PORT}`)
})