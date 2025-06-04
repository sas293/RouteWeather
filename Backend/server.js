    import express from 'express'
    import cors from 'cors'
    import dotenv from 'dotenv'
    import cookieParser from 'cookie-parser';
    import routeRoutes from './routes/route.js'
    const app = express();
    const port = 3000

    dotenv.config();
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use('/',(req,res,next)=>{
        console.log('Request generated');
        next();
    })
    

    app.use('/route',routeRoutes);

    app.get('/', (req, res) => {
    res.send('Hello World!')
    })
    

    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })
