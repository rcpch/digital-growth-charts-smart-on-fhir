import { RCPCHChart } from '@rcpch/digital-growth-charts-react-component-library';
import './App.css';
import { useState } from 'react';

function App({ title, sex, measurements }: { title: string, sex: 'male' | 'female', measurements: any }) {
  const [measurementMethod, setMeasurementMethod] = useState<'height' | 'weight'>('height');

  return <>
    <div>
      <button onClick={() => setMeasurementMethod('height')}>Height</button>
      <button onClick={() => setMeasurementMethod('weight')}>Weight</button>
    </div>
    <RCPCHChart
        reference={'uk-who'}
        measurementMethod={measurementMethod}
        sex={sex}
        title={title}
        measurements={{ [measurementMethod]: measurements[measurementMethod] || [] }}
        theme={'traditional'}
        enableZoom
        chartType={'centile'}
        enableExport={false}
        exportChartCallback={()=>{}} // this is a callback for the export chart function if true
        clinicianFocus={false}
    />
  </>;
}

export default App
