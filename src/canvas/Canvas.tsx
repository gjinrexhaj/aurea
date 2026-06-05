import "./Canvas.css"


type CanvasProps = {
    activeTool: string;
};


export default function Canvas({activeTool}: CanvasProps) {

    function handlePointerDown() {
       console.log(activeTool);
    }

    return (

        <div className="canvas"
             onPointerDown={handlePointerDown}
        >
            Canvas
            <br />


            Active Tool: {activeTool}
        </div>

    );
}