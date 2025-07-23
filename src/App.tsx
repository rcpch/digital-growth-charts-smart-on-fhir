import { RCPCHChart } from '@rcpch/digital-growth-charts-react-component-library'
import './App.css'

function App() {
  return (
    <RCPCHChart
        reference={'uk-who'}
        measurementMethod={'height'}
        sex={'female'}
        title={"Arthur Scargill - 12345678A"}
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
