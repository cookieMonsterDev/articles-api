import express from 'express';


const app = express();

app.use(express.json());

app.listen(3000, () => {console.log('hello world')})

app.get('/', (req, res) => {
  res.send({data: 'hello'})
})

