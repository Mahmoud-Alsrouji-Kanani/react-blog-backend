import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();
app.use(bodyParser.json());

const withDB =  async (operations) => {
    try {  
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }); 
        const db = client.db('react-blog');
        await operations(db);
        client.close();
    } catch(error) {
        res.status(200).json({ message: 'Error connecting to db!', error });
    }
}

app.get('/api/articles/:name', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articleInfo);
    });
});

app.post('/api/articles/:name/upvote', async (req, res) => {
    try {
        const articleName = req.params.name;
    
        //articlesInfo[articleName].upvotes += 1;
        //res.status(200).send(`${articleName} no has ${articlesInfo[articleName].upvotes} upvotes.`);
    
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }); 
        const db = client.db('react-blog');
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName }, {
            '$set': {
                upvotes: articleInfo.upvotes + 1
            }
        });
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(updatedArticleInfo);
        client.close();
    } catch(error) {
        res.status(200).json({ message: 'Error connecting to db!', error });
    }
});

app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;
    articlesInfo[articleName].comments.push({ username, text });
    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log('Listening on port 8000'));
