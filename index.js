import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
const baseLink = "https://v2.jokeapi.dev/joke/";

app.get("/", async(req,res)=>{
    // try{
    //     const result = await axios.get ({baseLink});
    //     result.reder("index.ejs",{
    //         joke: JSON.stringify(result.joke),
    //     });
    //     console.log(JSON.stringify(result.joke));
    // } catch(error){
    //     console.log(error);

    // }
    res.render("index.ejs",{
        joke :  "No joke to be displayed"
    });
});
app.post("/get-joke", async(req,res)=>{
    try{

        // Adding category 
        let category =[];
        var addLink= "";
        if((req.body.options)==="any"){
            addLink = "any";    
        }else{
            req.body.dark ? category.push("dark") : undefined;
            req.body.misc ? category.push("misc") : undefined;
            req.body.pun ? category.push("pun") : undefined;
            req.body.programming ? category.push("programming") : undefined;
        }
        for(var i=0 ; i<category.length ; i++){
            if(i==0){
                addLink+=category[i];
            }else{
                addLink= addLink+","+category[i];
            }
        }

        
        // Adding query paameters
        let param="?";
        param = req.body.parts==="onePart" ? `${param}type=single&` : param ;  
        param = req.body.parts==="twoPart" ? `${param}type=twopart&` : param ;
        param = req.body.message ? `${param}contains=${req.body.message}&` : param ;
        param = req.body.language==="english" ? `${param}lang=en&` : param ;
        param = req.body.language==="german" ? `${param}lang=de&` : param ;
        param = req.body.language==="spanish" ? `${param}lang=es&` : param ;
        param = req.body.language==="french" ? `${param}lang=fr&` : param ;
        

        var finalLink=`${baseLink+addLink+param}`;
        console.log(finalLink); 
        const result = await axios.get (finalLink); 

        if(result.data.type==="twopart"){
            var tp=true;
            var payload={
                setup:result.data.setup,
                delivery:result.data.delivery
            }
        } else{
            var tp=false;
            var payload =result.data.joke
        }

        res.render("index.ejs",{
            joke: payload,
            twoPart: tp
        });
    } catch(error){
        console.log(error);

    }

});
app.listen ( port , ()=>{
    console.log("Listening on port 3000");
})