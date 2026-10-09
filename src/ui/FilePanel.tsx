import './FilePanel.css'
import { useDocument } from '../context/DocumentContext.tsx';

export function FilePanel() {
    const { document: geomDocument, setDocument } = useDocument();

    const handleExport = () => {
        const data = JSON.stringify(geomDocument, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = 'document.json';
        a.click();
        URL.revokeObjectURL(url);
        setDocument({ ...geomDocument, points: [], lines: [], circles: [] });
    };

    return (
        <>
            <p>Points: {geomDocument.points.length} · Lines: {geomDocument.lines.length} · Circles: {geomDocument.circles.length}</p>
            <button onClick={() => console.log('Save (not implemented)', geomDocument)}>Save</button>
            <button onClick={() => console.log('Load (not implemented)')}>Load</button>
            <button onClick={handleExport}>Export</button>
        </>
    )
}