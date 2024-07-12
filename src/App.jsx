import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

//Components
import Home from './Components/Home/Home'
import Container from './Container'
import Login from './Components/Login/Login';
import Form from './Components/Form/Form';
import PDFView from './Components/PDF/PDFView';
import SignUp from './Components/SignUp/SignUp';
import ViewProfile from './Components/ViewProfile/ViewProfile';
import EditEvent from './Components/EditEvent/EditEvent';

export default function App() {

  const event = {
    _id:"",
    date:"",
    session:"",
    audience:0,
    venue:"",
    venueName:"",
    event:"",
    image:"",
    description:"",
    link:"",
    target_audience:[],
    startTime:"",
    endTime:""  
  }

  return (
    <Provider store={store}>
      <Container>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/sign-up" element={<SignUp />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path='/add-event' element={<Form formType={"Create"} eventData={event}/>}></Route>
            <Route path='/pdf' element={<PDFView />}></Route>
            <Route path='/view-profile' element={<ViewProfile />}></Route>
            <Route path='/edit-event/:_id' element={<EditEvent />}></Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </Provider >
  )
}