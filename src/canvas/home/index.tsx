import React , {useState,useRef,useEffect} from 'react';

import Draggable from 'react-draggable'
// import { Button } from '@components/ui';
import { ColorSwatch, DEFAULT_THEME } from "@mantine/core";
// import React = require('react');
import axios from 'axios';
import { AiOutlineDownload } from 'react-icons/ai';
import { render } from 'react-dom';



interface resp{
    expr: string;
    result: string;
    assign: boolean;
}


interface gen_res{
  exp1: string;
  ans: string;

}



export default function Home() {
    const canvasRef= useRef<HTMLCanvasElement>(null) ;
    const [isDrawing, setIsDrawing] = useState(false);
    const [colour, setIsColour] = useState(DEFAULT_THEME.colors.blue[6]);
    const [reset,setReset]=useState(false);
    const [latex,setLatex]=useState<Array<string>>([]);
    const [data,setData]=useState<gen_res>();
    const [latexpos,setPos]=useState({x:10,y:50});
    // const [res,setRes]=useState<resp>();
    const [dict,setdict]=useState({});
    const [eraserMode, setEraserMode] = useState(false);
    

    const latexRef = useRef<HTMLDivElement>(null);
    const customPalette = [
        "#FFFFFF", // Black
        "#FF0000", // Red
        "#00FF00", // Green
        "#0000FF", // Blue
        "#FFFF00", // Yellow
        "#FF00FF", // Magenta
        "#00FFFF", // Cyan
        "#FFA500", // Orange
        "#7a81ff", // Purple
        "#808080", // Gray
      ];

    
      


     useEffect(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx=canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.strokeStyle=colour;
        ctx.lineWidth=3;
        ctx.lineCap='round';

        const script= document.createElement('script');
        script.src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
        script.async=true;
        document.head.appendChild(script);

        script.onload=()=>{
          window.MathJax.Hub.Config({
            tex2jax: {
              inlineMath: [['$', '$'], ['\\(', '\\)']],
              // processEscapes: true,
            },
          });

        }

        return () => {
          document.head.removeChild(script);
      };

    },[]);

    useEffect(()=>{
      if(data){
        render_latex(data.exp1,data.ans);
      }

    },[data]);

    useEffect(()=>{ 
      if(window.MathJax && latex.length>0){
        setTimeout(() => {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
      }
    },[latex]);

    useEffect(()=>{
      if(reset){

        resetCanvas();
        setData(undefined);
        setLatex([]);
        setdict({});
        setReset(false);
      }
    },[ reset]);


    const render_latex = (exp1:string,ans:string) => {
      const l =  `\\(\\LARGE{${exp1} = ${ans}}\\)`;
      setLatex([...latex,l]);

      const canvas=canvasRef.current;
      if (!canvas) return;
      const ctx=canvas.getContext('2d');
      if (!ctx) return;
      // ctx.clearRect(0,0,canvas.width,canvas.height);
      
      
    }


    const startDrawing = (e:React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.style.background='black';
        const ctx=canvas.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);

        
    }

    const finishDrawing = () => {
        setIsDrawing(false);
    }

    const draw =(e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx=canvas.getContext('2d');
        if (!ctx) return;
        // ctx.strokeStyle=colour;
        ctx.lineWidth = eraserMode ? 20 : 3;
        ctx.strokeStyle = eraserMode ? "#000000" : colour;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();

    }

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
    
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };


      const downloadNotes = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const link = document.createElement("a");
        link.download = "notes.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      };


    const send_data = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        const res = await axios({
          method: 'post',
          url: `http://localhost:3000/calc`,
          data: {
              image: canvas.toDataURL('image/png'),
              dict_of_var: dict
          }
      });
        const res_data = await res.data;
        // console.log(res_data.data);
        res_data.data.forEach((ele:resp)=>{

          if(ele.assign===true){
            setdict({...dict,[ele.expr]:ele.result})
          }
        })

        const ctx=canvas.getContext('2d')
        const imgd=ctx!.getImageData(0,0,canvas.width,canvas.height);

        let minX=canvas.width;
        let minY=canvas.height;
        let maxX=0, maxY=0;
        for( let i=0;i<canvas.width;i++)
        {
          for (let j=0;j<canvas.height;j++)
          {
            const t=(i*canvas.width+j)*4;
            if(imgd.data[t+3]>0){
              
              minX = Math.min(minX, j);
                        minY = Math.min(minY, i);
                        maxX = Math.max(maxX, j);
                        maxY = Math.max(maxY, i);
            }
          }
        }

        const cenX=(minX+maxX)/2;
        const ceny=(minY+maxY)/2;

        setPos({x:cenX,y:ceny});

        res_data.data.forEach((ele:resp)=>{
          setTimeout(() => {
            setData({
              exp1:ele.expr,
              ans:ele.result
            })
          }, 1000);
        })

        
      } catch (error) {
        // console.log(canvas.toDataURL('image/png'));
        
        console.error("Error sending data:", error);
      }
      

    }


    return (
        
      <>
        <div style={{ position: "relative", height: "100vh"  }}>

     <div className=" relative top-0 left-0 w-full flex justify-center items-center gap-4 p-2 bg-gray-800 rounded-xl z-10 ">
        {customPalette.map((color, index) => (
          <ColorSwatch
            key={index}
            color={color}
            onClick={() => setIsColour(color)} // Set the brush color on click
            className={`cursor-pointer rounded-full transition-all ${
              colour === color ? "ring-4 ring-white" : ""
            }`}
            size={30} // Size of each color swatch
          />
        ))}
        
         

      </div>

      <div className="w-full flex justify-between p-4 absolute top-9 z-10">
          <button
            className="bg-gray-600 text-white rounded-lg px-4 py-2"
            onClick={() => setReset(true)}
          >
            Reset
          </button>
          
          <button
                        className={`bg-gray-600 text-white rounded-lg px-4 py-2 ${eraserMode ? 'ring-4 ring-white' : ''}`}
                        onClick={() => setEraserMode(prev => !prev)}  // Toggle eraser mode
                    >
                        {eraserMode ? 'Draw' : 'Erase'}
                    </button>
                    <button
            className="bg-gray-600 text-white rounded-lg px-4 py-2"
            onClick={send_data}
          >
            Run
          </button>
                  

        </div>

        <div
        className="absolute top-2 right-4 cursor-pointer text-white z-10"
        onClick={downloadNotes}
        title="Download Notes"
      >
        <AiOutlineDownload size={32} />
      </div>

        <canvas ref={canvasRef} className='h-full w-full absolute  bg-black top-0 left-0' id='canvas' 
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
        onMouseMove={draw}
        
        />
        {latex && latex.map((l, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexpos}
                    onStop={(e, data: { x: number; y: number }) => setPos({ x: data.x, y: data.y })}
                >
                    <div  ref={latexRef} className="absolute p-2 text-white rounded shadow-md">
                        <div className="latex-content">{l}</div>
                    </div>
                </Draggable>
            ))}
        </div>
        </>
    );
}