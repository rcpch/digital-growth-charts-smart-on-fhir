import { RCPCHChart } from '@rcpch/digital-growth-charts-react-component-library';
import './App.css';
import { useState } from 'react';

function App({ title, sex, measurements }: { title: string, sex: 'male' | 'female', measurements: any }) {
  const [view, setView] = useState<'height_centile' | 'weight_centile' | 'sds'>('height_centile');

  let measurementMethod: any = 'height';
  let chartType: 'centile' | 'sds' = 'centile';
  
  switch (view) {
    case 'height_centile':
      measurementMethod = 'height';
      break;
    case 'weight_centile':
      measurementMethod = 'weight';
      break;
    case 'sds':
      chartType = 'sds';
      // all measurements plotted anyway
      break;
  }

  return <>
    <div>
      <label>
        <input type="radio" value="height_centile" checked={view === 'height_centile'} onChange={() => setView('height_centile')} />
        Height
      </label>
      <label>
        <input type="radio" value="weight_centile" checked={view === 'weight_centile'} onChange={() => setView('weight_centile')} />
        Weight
      </label>
      <label>
        <input type="radio" value="sds" checked={view === 'sds'} onChange={() => setView('sds')} />
        SDS
      </label>
    </div>
    <RCPCHChart
        // Workaround charts bug (https://github.com/rcpch/digital-growth-charts-react-component-library/issues/168)
        key={measurementMethod}
        reference={'uk-who'}
        measurementMethod={measurementMethod}
        sex={sex}
        title={title}
        measurements={measurements}
        theme={'traditional'}
        enableZoom
        chartType={chartType}
        enableExport={false}
        exportChartCallback={()=>{}} // this is a callback for the export chart function if true
        clinicianFocus={false}
    />
  </>;
}

export default App
