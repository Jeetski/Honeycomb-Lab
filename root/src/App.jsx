import BeatStore from './components/BeatStore'
import VipDealModal from './components/VipDealModal.jsx'
import ToolsLanding from './components/ToolsLanding.jsx'

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const normalizedPath = path.replace(/\/+$/, '') || '/'

  if (normalizedPath === '/tools') {
    return <ToolsLanding />
  }

  return (<>
    <BeatStore />
    <VipDealModal />
  </>)
}

export default App
