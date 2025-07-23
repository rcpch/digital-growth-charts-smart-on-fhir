import { RCPCHChart } from '@rcpch/digital-growth-charts-react-component-library'
import './App.css'

function App({ title, sex }: { title: string, sex: 'male' | 'female' }) {
  return (
    <RCPCHChart
        reference={'uk-who'}
        measurementMethod={'height'}
        sex={sex}
        title={title}
        measurements={{
          "height": []
        }}
        theme={'traditional'}
        enableZoom
        chartType={'centile'}
        enableExport={false}
        exportChartCallback={()=>{}} // this is a callback for the export chart function if true
        clinicianFocus={false}
    />
  )
}

export default App
