const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
// app.use(morgan('tiny'))
// app.use(morgan(':method :url :body'))

let persons = 
[
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
    // { name: "Arto Hellas", number: "040-123456", id: 5 },
  ]

 // 1. Define the custom 'body' token globally. Match the 'req' parameters!
morgan.token('body', (req) => {
  // Only display the body if it's a POST request and contains data
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return '' // Return empty string for GET/DELETE requests so it stays clean
})

// 2. Extend the standard 'tiny' format string by appending your custom :body token at the end
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/',(req,res)=>
  {
    res.send('<h2>Welcome to the Persons Directory</h2>')
  })

app.get('/api/persons',(req,res)=>
  {
    res.json(persons)
  })

app.get('/api/persons/:id',(req,res)=>
    {
      const id = Number(req.params.id)//without this persons.find won't work 
      const person = persons.find((item)=> item.id === id)

      if(person)
      {
        res.json(person)
      }
      else
      {
        res.status(404).json({error:"Invalid Route"})
      }
      
    })
  
app.delete('/api/persons/:id',(req,res)=>
  {
    const id = Number(req.params.id) //this is a string by default change to number
    persons = persons.filter(item=> item.id !== id)

    res.status(204).end()

  })
  

app.post('/api/persons',(req,res)=>
  {
    const body = req.body
    const id = Math.floor(Math.random() * Date.now())

    const search = persons.find(item=> item.name.toLowerCase() === body.name.toLowerCase())

    const newPerson = 
    {
      name:body.name,
      id:id,
      number:body.number
    }

    if(!body.name || !body.number)
      {
        return res.status(400).json({error:"Missing name/number"})
      }
    else if(search)
     {
      return res.status(400).json({error:"name must be unique"})
     }
    else
      {
        persons = persons.concat(newPerson)
        res.json(newPerson)
      }
      // morgan.token('body', request => JSON.stringify(req.body))
  })

//the page must indicate when the request was made and how much 
// phonebook information is in the table in the application's memory
app.get('/info',(req,res)=>
  {
    const personsCount = persons.length 
    res.send(`<p>Phonebook has info for ${personsCount} people</p>
              <p>${new Date()}</p>`)
  })

const PORT = 3001
app.listen(PORT,()=>
  {
    console.log(`running server on port: ${PORT}`)
  })

  /*
  How tiny actually works under the hoodThe tiny configuration 
  string is just a shortcut. Under the hood, Morgan reads it as 
  this exact string of tokens:':method :url :status :res[content-length] - :response-time ms'To include the body payload, you can take that exact format string and place your custom :body token right at the end.
  */
