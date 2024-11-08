import FormUser from './pages/FormUser/FormUser'
import { Header } from './components/header/header'
import ListUser from './pages/ListUser/ListUser'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {

  return (

    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element = {<ListUser/>}/>       
        <Route path='/cadastro-usuario' element = {<FormUser/>}/> 
        <Route path='/editar-usuario/:userId' element = {<FormUser/>}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
