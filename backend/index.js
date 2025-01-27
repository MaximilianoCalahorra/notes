//Obtenemos el servidor:
const express = require('express')

//Obtenemos CORS:
const cors = require('cors')

//Lo ponemos en funcionamiento:
const app = express()

//Activamos el parseador a JSON de Express:
app.use(express.json())

//Usamos CORS:
app.use(cors())

//Para servir archivos estáticos:
app.use(express.static('dist'))

//Definimos los datos de las notas:
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

//Hello World:
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

//Obtener notas:
app.get('/api/notes', (request, response) => {
    response.json(notes)
})

//Obtener nota por id:
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if(note) 
    {
        response.json(note)
    } 
    else 
    {
        response.status(404).send(`There isn't a note with id ${id}`)
    }
})

//Eliminar nota por id:
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    
    response.status(204).end()
})

//Generar siguiente id:
const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId + 1
}

//Agregar una nota:
app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content) 
    {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})